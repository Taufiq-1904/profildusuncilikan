export type NavLink = {
  label: string;
  href: string;
  // Present on a group: the parent link stays clickable and the children are
  // shown in a dropdown (desktop) or an indented list (mobile).
  children?: NavLink[];
};

const navigation: NavLink[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Profil",
    href: "/profil",
    children: [
      { label: "Profil Dusun", href: "/profil" },
      { label: "Struktur Organisasi", href: "/profil/struktur" },
      { label: "RW & RT", href: "/pemerintahan" },
      { label: "Galeri", href: "/galeri" },
    ],
  },
  { label: "Berita", href: "/berita" },
  {
    label: "Potensi Dusun",
    href: "/potensi",
    children: [
      { label: "Potensi Dusun", href: "/potensi" },
      { label: "UMKM", href: "/umkm" },
      { label: "Organisasi & Komunitas", href: "/organisasi" },
    ],
  },
  { label: "Peta", href: "/peta" },
];

// Every link once, groups expanded, for places that want a flat list.
export function getFlatNavigation(): NavLink[] {
  const seen = new Set<string>();
  return navigation
    .flatMap((item) => item.children ?? [item])
    .filter((link) => (seen.has(link.href) ? false : (seen.add(link.href), true)));
}

export const siteConfig = {
  villageName: "Dusun Cilikan",
  regency: "Kabupaten Sleman",
  province: "D.I. Yogyakarta",
  tagline: "Guyub, Tumbuh, dan Berdaya Bersama",
  heroBackground: "/images/village-background.png",
  shortDescription:
    "Website resmi Dusun Cilikan, Umbulmartani, Ngemplak, Sleman — pusat informasi profil, pemerintahan, potensi, dan layanan publik dusun.",
  address: "Dusun Cilikan, Kalurahan Umbulmartani, Kapanewon Ngemplak, Kabupaten Sleman, D.I. Yogyakarta 55584",
  phone: "(0274) 895-123",
  whatsapp: "+62 812-2700-0000",
  email: "dusuncilikan@umbulmartani.desa.id",
  serviceHours: "Senin – Jumat, 08.00 – 15.00 WIB",
  coordinates: { lat: -7.7028, lng: 110.4219 },
  // Isi alamat akun resmi di bawah ini (mis. "https://instagram.com/akundusun").
  // Selama masih kosong, ikon sosmed tidak ditampilkan agar tidak ada tombol mati.
  social: {
    instagram: { handle: "", url: "" },
    facebook: { handle: "", url: "" },
    youtube: { handle: "", url: "" },
  },
  navigation,
};
