export type PinCategory =
  | "Fasilitas Umum"
  | "Ibadah"
  | "UMKM"
  | "Kesehatan"
  | "Pendidikan"
  | "Keamanan"
  | "Lainnya";

export type MapPin = {
  id: string;
  nama: string;
  deskripsi: string;
  kategori: PinCategory;
  lat: number;
  lng: number;
  kontak?: string;
  alamat?: string;
  // Public URL in Supabase Storage (bucket "media").
  foto?: string;
  mapsUrl?: string;
  // Generic wilayahId: "dusun", an RW id ("rw09"), or an RT id ("rt01").
  createdBy: string;
  createdAt: string;
};

export const PIN_CATEGORIES: PinCategory[] = [
  "Fasilitas Umum",
  "Ibadah",
  "UMKM",
  "Kesehatan",
  "Pendidikan",
  "Keamanan",
  "Lainnya",
];

export const CATEGORY_COLORS: Record<PinCategory, string> = {
  "Fasilitas Umum": "#16a34a",
  "Ibadah":         "#0891b2",
  "UMKM":           "#d97706",
  "Kesehatan":      "#dc2626",
  "Pendidikan":     "#7c3aed",
  "Keamanan":       "#1d4ed8",
  "Lainnya":        "#64748b",
};

// Center of Dusun Cilikan, Umbulmartani
export const DUSUN_CENTER: [number, number] = [-7.7028, 110.4219];
