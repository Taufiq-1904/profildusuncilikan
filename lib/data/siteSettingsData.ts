// Konten situs yang dikelola Dukuh lewat Dashboard > Beranda & Profil:
// beranda, profil (sejarah, visi-misi, geografis), dan kontak.
//
// Tersimpan di tabel `site_settings` (satu baris, id "main"). Nilai di bawah ini
// adalah ISI BAWAAN: dipakai selama sebuah kolom belum pernah disimpan, atau bila
// database belum bisa dibaca. Jadi situs tidak pernah menampilkan kolom kosong.
//
// Sumber isi bawaan yang berasal dari penelusuran internet (angka tingkat
// Kalurahan Umbulmartani, bukan khusus Dusun Cilikan):
//  - Peraturan Bupati Sleman No. 86 Tahun 2025 (batas & luas Kalurahan Umbulmartani)
//  - Website Kalurahan Umbulmartani: "Kondisi Umum Kalurahan", kanal budaya
//    "Padukuhan Cilikan", dan data kontak kantor kalurahan
//  Semuanya bisa dan sebaiknya dikoreksi Dukuh sesuai kenyataan di lapangan.

export type TimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export type SiteSettings = {
  // --- Beranda
  tagline: string;
  shortDescription: string;
  // URL gambar latar hero. Kosong = pakai gambar bawaan situs.
  heroImage: string;
  welcomeMessage: string;
  // Teks singkat "Lokasi" pada bagian Tentang Dusun di beranda.
  locationNote: string;
  aboutPhotos: string[];
  excellence: string[];

  // --- Profil
  historySummary: string;
  timeline: TimelineEntry[];
  vision: string;
  missions: string[];

  // --- Geografis
  geoArea: string;
  geoAltitude: string;
  geoClimate: string;
  geoNorth: string;
  geoSouth: string;
  geoEast: string;
  geoWest: string;
  geoTopography: string;

  // --- Kontak
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  serviceHours: string;
  mapsUrl: string;
  lat?: number;
  lng?: number;
  instagram: string;
  facebook: string;
  youtube: string;
  kalurahanAddress: string;
  kalurahanPhone: string;
};

export const MAX_ABOUT_PHOTOS = 3;
export const MAX_TIMELINE_ENTRIES = 12;
export const MAX_LIST_ITEMS = 12;

// Gambar latar hero bawaan (berkas statis di /public).
export const DEFAULT_HERO_IMAGE = "/images/village-background.png";

