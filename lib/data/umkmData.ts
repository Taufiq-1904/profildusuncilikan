import { slugify } from "../utils";

// One business in the local directory. `jenis` is the business category.
// It is linked to the wilayah tree through `rtId`; the RW is derived from the
// RT (see getRWByRT), never stored twice.
export type UMKM = {
  id: string;
  slug: string;
  nama: string;
  jenis: string;
  pemilik: string;
  // The owner's name is only shown publicly when this is true.
  tampilkanPemilik: boolean;
  // Phone or WhatsApp number.
  kontak?: string;
  deskripsi?: string;
  produk?: string;
  alamat?: string;
  jamOperasional?: string;
  // Google Maps link and/or coordinates. Either is enough for the map button.
  mapsUrl?: string;
  lat?: number;
  lng?: number;
  // Data URLs for now; storage URLs once there is a real backend.
  logo?: string;
  galeri: string[];
  aktif: boolean;
  rtId: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export const umkmSuggestedCategories = [
  "Kuliner",
  "Perdagangan",
  "Pengolahan Pangan",
  "Kerajinan",
  "Otomotif",
  "Peternakan",
  "Pertanian",
  "Jasa",
];

export const MAX_UMKM_GALLERY = 6;

// Shape stored by the previous version of the app. Kept so existing records
// (in the seed and in browsers that already saved some) keep working.
type LegacyUMKM = {
  id: string;
  nama: string;
  jenis: string;
  pemilik: string;
  kontak?: string;
  deskripsi?: string;
  produk?: string;
  rtId: string;
  lat?: number;
  lng?: number;
};

const LEGACY_STAMP = "2026-09-01T00:00:00.000Z";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function optionalString(value: unknown): string | undefined {
  const v = asString(value).trim();
  return v || undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

// Upgrades whatever was stored (old or new shape) to the current UMKM type,
// filling defaults and making slugs unique. Runs on every read.
export function normalizeUmkm(items: unknown[]): UMKM[] {
  const usedSlugs = new Set<string>();
  const result: UMKM[] = [];

  items.forEach((item, index) => {
    if (!item || typeof item !== "object") return;
    const r = item as Partial<UMKM> & Record<string, unknown>;
    const nama = asString(r.nama).trim();
    if (!nama) return;

    const base = slugify(asString(r.slug) || nama) || "umkm";
    let slug = base;
    for (let n = 2; usedSlugs.has(slug); n += 1) slug = `${base}-${n}`;
    usedSlugs.add(slug);

    result.push({
      id: asString(r.id) || `umkm-legacy-${index}`,
      slug,
      nama,
      jenis: asString(r.jenis).trim() || "Lainnya",
      pemilik: asString(r.pemilik).trim(),
      // Old records never asked for consent to show the owner publicly.
      tampilkanPemilik: typeof r.tampilkanPemilik === "boolean" ? r.tampilkanPemilik : false,
      kontak: optionalString(r.kontak),
      deskripsi: optionalString(r.deskripsi),
      produk: optionalString(r.produk),
      alamat: optionalString(r.alamat),
      jamOperasional: optionalString(r.jamOperasional),
      mapsUrl: optionalString(r.mapsUrl),
      lat: optionalNumber(r.lat),
      lng: optionalNumber(r.lng),
      logo: optionalString(r.logo),
      galeri: Array.isArray(r.galeri) ? r.galeri.filter((g): g is string => typeof g === "string") : [],
      aktif: typeof r.aktif === "boolean" ? r.aktif : true,
      rtId: asString(r.rtId),
      createdBy: optionalString(r.createdBy),
      createdAt: asString(r.createdAt) || LEGACY_STAMP,
      updatedAt: asString(r.updatedAt) || LEGACY_STAMP,
    });
  });

  return result;
}

// Seed data migrated from the old rtData.ts per-RT `umkm` arrays. Two of them
// carry the coordinates of the map pins that used to duplicate them.
const legacySeed: LegacyUMKM[] = [
];

export const umkmSeed: UMKM[] = normalizeUmkm(legacySeed);
