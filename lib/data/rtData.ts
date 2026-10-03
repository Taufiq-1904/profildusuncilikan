export type Warga = {
  id: string;
  nama: string;
  jenisKelamin: "L" | "P";
  nik?: string;
  tempatLahir?: string;
  tanggalLahir?: string; // "YYYY-MM-DD"
  statusKawin: "Belum Kawin" | "Kawin" | "Cerai Hidup" | "Cerai Mati";
  pekerjaan: string;
  pendidikan?: "SD" | "SMP" | "SMA" | "D3" | "S1" | "S2" | "Tidak Sekolah" | "Lainnya";
  alamat?: string;
};

export type UMKM = {
  id: string;
  nama: string;
  jenis: string;
  pemilik: string;
  kontak?: string;
  deskripsi?: string;
  produk?: string;
};

export type Potensi = {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: "Pertanian" | "Peternakan" | "Kerajinan" | "Pariwisata" | "Perdagangan" | "Lainnya";
};

export type KelompokUmur = {
  label: string;    // "0-4", "5-14", "15-24", "25-44", "45-59", "60+"
  jumlah: number;
};

export type RTData = {
  id: string;        // "rt01" | "rt02" | "rt03" | "rt04"
  label: string;     // "RT 01"
  ketua: string;
  sekretaris?: string;
  bendahara?: string;
  jumlahWarga: number;
  jumlahKK: number;
  jumlahLaki: number;
  jumlahPerempuan: number;
  kelompokUmur: KelompokUmur[];
  warga: Warga[];
  umkm: UMKM[];
  potensi: Potensi[];
};

