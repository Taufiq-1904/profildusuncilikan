import { requireSession, requireWilayah } from "./access";
import { type RTPotensi } from "./data/potensiData";
import { rowToPotensi } from "./db/mappers";
import { toUserError } from "./db/errors";
import { droppedMedia, removeMedia } from "./image-upload";
import { createRemoteStore } from "./remoteStore";
import { getSupabase } from "./supabase/client";

async function loadPotensi(): Promise<RTPotensi[]> {
  const { data, error } = await getSupabase()
    .from("rt_potensi")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw toUserError(error, "Data potensi gagal dimuat.");
  return (data ?? []).map(rowToPotensi);
}

export const potensiStore = createRemoteStore<RTPotensi>({ load: loadPotensi });

export type PotensiInput = Omit<RTPotensi, "id" | "rtId">;

export function selectPotensiByRT(all: RTPotensi[], rtId: string): RTPotensi[] {
  return all.filter((p) => p.rtId === rtId);
}

function validate(data: PotensiInput): void {
  if (!data.judul.trim()) throw new Error("Judul potensi wajib diisi.");
}

export async function addPotensiRT(rtId: string, potensi: PotensiInput): Promise<RTPotensi> {
  requireWilayah(requireSession(), rtId);
  validate(potensi);

  const { data, error } = await getSupabase()
    .from("rt_potensi")
    .insert({
      rt_id: rtId,
      judul: potensi.judul.trim(),
      deskripsi: potensi.deskripsi.trim(),
      kategori: potensi.kategori,
      foto: potensi.foto ?? null,
    })
    .select("*")
    .single();
  if (error || !data) throw toUserError(error ?? { message: "no data" }, "Potensi gagal disimpan.");

  await potensiStore.refresh();
  return rowToPotensi(data);
}

export async function updatePotensiRT(id: string, data: PotensiInput): Promise<void> {
  const session = requireSession();
  const existing = potensiStore.getState().items.find((p) => p.id === id);
  if (!existing) throw new Error("Data potensi tidak ditemukan.");
  requireWilayah(session, existing.rtId);
  validate(data);

  const { data: rows, error } = await getSupabase()
    .from("rt_potensi")
    .update({
      judul: data.judul.trim(),
      deskripsi: data.deskripsi.trim(),
      kategori: data.kategori,
      foto: data.foto ?? null,
    })
    .eq("id", id)
    .select("id");
  if (error) throw toUserError(error, "Potensi gagal disimpan.");
  if (!rows || rows.length === 0) throw new Error("Potensi gagal disimpan. Periksa hak akses Anda.");

  await removeMedia(droppedMedia([existing.foto], [data.foto]));
  await potensiStore.refresh();
}

export async function deletePotensiRT(id: string): Promise<void> {
  const session = requireSession();
  const existing = potensiStore.getState().items.find((p) => p.id === id);
  if (!existing) return;
  requireWilayah(session, existing.rtId);

  const { data, error } = await getSupabase().from("rt_potensi").delete().eq("id", id).select("id");
  if (error) throw toUserError(error, "Potensi gagal dihapus.");
  if (!data || data.length === 0) throw new Error("Potensi gagal dihapus. Periksa hak akses Anda.");

  await removeMedia([existing.foto]);
  await potensiStore.refresh();
}

export { type RTPotensi };