export const defaultSiteSettings: SiteSettings = {
  tagline: "Guyub, Tumbuh, dan Berdaya Bersama",
  shortDescription:
    "Website resmi Dusun Cilikan, Umbulmartani, Ngemplak, Sleman — pusat informasi profil, pemerintahan, potensi, dan layanan publik dusun.",
  heroImage: "",
  welcomeMessage:
    "Selamat datang di website resmi Dusun Cilikan, Umbulmartani, Ngemplak, Sleman. Website ini hadir sebagai media informasi bagi warga dan masyarakat luas mengenai profil, potensi, serta kegiatan dusun kami. Mari bersama-sama menjaga kerukunan dan gotong royong demi Dusun Cilikan yang guyub dan sejahtera.",
  locationNote: "Kalurahan Umbulmartani, Kapanewon Ngemplak, Sleman",
  aboutPhotos: [],
  excellence: [
    "Kehidupan sosial guyub dengan tradisi gotong royong yang kuat.",
    "Kelompok tani dan kelompok kandang yang aktif.",
    "Kader posyandu dan kelompok pemuda yang aktif di kegiatan dusun.",
    "Pengurus RW dan RT yang kompak dalam melayani warga.",
  ],

  historySummary:
    "Dusun Cilikan merupakan salah satu dari 15 padukuhan di Kalurahan Umbulmartani, Kapanewon Ngemplak, Kabupaten Sleman, Daerah Istimewa Yogyakarta. Warga dusun terbagi dalam dua RW (RW 09 dan RW 10) dengan empat RT, dan dikenal guyub dengan semangat gotong royong.",
  timeline: [
    {
      year: "Asal-usul nama",
      title: "Wilayah Kiai Cilik",
      description:
        "Menurut catatan budaya di website Kalurahan Umbulmartani, nama Cilikan bermakna wilayah kekuasaan Kiai Cilik, seorang pendakwah yang dikenang dalam cerita tutur dusun ini.",
    },
    {
      year: "Tempo dulu",
      title: "Rumpun Bambu dan Jalan Setapak",
      description:
        "Penuturan tokoh dusun menggambarkan Cilikan pada masa lampau sebagai kawasan berpohon besar dan rumpun bambu, berpenduduk sedikit, belum berlistrik, dan hanya dilalui jalan setapak.",
    },
    {
      year: "2026",
      title: "Digitalisasi Informasi Dusun",
      description:
        "Dusun Cilikan mengembangkan website profil digital sebagai wujud keterbukaan informasi kepada warga dan masyarakat luas.",
    },
  ],
  vision:
    "Mewujudkan Dusun Cilikan yang mandiri, guyub, dan sejahtera melalui tata kelola yang partisipatif serta pengelolaan potensi lokal secara berkelanjutan.",
  missions: [
    "Meningkatkan kualitas pelayanan dan ketertiban administrasi warga dusun.",
    "Mendorong semangat gotong royong dan kebersamaan antarwarga.",
    "Mengembangkan potensi lokal dan UMKM warga dusun.",
    "Memperkuat infrastruktur dan kebersihan lingkungan dusun.",
    "Mendorong partisipasi aktif warga dalam pembangunan dan musyawarah dusun.",
  ],

  // Angka tingkat kalurahan, diberi keterangan agar tidak disangka angka dusun.
  geoArea: "6,62 km² (seluruh Kalurahan Umbulmartani)",
  geoAltitude: "± 275 m di atas permukaan laut",
  geoClimate: "Tropis · curah hujan ± 2.225 mm/tahun",
  // Batas tingkat dusun belum ada sumber publik; Dukuh mengisinya sendiri.
  geoNorth: "",
  geoSouth: "",
  geoEast: "",
  geoWest: "",
  geoTopography:
    "Dusun Cilikan berada di Kalurahan Umbulmartani, Kapanewon Ngemplak, pada dataran di kaki selatan Gunung Merapi dengan areal persawahan dan pekarangan warga. Kalurahan Umbulmartani seluas 6,62 km² dan terdiri dari 15 padukuhan. Sebelah utaranya berbatasan dengan Kalurahan Pakembinangun (Pakem) dan Wukirsari (Cangkringan), sebelah timur dengan Widodomartani, sebelah selatan dengan Sukoharjo dan Sardonoharjo (Ngaglik), dan sebelah barat dengan Harjobinangun (Pakem). Sungai Kuning yang berhulu di Merapi mengalir melewati wilayah kalurahan. Kegiatan warga dusun antara lain bertani dan beternak melalui kelompok tani dan kelompok kandang.",

  address:
    "Dusun Cilikan, Kalurahan Umbulmartani, Kapanewon Ngemplak, Kabupaten Sleman, D.I. Yogyakarta 55584",
  // Nomor telepon, WhatsApp, dan email sengaja kosong: bawaan lama hanyalah
  // contoh. Dukuh mengisinya di dashboard; kartu yang kosong tidak ditampilkan.
  phone: "",
  whatsapp: "",
  email: "",
  serviceHours: "Senin – Jumat, 08.00 – 15.00 WIB",
  mapsUrl: "",
  // Perkiraan lokasi Balai Padukuhan Cilikan; mohon dikonfirmasi lewat peta
  // di Dashboard > Beranda & Profil > Kontak.
  lat: -7.67528,
  lng: 110.42472,
  instagram: "",
  facebook: "",
  youtube: "",
  kalurahanAddress: "Kantor Kalurahan Umbulmartani, Grogolan, Umbulmartani, Ngemplak, Sleman 55584",
  kalurahanPhone: "(0274) 898 091",
};

// Hasil membaca pengaturan: `stored` false berarti belum ada baris di database,
// jadi semua yang tampil adalah isi bawaan.
export type SiteSettingsResult = {
  settings: SiteSettings;
  stored: boolean;
};

export const defaultSiteSettingsResult: SiteSettingsResult = {
  settings: defaultSiteSettings,
  stored: false,
};