export const rtList: RTData[] = [
  {
    id: "rt01",
    label: "RT 01",
    ketua: "Agus Widodo",
    sekretaris: "Tri Handoyo",
    bendahara: "Siti Rahayu",
    jumlahWarga: 124,
    jumlahKK: 36,
    jumlahLaki: 63,
    jumlahPerempuan: 61,
    kelompokUmur: [
      { label: "0–4", jumlah: 8 },
      { label: "5–14", jumlah: 18 },
      { label: "15–24", jumlah: 22 },
      { label: "25–44", jumlah: 42 },
      { label: "45–59", jumlah: 24 },
      { label: "60+", jumlah: 10 },
    ],
    warga: [
      { id: "w01-001", nama: "Agus Widodo", jenisKelamin: "L", tanggalLahir: "1978-03-12", statusKawin: "Kawin", pekerjaan: "Wiraswasta", pendidikan: "S1" },
      { id: "w01-002", nama: "Siti Rahayu", jenisKelamin: "P", tanggalLahir: "1980-07-24", statusKawin: "Kawin", pekerjaan: "Ibu Rumah Tangga", pendidikan: "SMA" },
      { id: "w01-003", nama: "Tri Handoyo", jenisKelamin: "L", tanggalLahir: "1975-11-05", statusKawin: "Kawin", pekerjaan: "Petani", pendidikan: "SMP" },
      { id: "w01-004", nama: "Rina Setyowati", jenisKelamin: "P", tanggalLahir: "1985-02-17", statusKawin: "Kawin", pekerjaan: "Pedagang", pendidikan: "SMA" },
      { id: "w01-005", nama: "Hendra Kusuma", jenisKelamin: "L", tanggalLahir: "2005-09-30", statusKawin: "Belum Kawin", pekerjaan: "Pelajar", pendidikan: "SMA" },
      { id: "w01-006", nama: "Wahyu Purnomo", jenisKelamin: "L", tanggalLahir: "1982-04-15", statusKawin: "Kawin", pekerjaan: "Karyawan Swasta", pendidikan: "S1" },
      { id: "w01-007", nama: "Ani Sulistyowati", jenisKelamin: "P", tanggalLahir: "1979-08-22", statusKawin: "Kawin", pekerjaan: "Pegawai Negeri", pendidikan: "S1" },
      { id: "w01-008", nama: "Budi Santoso", jenisKelamin: "L", tanggalLahir: "1970-01-10", statusKawin: "Kawin", pekerjaan: "Petani", pendidikan: "SD" },
      { id: "w01-009", nama: "Dewi Ratnasari", jenisKelamin: "P", tanggalLahir: "2003-12-08", statusKawin: "Belum Kawin", pekerjaan: "Mahasiswa", pendidikan: "S1" },
      { id: "w01-010", nama: "Joko Widarto", jenisKelamin: "L", tanggalLahir: "1983-06-19", statusKawin: "Kawin", pekerjaan: "Wiraswasta", pendidikan: "SMA" },
    ],
    umkm: [
      { id: "umkm-01-001", nama: "Warung Bu Siti", jenis: "Perdagangan", pemilik: "Siti Rahayu", kontak: "0812-3456-7890", deskripsi: "Warung sembako dan kebutuhan harian", produk: "Sembako, Jajanan" },
      { id: "umkm-01-002", nama: "Keripik Singkong Agus", jenis: "Pengolahan Pangan", pemilik: "Agus Widodo", kontak: "0813-1234-5678", deskripsi: "Produksi keripik singkong aneka rasa", produk: "Keripik Singkong" },
    ],
    potensi: [
      { id: "pot-01-001", judul: "Lahan Pertanian Padi Organik", deskripsi: "Area persawahan RT 01 cocok untuk budidaya padi organik dengan sistem irigasi yang baik.", kategori: "Pertanian" },
      { id: "pot-01-002", judul: "Kerajinan Anyaman Bambu", deskripsi: "Beberapa warga memiliki keahlian menganyam bambu menjadi produk rumah tangga dan hiasan.", kategori: "Kerajinan" },
    ],
  },
  {
    id: "rt02",
    label: "RT 02",
    ketua: "Bambang Susilo",
    sekretaris: "Yanto Purwanto",
    bendahara: "Endang Lestari",
    jumlahWarga: 131,
    jumlahKK: 38,
    jumlahLaki: 67,
    jumlahPerempuan: 64,
    kelompokUmur: [
      { label: "0–4", jumlah: 10 },
      { label: "5–14", jumlah: 20 },
      { label: "15–24", jumlah: 25 },
      { label: "25–44", jumlah: 45 },
      { label: "45–59", jumlah: 21 },
      { label: "60+", jumlah: 10 },
    ],
    warga: [
      { id: "w02-001", nama: "Bambang Susilo", jenisKelamin: "L", tanggalLahir: "1972-05-20", statusKawin: "Kawin", pekerjaan: "Pedagang", pendidikan: "SMA" },
      { id: "w02-002", nama: "Endang Lestari", jenisKelamin: "P", tanggalLahir: "1976-09-14", statusKawin: "Kawin", pekerjaan: "Ibu Rumah Tangga", pendidikan: "SMP" },
      { id: "w02-003", nama: "Yanto Purwanto", jenisKelamin: "L", tanggalLahir: "1980-12-03", statusKawin: "Kawin", pekerjaan: "Petani", pendidikan: "SD" },
      { id: "w02-004", nama: "Supriyati", jenisKelamin: "P", tanggalLahir: "1965-04-28", statusKawin: "Cerai Mati", pekerjaan: "Pedagang", pendidikan: "SD" },
      { id: "w02-005", nama: "Rizal Maulana", jenisKelamin: "L", tanggalLahir: "2007-01-15", statusKawin: "Belum Kawin", pekerjaan: "Pelajar", pendidikan: "SMP" },
      { id: "w02-006", nama: "Eko Prasetyo", jenisKelamin: "L", tanggalLahir: "1988-07-09", statusKawin: "Kawin", pekerjaan: "Karyawan Swasta", pendidikan: "D3" },
      { id: "w02-007", nama: "Wulandari", jenisKelamin: "P", tanggalLahir: "1990-03-25", statusKawin: "Kawin", pekerjaan: "Wiraswasta", pendidikan: "S1" },
      { id: "w02-008", nama: "Tugiyono", jenisKelamin: "L", tanggalLahir: "1967-10-11", statusKawin: "Kawin", pekerjaan: "Petani", pendidikan: "SD" },
      { id: "w02-009", nama: "Nurul Hidayah", jenisKelamin: "P", tanggalLahir: "2001-06-20", statusKawin: "Belum Kawin", pekerjaan: "Mahasiswa", pendidikan: "S1" },
      { id: "w02-010", nama: "Sumarno", jenisKelamin: "L", tanggalLahir: "1984-08-30", statusKawin: "Kawin", pekerjaan: "Wiraswasta", pendidikan: "SMA" },
    ],
    umkm: [
      { id: "umkm-02-001", nama: "Bengkel Pak Budi", jenis: "Otomotif", pemilik: "Bambang Susilo", kontak: "0815-6789-0123", deskripsi: "Servis motor dan ganti oli", produk: "Servis Motor, Oli" },
      { id: "umkm-02-002", nama: "Tempe & Tahu Bu Endang", jenis: "Pengolahan Pangan", pemilik: "Endang Lestari", kontak: "0816-2345-6789", deskripsi: "Produksi tempe dan tahu setiap hari", produk: "Tempe, Tahu" },
    ],
    potensi: [
      { id: "pot-02-001", judul: "Budidaya Lele & Nila", deskripsi: "Kolam ikan milik warga RT 02 berpotensi dikembangkan sebagai kampung ikan.", kategori: "Peternakan" },
    ],
  },
  {
    id: "rt03",
    label: "RT 03",
    ketua: "Dwi Santoso",
    sekretaris: "Heru Susanto",
    bendahara: "Puji Lestari",
    jumlahWarga: 118,
    jumlahKK: 34,
    jumlahLaki: 60,
    jumlahPerempuan: 58,
    kelompokUmur: [
      { label: "0–4", jumlah: 7 },
      { label: "5–14", jumlah: 16 },
      { label: "15–24", jumlah: 19 },
      { label: "25–44", jumlah: 38 },
      { label: "45–59", jumlah: 25 },
      { label: "60+", jumlah: 13 },
    ],
    warga: [
      { id: "w03-001", nama: "Dwi Santoso", jenisKelamin: "L", tanggalLahir: "1974-02-14", statusKawin: "Kawin", pekerjaan: "Petani", pendidikan: "SMA" },
      { id: "w03-002", nama: "Puji Lestari", jenisKelamin: "P", tanggalLahir: "1977-08-28", statusKawin: "Kawin", pekerjaan: "Ibu Rumah Tangga", pendidikan: "SMP" },
      { id: "w03-003", nama: "Heru Susanto", jenisKelamin: "L", tanggalLahir: "1981-11-17", statusKawin: "Kawin", pekerjaan: "Karyawan Swasta", pendidikan: "D3" },
      { id: "w03-004", nama: "Marsih", jenisKelamin: "P", tanggalLahir: "1960-06-05", statusKawin: "Cerai Mati", pekerjaan: "Buruh Tani", pendidikan: "SD" },
      { id: "w03-005", nama: "Fajar Nugroho", jenisKelamin: "L", tanggalLahir: "2008-03-22", statusKawin: "Belum Kawin", pekerjaan: "Pelajar", pendidikan: "SMP" },
      { id: "w03-006", nama: "Andika Pratama", jenisKelamin: "L", tanggalLahir: "1987-09-10", statusKawin: "Kawin", pekerjaan: "Wiraswasta", pendidikan: "S1" },
      { id: "w03-007", nama: "Lina Wahyuni", jenisKelamin: "P", tanggalLahir: "1982-04-16", statusKawin: "Kawin", pekerjaan: "Pegawai Negeri", pendidikan: "S1" },
      { id: "w03-008", nama: "Supandi", jenisKelamin: "L", tanggalLahir: "1969-01-30", statusKawin: "Kawin", pekerjaan: "Petani", pendidikan: "SD" },
      { id: "w03-009", nama: "Ririn Astuti", jenisKelamin: "P", tanggalLahir: "2002-07-18", statusKawin: "Belum Kawin", pekerjaan: "Mahasiswa", pendidikan: "S1" },
      { id: "w03-010", nama: "Suroto", jenisKelamin: "L", tanggalLahir: "1985-12-25", statusKawin: "Kawin", pekerjaan: "Pedagang", pendidikan: "SMA" },
    ],
    umkm: [
      { id: "umkm-03-001", nama: "Jajanan Pasar Bu Puji", jenis: "Kuliner", pemilik: "Puji Lestari", kontak: "0817-3456-7890", deskripsi: "Jajanan pasar tradisional Jawa", produk: "Klepon, Onde-onde, Lemper" },
      { id: "umkm-03-002", nama: "Toko Bangunan Dwi", jenis: "Perdagangan", pemilik: "Dwi Santoso", kontak: "0818-4567-8901", deskripsi: "Penjualan material bangunan", produk: "Semen, Pasir, Bata" },
    ],
    potensi: [
      { id: "pot-03-001", judul: "Wisata Sawah Cilikan", deskripsi: "Hamparan sawah RT 03 berpotensi menjadi destinasi wisata agro dengan pemandangan indah.", kategori: "Pariwisata" },
      { id: "pot-03-002", judul: "Budidaya Durian Lokal", deskripsi: "Beberapa kebun durian lokal berpotensi dikembangkan menjadi kebun buah unggulan.", kategori: "Pertanian" },
    ],
  },
  {
    id: "rt04",
    label: "RT 04",
    ketua: "Sri Lestari",
    sekretaris: "Gunawan",
    bendahara: "Yuli Astuti",
    jumlahWarga: 114,
    jumlahKK: 34,
    jumlahLaki: 58,
    jumlahPerempuan: 56,
    kelompokUmur: [
      { label: "0–4", jumlah: 6 },
      { label: "5–14", jumlah: 15 },
      { label: "15–24", jumlah: 20 },
      { label: "25–44", jumlah: 36 },
      { label: "45–59", jumlah: 24 },
      { label: "60+", jumlah: 13 },
    ],
    warga: [
      { id: "w04-001", nama: "Sri Lestari", jenisKelamin: "P", tanggalLahir: "1969-05-08", statusKawin: "Cerai Mati", pekerjaan: "Pedagang", pendidikan: "SMA" },
      { id: "w04-002", nama: "Yuli Astuti", jenisKelamin: "P", tanggalLahir: "1980-11-22", statusKawin: "Kawin", pekerjaan: "Ibu Rumah Tangga", pendidikan: "SMP" },
      { id: "w04-003", nama: "Gunawan", jenisKelamin: "L", tanggalLahir: "1976-03-15", statusKawin: "Kawin", pekerjaan: "Wiraswasta", pendidikan: "SMA" },
      { id: "w04-004", nama: "Slamet Riyadi", jenisKelamin: "L", tanggalLahir: "1973-07-29", statusKawin: "Kawin", pekerjaan: "Petani", pendidikan: "SD" },
      { id: "w04-005", nama: "Novi Susilowati", jenisKelamin: "P", tanggalLahir: "1992-01-14", statusKawin: "Kawin", pekerjaan: "Karyawan Swasta", pendidikan: "D3" },
      { id: "w04-006", nama: "Agung Setiawan", jenisKelamin: "L", tanggalLahir: "2006-10-03", statusKawin: "Belum Kawin", pekerjaan: "Pelajar", pendidikan: "SMA" },
      { id: "w04-007", nama: "Wahyuni", jenisKelamin: "P", tanggalLahir: "1983-04-27", statusKawin: "Kawin", pekerjaan: "Pegawai Negeri", pendidikan: "S1" },
      { id: "w04-008", nama: "Mulyono", jenisKelamin: "L", tanggalLahir: "1968-08-16", statusKawin: "Kawin", pekerjaan: "Petani", pendidikan: "SD" },
      { id: "w04-009", nama: "Fitri Rahayu", jenisKelamin: "P", tanggalLahir: "2000-02-09", statusKawin: "Belum Kawin", pekerjaan: "Mahasiswa", pendidikan: "S1" },
      { id: "w04-010", nama: "Teguh Santoso", jenisKelamin: "L", tanggalLahir: "1986-12-12", statusKawin: "Kawin", pekerjaan: "Wiraswasta", pendidikan: "SMA" },
    ],
    umkm: [
      { id: "umkm-04-001", nama: "Peternakan Kambing Pak Slamet", jenis: "Peternakan", pemilik: "Slamet Riyadi", kontak: "0819-5678-9012", deskripsi: "Peternakan kambing etawa penghasil susu", produk: "Susu Kambing, Kambing Siap Potong" },
      { id: "umkm-04-002", nama: "Batik Tulis Sri", jenis: "Kerajinan", pemilik: "Sri Lestari", kontak: "0811-6789-0123", deskripsi: "Produksi batik tulis motif lokal Cilikan", produk: "Kain Batik, Baju Batik" },
    ],
    potensi: [
      { id: "pot-04-001", judul: "Peternakan Kambing Etawa", deskripsi: "Potensi peternakan kambing etawa penghasil susu yang dapat dikembangkan sebagai produk unggulan.", kategori: "Peternakan" },
      { id: "pot-04-002", judul: "Batik Tulis Motif Cilikan", deskripsi: "Motif batik khas Cilikan belum terdokumentasi secara formal, berpotensi dipatenkan sebagai warisan budaya.", kategori: "Kerajinan" },
    ],
  },
];

export function getRTById(id: string): RTData | undefined {
  return rtList.find((rt) => rt.id === id);
}
