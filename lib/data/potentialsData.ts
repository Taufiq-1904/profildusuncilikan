export type Potential = {
  slug: string;
  title: string;
  category: "Pertanian" | "Perkebunan" | "Peternakan" | "UMKM" | "Wisata" | "Kerajinan" | "Produk Unggulan";
  summary: string;
  // Slug organisasi yang mengelola potensi ini. Nama ketuanya dibaca dari data
  // organisasi (Dashboard > Organisasi), bukan ditulis di teks.
  organizationSlug?: string;
  description: string[];
  stats?: { label: string; value: string }[];
  icon: string;
  imageTone: "green" | "gold" | "sky" | "clay";
};

export const potentials: Potential[] = [
  {
    slug: "pertanian-cilikan",
    title: "Pertanian Warga Cilikan",
    category: "Pertanian",
    summary: "Warga Dusun Cilikan bertani dan berkegiatan bersama melalui Kelompok Tani Cilikan.",
    organizationSlug: "kelompok-tani",
    description: [
      "Sebagian warga Dusun Cilikan menggarap lahan pertanian dan tergabung dalam Kelompok Tani Cilikan.",
      "Kelompok Tani menjadi wadah koordinasi dan berbagi pengalaman antarpetani.",
    ],
    icon: "wheat",
    imageTone: "green",
  },
  {
    slug: "peternakan-cilikan",
    title: "Peternakan Kelompok Kandang",
    category: "Peternakan",
    summary: "Kelompok Kandang Cilikan mengelola kegiatan peternakan warga.",
    organizationSlug: "kelompok-kandang",
    description: [
      "Warga Dusun Cilikan yang beternak tergabung dalam Kelompok Kandang, sebagai wadah berbagi ilmu dan pengelolaan kandang.",
    ],
    icon: "beef",
    imageTone: "gold",
  },
];
