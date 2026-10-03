export type RTPotensiKategori =
  | "Pertanian"
  | "Peternakan"
  | "Kerajinan"
  | "Pariwisata"
  | "Perdagangan"
  | "Lainnya";

export type RTPotensi = {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: RTPotensiKategori;
  rtId: string;
};

// Seed data migrated from the old rtData.ts per-RT `potensi` arrays.
export const potensiSeed: RTPotensi[] = [];

export function getPotensiByRT(rtId: string): RTPotensi[] {
  return potensiSeed.filter((p) => p.rtId === rtId);
}
