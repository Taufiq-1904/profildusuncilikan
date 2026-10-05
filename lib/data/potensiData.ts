export const POTENSI_KATEGORI = [
  "Pertanian",
  "Peternakan",
  "Kerajinan",
  "Pariwisata",
  "Perdagangan",
  "Lainnya",
] as const;

export type RTPotensiKategori = (typeof POTENSI_KATEGORI)[number];

export type RTPotensi = {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: RTPotensiKategori;
  rtId: string;
  // URL publik di Supabase Storage (bucket media). Kosong = tampil placeholder.
  foto?: string;
};

type Tone = "green" | "gold" | "sky" | "clay";

// Tampilan kartu per kategori. Ini hanya gaya visual, bukan isi potensi:
// judul dan deskripsi tetap berasal dari data yang diinput pengelola.
export const POTENSI_VISUAL: Record<RTPotensiKategori, { icon: string; tone: Tone }> = {
  Pertanian: { icon: "wheat", tone: "green" },
  Peternakan: { icon: "beef", tone: "gold" },
  Kerajinan: { icon: "shapes", tone: "clay" },
  Pariwisata: { icon: "mountain-snow", tone: "sky" },
  Perdagangan: { icon: "package", tone: "gold" },
  Lainnya: { icon: "trees", tone: "green" },
};

export function getPotensiVisual(kategori: string) {
  return POTENSI_VISUAL[kategori as RTPotensiKategori] ?? POTENSI_VISUAL.Lainnya;
}
