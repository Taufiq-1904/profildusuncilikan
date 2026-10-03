import { requireSession, requireWilayah } from "./access";
import { canManageWilayah, type SessionUser } from "./auth";
import { type DusunOfficial } from "./data/dusunOfficialsData";
import { getWilayahLabel, getWilayahLevel } from "./data/wilayahData";
import { rowToOfficial } from "./db/mappers";
import { toUserError } from "./db/errors";
import { droppedMedia, removeMedia } from "./image-upload";
import { createRemoteStore } from "./remoteStore";
import { getSupabase } from "./supabase/client";

async function loadOfficials(): Promise<DusunOfficial[]> {
  const { data, error } = await getSupabase()
    .from("dusun_officials")
    .select("*")
    .order("tier", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw toUserError(error, "Struktur organisasi gagal dimuat.");
  return (data ?? []).map(rowToOfficial);
}

export const dusunOfficialStore = createRemoteStore<DusunOfficial>({ load: loadOfficials });

export type DusunOfficialInput = Pick<
  DusunOfficial,
  "name" | "position" | "photo" | "period" | "ownerId" | "wilayahId" | "tier" | "order"
>;

// Struktur dikelola per wilayah: akun Dusun untuk dusun (dan semua wilayah),
// akun RW untuk RW-nya beserta RT di bawahnya, akun RT untuk RT-nya.
// Ini hanya untuk tampilan dan pesan ramah; yang mengikat adalah Row Level
// Security di database (policy off_write).
export function canManageStructure(session: SessionUser | null, ownerId: string): boolean {
  return canManageWilayah(session, ownerId);
}

function headConflict(wilayahId: string, name: string): Error {
  return new Error(
    `${name} sudah tercatat sebagai kepala ${getWilayahLabel(wilayahId)}. Ubah nama pada baris tersebut, atau lepas penanda kepalanya terlebih dahulu.`
  );
}

function validate(input: DusunOfficialInput, selfId?: string): void {
  if (!input.name.trim()) throw new Error("Nama wajib diisi.");
  if (!input.position.trim()) throw new Error("Jabatan wajib diisi.");
  if (!Number.isInteger(input.tier) || input.tier < 1) throw new Error("Baris harus bilangan bulat mulai dari 1.");
  if (!Number.isInteger(input.order) || input.order < 1) throw new Error("Urutan harus bilangan bulat mulai dari 1.");
  if (!getWilayahLevel(input.ownerId)) throw new Error("Wilayah tidak dikenal.");
  if (input.wilayahId) {
    if (input.wilayahId !== input.ownerId) throw new Error("Kepala wilayah hanya bisa ditandai pada struktur wilayahnya sendiri.");
    const other = dusunOfficialStore
      .getState()
      .items.find((o) => o.wilayahId === input.wilayahId && o.id !== selfId);
    if (other) throw headConflict(input.wilayahId, other.name);
  }
}

function toRow(input: DusunOfficialInput) {
  return {
    name: input.name.trim(),
    position: input.position.trim(),
    photo: input.photo ?? null,
    period: input.period?.trim() || null,
    owner_id: input.ownerId,
    wilayah_id: input.wilayahId || null,
    tier: input.tier,
    sort_order: input.order,
  };
}

export async function createOfficial(input: DusunOfficialInput): Promise<DusunOfficial> {
  requireWilayah(requireSession(), input.ownerId);
  validate(input);

  const { data, error } = await getSupabase().from("dusun_officials").insert(toRow(input)).select("*").single();
  if (error?.code === "23505") throw headConflict(input.wilayahId ?? "", "Orang lain");
  if (error || !data) throw toUserError(error ?? { message: "no data" }, "Data gagal disimpan.");

  await dusunOfficialStore.refresh();
  return rowToOfficial(data);
}

export async function updateOfficial(id: string, input: DusunOfficialInput): Promise<DusunOfficial> {
  const session = requireSession();
  const existing = dusunOfficialStore.getState().items.find((o) => o.id === id);
  if (!existing) throw new Error("Data tidak ditemukan.");
  // Harus berhak atas wilayah asal DAN wilayah tujuan (kalau pindah).
  requireWilayah(session, existing.ownerId);
  requireWilayah(session, input.ownerId);
  validate(input, id);

  const { data, error } = await getSupabase()
    .from("dusun_officials")
    .update(toRow(input))
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error?.code === "23505") throw headConflict(input.wilayahId ?? "", "Orang lain");
  if (error) throw toUserError(error, "Data gagal disimpan.");
  if (!data) throw new Error("Data tidak ditemukan atau Anda tidak memiliki akses.");

  await removeMedia(droppedMedia([existing.photo], [input.photo]));
  await dusunOfficialStore.refresh();
  return rowToOfficial(data);
}

export async function deleteOfficial(id: string): Promise<void> {
  const existing = dusunOfficialStore.getState().items.find((o) => o.id === id);
  if (!existing) throw new Error("Data tidak ditemukan.");
  requireWilayah(requireSession(), existing.ownerId);

  const { error } = await getSupabase().from("dusun_officials").delete().eq("id", id);
  if (error) throw toUserError(error, "Data gagal dihapus.");

  await removeMedia([existing.photo]);
  await dusunOfficialStore.refresh();
}

export type { DusunOfficial };
