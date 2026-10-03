export type GalleryItem = {
  id: string;
  title: string;
  category: "Kegiatan Dusun" | "Pemerintahan" | "Masyarakat" | "Infrastruktur" | "Potensi Dusun";
  imageTone: "green" | "gold" | "sky" | "clay";
  span?: "tall" | "wide" | "normal";
};

export const galleryItems: GalleryItem[] = [
  { id: "g1", title: "Kerja Bakti Warga Cilikan", category: "Kegiatan Dusun", imageTone: "green", span: "wide" },
  { id: "g2", title: "Rapat Dukuh dan Pengurus RT", category: "Pemerintahan", imageTone: "clay" },
  { id: "g3", title: "Kegiatan Kelompok Tani", category: "Potensi Dusun", imageTone: "gold", span: "tall" },
  { id: "g4", title: "Kegiatan Kader Dusun", category: "Masyarakat", imageTone: "sky" },
  { id: "g5", title: "Rapat Pengurus RW 09", category: "Pemerintahan", imageTone: "green" },
  { id: "g6", title: "Rapat Pengurus RW 10", category: "Pemerintahan", imageTone: "clay" },
  { id: "g7", title: "Kegiatan Kelompok Kandang", category: "Potensi Dusun", imageTone: "gold", span: "wide" },
  { id: "g8", title: "Kegiatan Pemuda Cilikan", category: "Kegiatan Dusun", imageTone: "sky" },
  { id: "g9", title: "Gotong Royong Lingkungan", category: "Infrastruktur", imageTone: "green" },
  { id: "g10", title: "Kegiatan Ibu-Ibu Dusun", category: "Masyarakat", imageTone: "gold", span: "tall" },
];
