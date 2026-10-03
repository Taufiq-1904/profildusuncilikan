export type Potential = {
  slug: string;
  title: string;
  category: "Pertanian" | "Perkebunan" | "Peternakan" | "UMKM" | "Wisata" | "Kerajinan" | "Produk Unggulan";
  summary: string;
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
    summary: "Warga Dusun Cilikan bertani dan berkegiatan bersama melalui Kelompok Tani yang diketuai Bapak Suharyanta.",
    description: [
      "Sebagian warga Dusun Cilikan menggarap lahan pertanian dan tergabung dalam Kelompok Tani Cilikan.",
      "Kelompok Tani menjadi wadah koordinasi dan berbagi pengalaman antarpetani, diketuai oleh Bapak Suharyanta.",
    ],
    icon: "wheat",
    imageTone: "green",
  },
  {
    slug: "peternakan-cilikan",
    title: "Peternakan Kelompok Kandang",
    category: "Peternakan",
    summary: "Kelompok Kandang Cilikan yang diketuai Bapak Puji Wahono mengelola kegiatan peternakan warga.",
    description: [
      "Warga Dusun Cilikan yang beternak tergabung dalam Kelompok Kandang, sebagai wadah berbagi ilmu dan pengelolaan kandang.",
      "Kelompok ini diketuai oleh Bapak Puji Wahono.",
    ],
    icon: "beef",
    imageTone: "gold",
  },
];
