import type { SiteSettings } from "./data/siteSettingsData";
import { facebookUrl, googleMapsUrl, instagramUrl, safeExternalUrl, whatsappUrl } from "./links";

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export type SocialKey = "instagram" | "facebook" | "youtube";

// Tautan kontak turunan dari pengaturan situs, dipakai bersama oleh footer,
// halaman Kontak, dan blok lokasi. Nilai yang kosong atau tidak valid menjadi
// undefined, sehingga pemanggil cukup menyembunyikan baris/tombolnya dan tidak
// ada tombol mati.
export function buildContact(s: SiteSettings) {
  const socials = (
    [
      { key: "instagram", label: "Instagram", href: instagramUrl(s.instagram), raw: s.instagram },
      { key: "facebook", label: "Facebook", href: facebookUrl(s.facebook), raw: s.facebook },
      { key: "youtube", label: "YouTube", href: safeExternalUrl(s.youtube), raw: s.youtube },
    ] as { key: SocialKey; label: string; href: string | undefined; raw: string }[]
  )
    .filter((x) => x.href)
    // Tampilkan @username bila yang diisi bukan link penuh.
    .map((x) => ({ ...x, handle: /^https?:\/\//i.test(x.raw) ? "" : x.raw }));

  return {
    mapsHref: googleMapsUrl({ mapsUrl: s.mapsUrl, lat: s.lat, lng: s.lng }),
    phoneHref: s.phone ? telHref(s.phone) : undefined,
    whatsappHref: whatsappUrl(s.whatsapp),
    emailHref: s.email ? `mailto:${s.email}` : undefined,
    kalurahanPhoneHref: s.kalurahanPhone ? telHref(s.kalurahanPhone) : undefined,
    socials,
  };
}
