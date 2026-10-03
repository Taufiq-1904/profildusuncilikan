import { requireSession, requireWilayah, AccessError } from "./access";
import { canManageWilayah, type SessionUser } from "./auth";
import { createLocalStore } from "./localStore";
import { MAX_UMKM_GALLERY, normalizeUmkm, umkmSeed, type UMKM } from "./data/umkmData";
import { getWilayahLevel } from "./data/wilayahData";
import { validateLocation } from "./geo";
import { slugify } from "./utils";

// Same storage key as the previous version on purpose: records saved before
// this rewrite are upgraded by normalizeUmkm on read, not thrown away.
export const umkmStore = createLocalStore<UMKM>({
  key: "cilikan_umkm",
  seed: umkmSeed,
  normalize: normalizeUmkm,
});

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

export function findUmkmBySlug(all: UMKM[], slug: string): UMKM | undefined {
  return all.find((u) => u.slug === slug);
}

export function findUmkmById(all: UMKM[], id: string): UMKM | undefined {
  return all.find((u) => u.id === id);
}

// Plain reads for pages that are not subscribed to the store.
export function getAllUMKM(): UMKM[] {
  return umkmStore.getSnapshot();
}

export function getUMKMByRT(rtId: string): UMKM[] {
  return getAllUMKM().filter((u) => u.rtId === rtId);
}

// --- mutations -------------------------------------------------------------

function uniqueSlug(base: string, all: UMKM[], excludeId?: string): string {
  const root = slugify(base) || "umkm";
  const taken = new Set(all.filter((u) => u.id !== excludeId).map((u) => u.slug));
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
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

function clean(value?: string): string | undefined {
  const v = value?.trim();
  return v || undefined;
}

function normalizeInput(input: UmkmInput, all: UMKM[], excludeId?: string): UmkmInput {
  return {
    ...input,
    nama: input.nama.trim(),
    jenis: input.jenis.trim(),
    pemilik: input.pemilik.trim(),
    kontak: clean(input.kontak),
    deskripsi: clean(input.deskripsi),
    produk: clean(input.produk),
    alamat: clean(input.alamat),
    jamOperasional: clean(input.jamOperasional),
    mapsUrl: clean(input.mapsUrl),
    slug: uniqueSlug(input.slug || input.nama, all, excludeId),
  };
}

export function createUmkm(input: UmkmInput): UMKM {
  const session = requireSession();
  requireWilayah(session, input.rtId);
  validate(input);

  const all = umkmStore.getSnapshot();
  const now = new Date().toISOString();
  const umkm: UMKM = {
    ...normalizeInput(input, all),
    id: `umkm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdBy: session.username,
    createdAt: now,
    updatedAt: now,
  };
  umkmStore.write([...all, umkm]);
  return umkm;
}

export function updateUmkm(id: string, input: UmkmInput): UMKM {
  const session = requireSession();
  const all = umkmStore.getSnapshot();
  const existing = findUmkmById(all, id);
  if (!existing) throw new Error("UMKM tidak ditemukan.");
  // Both ends are checked: the account must own the current RT and the RT the
  // business is being moved to.
  if (!canManageUmkm(session, existing)) throw new AccessError();
  requireWilayah(session, input.rtId);
  validate(input);

  const updated: UMKM = {
    ...existing,
    ...normalizeInput(input, all, id),
    updatedAt: new Date().toISOString(),
  };
  umkmStore.write(all.map((u) => (u.id === id ? updated : u)));
  return updated;
}

export function setUmkmActive(id: string, aktif: boolean): UMKM {
  const session = requireSession();
  const all = umkmStore.getSnapshot();
  const existing = findUmkmById(all, id);
  if (!existing) throw new Error("UMKM tidak ditemukan.");
  if (!canManageUmkm(session, existing)) throw new AccessError();

  const updated = { ...existing, aktif, updatedAt: new Date().toISOString() };
  umkmStore.write(all.map((u) => (u.id === id ? updated : u)));
  return updated;
}

export function deleteUmkm(id: string): void {
  const session = requireSession();
  const all = umkmStore.getSnapshot();
  const existing = findUmkmById(all, id);
  if (!existing) return;
  if (!canManageUmkm(session, existing)) throw new AccessError();
  umkmStore.write(all.filter((u) => u.id !== id));
}

export type { UMKM };
