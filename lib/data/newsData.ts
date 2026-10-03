export type NewsStatus = "draft" | "published";

export type NewsCategory = {
  id: string;
  name: string;
};

export const newsCategories: NewsCategory[] = [
  { id: "pemerintahan", name: "Pemerintahan" },
  { id: "pembangunan", name: "Pembangunan" },
  { id: "kegiatan-warga", name: "Kegiatan Warga" },
  { id: "ekonomi", name: "Ekonomi" },
  { id: "pengumuman", name: "Pengumuman" },
];

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  // One string per paragraph.
  content: string[];
  // Data URL for now; becomes a storage URL once there is a real backend.
  coverImage?: string;
  categoryId: string;
  status: NewsStatus;
  // Calendar date (YYYY-MM-DD) shown as the publication date.
  publishedAt: string;
  authorUsername: string;
  authorName: string;
  // Publisher scope: "dusun", an RW id, or an RT id (see wilayahData).
  wilayahId: string;
  createdAt: string;
  updatedAt: string;
};

export function getCategoryName(categoryId: string): string {
  return newsCategories.find((c) => c.id === categoryId)?.name ?? "Lainnya";
}

type SeedInput = Omit<NewsArticle, "createdAt" | "updatedAt" | "coverImage">;

function seed(input: SeedInput): NewsArticle {
  const stamp = `${input.publishedAt}T08:00:00.000Z`;
  return { ...input, createdAt: stamp, updatedAt: stamp };
}

