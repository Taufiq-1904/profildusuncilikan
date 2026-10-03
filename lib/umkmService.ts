import { requireSession, requireWilayah, AccessError } from "./access";
import { canManageWilayah, type SessionUser } from "./auth";
import { MAX_UMKM_GALLERY, type UMKM } from "./data/umkmData";
import { getWilayahLevel } from "./data/wilayahData";
import { rowToUmkm } from "./db/mappers";
import { toUserError } from "./db/errors";
import { saveWithUniqueSlug } from "./db/slug";
import { validateLocation } from "./geo";
import { droppedMedia, removeMedia } from "./image-upload";
import { createRemoteStore } from "./remoteStore";
import { getSupabase } from "./supabase/client";
import { slugify } from "./utils";

async function loadUmkm(): Promise<UMKM[]> {
  const { data, error } = await getSupabase().from("umkm").select("*").order("nama", { ascending: true });
  if (error) throw toUserError(error, "Data UMKM gagal dimuat.");
  return (data ?? []).map(rowToUmkm);
}

export const umkmStore = createRemoteStore<UMKM>({ load: loadUmkm });

export type UmkmInput = Omit<UMKM, "id" | "createdBy" | "createdAt" | "updatedAt">;

// --- policy ----------------------------------------------------------------

export function canManageUmkm(session: SessionUser | null, umkm: UMKM): boolean {
  return canManageWilayah(session, umkm.rtId);
}

// --- selectors (pure, so hooks and pages can reuse them) --------------------

function byName(a: UMKM, b: UMKM): number {
  return a.nama.localeCompare(b.nama, "id");
}

export function selectActiveUmkm(all: UMKM[]): UMKM[] {
  return all.filter((u) => u.aktif).sort(byName);
}

export function selectManageableUmkm(all: UMKM[], session: SessionUser | null): UMKM[] {
  return all.filter((u) => canManageUmkm(session, u)).sort(byName);
}

export function selectUmkmByRT(all: UMKM[], rtId: string): UMKM[] {
  return all.filter((u) => u.rtId === rtId).sort(byName);
}

export function findUmkmBySlug(all: UMKM[], slug: string): UMKM | undefined {
  return all.find((u) => u.slug === slug);
}

export function findUmkmById(all: UMKM[], id: string): UMKM | undefined {
  return all.find((u) => u.id === id);
}

// --- mutations -------------------------------------------------------------

function guessSlug(base: string, all: UMKM[], excludeId?: string): { guess: string; root: string } {
  const root = slugify(base) || "umkm";
  const taken = new Set(all.filter((u) => u.id !== excludeId).map((u) => u.slug));
  let guess = root;
  for (let n = 2; taken.has(guess); n += 1) guess = `${root}-${n}`;
  return { guess, root };
}

function validate(input: UmkmInput): void {
  if (!input.nama.trim()) throw new Error("Nama UMKM wajib diisi.");
  if (!input.jenis.trim()) throw new Error("Kategori usaha wajib diisi.");
  if (getWilayahLevel(input.rtId) !== "rt") throw new Error("Pilih RT tempat usaha ini berada.");
  validateLocation(input);
  if (input.galeri.length > MAX_UMKM_GALLERY) {
    throw new Error(`Galeri maksimal ${MAX_UMKM_GALLERY} foto.`);
  }
}

function clean(value?: string): string | null {
  const v = value?.trim();
  return v || null;
}

function toRow(input: UmkmInput, slug: string) {
  return {
    slug,
    nama: input.nama.trim(),
    jenis: input.jenis.trim(),
    pemilik: input.pemilik.trim(),
    tampilkan_pemilik: input.tampilkanPemilik,
    kontak: clean(input.kontak),
    deskripsi: clean(input.deskripsi),
    produk: clean(input.produk),
    alamat: clean(input.alamat),
    jam_operasional: clean(input.jamOperasional),
    maps_url: clean(input.mapsUrl),
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    logo: input.logo ?? null,
    galeri: input.galeri,
    aktif: input.aktif,
    rt_id: input.rtId,
  };
}

export async function createUmkm(input: UmkmInput): Promise<UMKM> {
  const session = requireSession();
  requireWilayah(session, input.rtId);
  validate(input);

  const supabase = getSupabase();
  const { guess, root } = guessSlug(input.slug || input.nama, umkmStore.getState().items);
  const { data, error } = await saveWithUniqueSlug(guess, root, (slug) =>
    supabase
      .from("umkm")
      .insert({ ...toRow(input, slug), created_by: session.userId })
      .select("*")
      .single()
  );
  if (error || !data) throw toUserError(error ?? { message: "no data" }, "UMKM gagal disimpan.");

  await umkmStore.refresh();
  return rowToUmkm(data);
}

export async function updateUmkm(id: string, input: UmkmInput): Promise<UMKM> {
  const session = requireSession();
  const all = umkmStore.getState().items;
  const existing = findUmkmById(all, id);
  if (!existing) throw new Error("UMKM tidak ditemukan.");
  // Both ends are checked: the account must own the current RT and the RT the
  // business is being moved to.
  if (!canManageUmkm(session, existing)) throw new AccessError();
  requireWilayah(session, input.rtId);
  validate(input);

  const supabase = getSupabase();
  const { guess, root } = guessSlug(input.slug || input.nama, all, id);
  const { data, error } = await saveWithUniqueSlug(guess, root, (slug) =>
    supabase.from("umkm").update(toRow(input, slug)).eq("id", id).select("*").maybeSingle()
  );
  if (error) throw toUserError(error, "UMKM gagal disimpan.");
  if (!data) throw new AccessError();

  await removeMedia(
    droppedMedia([existing.logo, ...existing.galeri], [input.logo, ...input.galeri])
  );
  await umkmStore.refresh();
  return rowToUmkm(data);
}

export async function setUmkmActive(id: string, aktif: boolean): Promise<UMKM> {
  const session = requireSession();
  const existing = findUmkmById(umkmStore.getState().items, id);
  if (!existing) throw new Error("UMKM tidak ditemukan.");
  if (!canManageUmkm(session, existing)) throw new AccessError();

  const { data, error } = await getSupabase()
    .from("umkm")
    .update({ aktif })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw toUserError(error, "Status UMKM gagal diubah.");
  if (!data) throw new AccessError();

  await umkmStore.refresh();
  return rowToUmkm(data);
}

export async function deleteUmkm(id: string): Promise<void> {
  const session = requireSession();
  const existing = findUmkmById(umkmStore.getState().items, id);
  if (!existing) return;
  if (!canManageUmkm(session, existing)) throw new AccessError();

  const { data, error } = await getSupabase().from("umkm").delete().eq("id", id).select("id");
  if (error) throw toUserError(error, "UMKM gagal dihapus.");
  if (!data || data.length === 0) throw new AccessError();

  await removeMedia([existing.logo, ...existing.galeri]);
  await umkmStore.refresh();
}

export type { UMKM };
