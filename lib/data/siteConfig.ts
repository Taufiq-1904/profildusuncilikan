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

// Identitas dan navigasi yang tetap. Teks yang bisa berubah (tagline, deskripsi,
// kontak, media sosial, foto latar) dikelola Dukuh di Dashboard > Beranda & Profil
// dan dibaca lewat useSiteSettings(); isi bawaannya ada di siteSettingsData.ts.
export const siteConfig = {
  villageName: "Dusun Cilikan",
  regency: "Kabupaten Sleman",
  province: "D.I. Yogyakarta",
  navigation,
};
