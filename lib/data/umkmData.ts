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
  // Public URLs in Supabase Storage (bucket "media").
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
