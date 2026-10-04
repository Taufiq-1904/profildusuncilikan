// Foto galeri dusun. Datanya ada di tabel `gallery_photos` dan hanya bisa
// diubah akun Dusun (Dashboard > Galeri). Tidak ada foto contoh di kode.

export const GALLERY_CATEGORIES = [
  "Kegiatan Dusun",
  "Pemerintahan",
  "Masyarakat",
  "Infrastruktur",
  "Potensi Dusun",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type GallerySpan = "normal" | "tall" | "wide";

export const GALLERY_SPANS: { value: GallerySpan; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "tall", label: "Tinggi (2 baris)" },
  { value: "wide", label: "Lebar (2 kolom)" },
];

export type GalleryItem = {
  id: string;
  title: string;
  // Teks bebas di database; kategori baru muncul otomatis sebagai filter.
  category: string;
  // URL publik di Supabase Storage (bucket "media", folder "situs").
  image: string;
  span: GallerySpan;
  // Makin kecil makin awal; yang sama diurutkan dari yang terbaru.
  order: number;
  createdAt: string;
  updatedAt: string;
};

export function sortGallery(list: GalleryItem[]): GalleryItem[] {
  return [...list].sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));
}