// Sample content so the site is not empty before the first real post. It is
// only used until an account saves something; from then on the stored list
// replaces it.
export const seedNews: NewsArticle[] = [
  seed({
    id: "news-seed-1",
    slug: "musyawarah-dusun-rencana-akhir-tahun",
    title: "Musyawarah Dusun Bahas Rencana Kegiatan Akhir Tahun",
    excerpt:
      "Perangkat dusun, pengurus RW, dan perwakilan RT berkumpul untuk menyusun agenda kegiatan hingga akhir tahun.",
    content: [
      "Perangkat dusun bersama pengurus RW dan perwakilan RT menggelar musyawarah untuk menyusun agenda kegiatan hingga akhir tahun.",
      "Sejumlah usulan dibahas, mulai dari perawatan fasilitas umum, kegiatan kepemudaan, hingga jadwal kerja bakti gabungan antar-RT.",
      "Hasil musyawarah akan dirangkum dan disampaikan kembali kepada warga melalui pengumuman di portal ini.",
    ],
    categoryId: "pemerintahan",
    status: "published",
    publishedAt: "2026-09-15",
    authorUsername: "admin",
    authorName: "Admin Dusun Cilikan",
    wilayahId: "dusun",
  }),
  seed({
    id: "news-seed-2",
    slug: "penyesuaian-jadwal-pelayanan-dusun",
    title: "Pengumuman: Penyesuaian Jadwal Pelayanan Administrasi Dusun",
    excerpt:
      "Jadwal pelayanan administrasi di kantor dusun disesuaikan mulai pekan depan. Warga diminta memperhatikan jam kunjungan.",
    content: [
      "Pemerintah dusun menginformasikan adanya penyesuaian jadwal pelayanan administrasi bagi warga.",
      "Warga yang membutuhkan surat pengantar atau keperluan administrasi lain diharapkan menghubungi ketua RT masing-masing terlebih dahulu agar proses lebih lancar.",
    ],
    categoryId: "pengumuman",
    status: "published",
    publishedAt: "2026-09-08",
    authorUsername: "admin",
    authorName: "Admin Dusun Cilikan",
    wilayahId: "dusun",
  }),
  seed({
    id: "news-seed-3",
    slug: "rapat-koordinasi-rw-10",
    title: "Rapat Koordinasi RW 10 dan Pengurus RT",
    excerpt:
      "Pengurus RW 10 bertemu dengan ketua RT 03 dan RT 04 untuk menyelaraskan program kegiatan warga.",
    content: [
      "RW 10 menggelar rapat koordinasi bersama ketua dan pengurus RT 03 serta RT 04.",
      "Pertemuan membahas pembagian tugas kegiatan bulanan, pendataan kebutuhan warga, dan rencana kegiatan bersama antar-RT.",
      "Rapat serupa direncanakan berlangsung rutin agar informasi dari tingkat RT dapat tersampaikan dengan cepat.",
    ],
    categoryId: "kegiatan-warga",
    status: "published",
    publishedAt: "2026-09-20",
    authorUsername: "rw10",
    authorName: "Ketua RW 10",
    wilayahId: "rw10",
  }),
  seed({
    id: "news-seed-4",
    slug: "perbaikan-saluran-air-rw-09",
    title: "Perbaikan Saluran Air di Lingkungan RW 09",
    excerpt:
      "Warga RW 09 bergotong royong memperbaiki saluran air yang tersumbat agar tidak menggenang saat musim hujan.",
    content: [
      "Menjelang musim hujan, warga RW 09 memperbaiki dan membersihkan saluran air di beberapa titik lingkungan.",
      "Kegiatan dikoordinir pengurus RW bersama RT 01 dan RT 02, dan diikuti warga secara sukarela.",
    ],
    categoryId: "pembangunan",
    status: "published",
    publishedAt: "2026-09-02",
    authorUsername: "rw09",
    authorName: "Ketua RW 09",
    wilayahId: "rw09",
  }),
  seed({
    id: "news-seed-5",
    slug: "enggal-makmur-ajak-warga-rt-03-pilah-sampah",
    title: "Enggal Makmur Ajak Warga RT 03 Memilah Sampah dari Rumah",
    excerpt:
      "Kelompok pengelolaan sampah Enggal Makmur mengajak warga RT 03 memulai pemilahan sampah organik dan anorganik.",
    content: [
      "Enggal Makmur, kelompok pengelolaan sampah dari RT 03, mengajak warga untuk mulai memilah sampah dari rumah masing-masing.",
      "Warga diminta memisahkan sampah organik, anorganik, dan sampah yang dapat dijual kembali sebelum diserahkan pada jadwal pengumpulan.",
      "Kelompok ini juga terbuka bagi warga yang ingin ikut terlibat dalam kegiatan pengelolaan sampah di lingkungan RT 03.",
    ],
    categoryId: "kegiatan-warga",
    status: "published",
    publishedAt: "2026-09-24",
    authorUsername: "rt03",
    authorName: "Ketua RT 03",
    wilayahId: "rt03",
  }),
  seed({
    id: "news-seed-6",
    slug: "kerja-bakti-warga-rt-01",
    title: "Kerja Bakti Bersama Warga RT 01",
    excerpt:
      "Warga RT 01 membersihkan lingkungan dan fasilitas umum dalam kegiatan kerja bakti rutin akhir pekan.",
    content: [
      "Warga RT 01 mengadakan kerja bakti untuk membersihkan jalan lingkungan dan fasilitas umum.",
      "Kegiatan ini rutin diadakan agar lingkungan tetap bersih dan mempererat kebersamaan antarwarga.",
    ],
    categoryId: "kegiatan-warga",
    status: "published",
    publishedAt: "2026-09-12",
    authorUsername: "rt01",
    authorName: "Ketua RT 01",
    wilayahId: "rt01",
  }),
  seed({
    id: "news-seed-7",
    slug: "pelatihan-pemasaran-digital-umkm-rt-02",
    title: "Warga RT 02 Ikuti Pelatihan Pemasaran Digital untuk UMKM",
    excerpt:
      "Pelaku usaha rumahan di RT 02 belajar membuat konten dan memanfaatkan media sosial untuk promosi.",
    content: [
      "Sejumlah pelaku usaha rumahan di RT 02 mengikuti pelatihan pemasaran digital.",
      "Materi meliputi cara memotret produk, menulis deskripsi yang menarik, serta memanfaatkan media sosial untuk promosi.",
    ],
    categoryId: "ekonomi",
    status: "published",
    publishedAt: "2026-08-30",
    authorUsername: "rt02",
    authorName: "Ketua RT 02",
    wilayahId: "rt02",
  }),
  seed({
    id: "news-seed-8",
    slug: "jadwal-ronda-malam-rt-04",
    title: "Jadwal Ronda Malam RT 04",
    excerpt: "Rancangan jadwal ronda malam RT 04 untuk bulan berikutnya.",
    content: [
      "Rancangan jadwal ronda malam RT 04 masih disusun dan akan diumumkan setelah disepakati pengurus.",
    ],
    categoryId: "pengumuman",
    status: "draft",
    publishedAt: "2026-09-27",
    authorUsername: "rt04",
    authorName: "Ketua RT 04",
    wilayahId: "rt04",
  }),
];
