export type TransactionType = "pemasukan" | "pengeluaran";

export type TransactionCategory =
  | "Iuran Warga"
  | "Kas RT/Dusun"
  | "Pembangunan"
  | "Sosial"
  | "Kegiatan"
  | "Operasional"
  | "Lain-lain";

export type Transaction = {
  id: string;
  tanggal: string;   // ISO date string, e.g. "2024-07-10"
  keterangan: string;
  jenis: TransactionType;
  kategori: TransactionCategory;
  jumlah: number;    // in IDR
  scope: "dusun" | "rt01" | "rt02" | "rt03" | "rt04";
};

export const KATEGORI_OPTIONS: TransactionCategory[] = [
  "Iuran Warga",
  "Kas RT/Dusun",
  "Pembangunan",
  "Sosial",
  "Kegiatan",
  "Operasional",
  "Lain-lain",
];

// Seed data — can be replaced with localStorage persistence
export const initialTransactions: Transaction[] = [
  // === DUSUN ===
  {
    id: "d-001",
    tanggal: "2024-01-05",
    keterangan: "Iuran warga Januari dari seluruh RT",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 1420000,
    scope: "dusun",
  },
  {
    id: "d-002",
    tanggal: "2024-01-20",
    keterangan: "Perbaikan jalan lingkungan Dusun Cilikan",
    jenis: "pengeluaran",
    kategori: "Pembangunan",
    jumlah: 850000,
    scope: "dusun",
  },
  {
    id: "d-003",
    tanggal: "2024-02-10",
    keterangan: "Bantuan sosial warga kurang mampu",
    jenis: "pengeluaran",
    kategori: "Sosial",
    jumlah: 300000,
    scope: "dusun",
  },
  {
    id: "d-004",
    tanggal: "2024-02-15",
    keterangan: "Iuran warga Februari",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 1420000,
    scope: "dusun",
  },
  {
    id: "d-005",
    tanggal: "2024-03-17",
    keterangan: "Kegiatan 17 Agustus Dusun",
    jenis: "pengeluaran",
    kategori: "Kegiatan",
    jumlah: 1200000,
    scope: "dusun",
  },
  {
    id: "d-006",
    tanggal: "2024-03-05",
    keterangan: "Iuran warga Maret",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 1420000,
    scope: "dusun",
  },

  // === RT 01 ===
  {
    id: "rt01-001",
    tanggal: "2024-01-07",
    keterangan: "Iuran bulanan RT 01 Januari",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 360000,
    scope: "rt01",
  },
  {
    id: "rt01-002",
    tanggal: "2024-01-15",
    keterangan: "Pembelian ATK rapat RT",
    jenis: "pengeluaran",
    kategori: "Operasional",
    jumlah: 85000,
    scope: "rt01",
  },
  {
    id: "rt01-003",
    tanggal: "2024-02-07",
    keterangan: "Iuran bulanan RT 01 Februari",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 360000,
    scope: "rt01",
  },
  {
    id: "rt01-004",
    tanggal: "2024-02-20",
    keterangan: "Sumbangan warga sakit",
    jenis: "pengeluaran",
    kategori: "Sosial",
    jumlah: 150000,
    scope: "rt01",
  },
  {
    id: "rt01-005",
    tanggal: "2024-03-07",
    keterangan: "Iuran bulanan RT 01 Maret",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 360000,
    scope: "rt01",
  },

  // === RT 02 ===
  {
    id: "rt02-001",
    tanggal: "2024-01-08",
    keterangan: "Iuran bulanan RT 02 Januari",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 380000,
    scope: "rt02",
  },
  {
    id: "rt02-002",
    tanggal: "2024-01-22",
    keterangan: "Pengecatan pos ronda",
    jenis: "pengeluaran",
    kategori: "Pembangunan",
    jumlah: 220000,
    scope: "rt02",
  },
  {
    id: "rt02-003",
    tanggal: "2024-02-08",
    keterangan: "Iuran bulanan RT 02 Februari",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 380000,
    scope: "rt02",
  },
  {
    id: "rt02-004",
    tanggal: "2024-02-25",
    keterangan: "Kegiatan pengajian RT",
    jenis: "pengeluaran",
    kategori: "Kegiatan",
    jumlah: 175000,
    scope: "rt02",
  },
  {
    id: "rt02-005",
    tanggal: "2024-03-08",
    keterangan: "Iuran bulanan RT 02 Maret",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 380000,
    scope: "rt02",
  },

  // === RT 03 ===
  {
    id: "rt03-001",
    tanggal: "2024-01-09",
    keterangan: "Iuran bulanan RT 03 Januari",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 340000,
    scope: "rt03",
  },
  {
    id: "rt03-002",
    tanggal: "2024-01-18",
    keterangan: "Pembelian bak sampah",
    jenis: "pengeluaran",
    kategori: "Operasional",
    jumlah: 180000,
    scope: "rt03",
  },
  {
    id: "rt03-003",
    tanggal: "2024-02-09",
    keterangan: "Iuran bulanan RT 03 Februari",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 340000,
    scope: "rt03",
  },
  {
    id: "rt03-004",
    tanggal: "2024-02-28",
    keterangan: "Donasi kepada warga duka cita",
    jenis: "pengeluaran",
    kategori: "Sosial",
    jumlah: 200000,
    scope: "rt03",
  },
  {
    id: "rt03-005",
    tanggal: "2024-03-09",
    keterangan: "Iuran bulanan RT 03 Maret",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 340000,
    scope: "rt03",
  },

  // === RT 04 ===
  {
    id: "rt04-001",
    tanggal: "2024-01-10",
    keterangan: "Iuran bulanan RT 04 Januari",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 340000,
    scope: "rt04",
  },
  {
    id: "rt04-002",
    tanggal: "2024-01-25",
    keterangan: "Perbaikan saluran air",
    jenis: "pengeluaran",
    kategori: "Pembangunan",
    jumlah: 260000,
    scope: "rt04",
  },
  {
    id: "rt04-003",
    tanggal: "2024-02-10",
    keterangan: "Iuran bulanan RT 04 Februari",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 340000,
    scope: "rt04",
  },
  {
    id: "rt04-004",
    tanggal: "2024-02-22",
    keterangan: "Pembelian perlengkapan posyandu",
    jenis: "pengeluaran",
    kategori: "Kegiatan",
    jumlah: 195000,
    scope: "rt04",
  },
  {
    id: "rt04-005",
    tanggal: "2024-03-10",
    keterangan: "Iuran bulanan RT 04 Maret",
    jenis: "pemasukan",
    kategori: "Iuran Warga",
    jumlah: 340000,
    scope: "rt04",
  },
];
