import { requireDusun, requireSession } from "./access";
import {
  MAX_ABOUT_PHOTOS,
  MAX_LIST_ITEMS,
  MAX_TIMELINE_ENTRIES,
  type SiteSettings,
  type SiteSettingsResult,
} from "./data/siteSettingsData";
import { rowToSiteSettings } from "./db/mappers";
import { toUserError } from "./db/errors";
import { droppedMedia, removeMedia } from "./image-upload";
import { facebookUrl, instagramUrl, isPhoneLike, safeExternalUrl } from "./links";
import { getSupabase } from "./supabase/client";

// Dibaca browser tanpa login (RLS: site_settings dapat dibaca siapa saja).
export async function fetchSiteSettings(): Promise<SiteSettingsResult> {
  const { data, error } = await getSupabase().from("site_settings").select("*").eq("id", "main").maybeSingle();
  if (error) throw toUserError(error, "Pengaturan situs gagal dimuat.");
  return rowToSiteSettings(data);
}

const cleanList = (list: string[]): string[] => list.map((x) => x.trim()).filter(Boolean);

// Merapikan isian form: spasi di tepi dibuang, baris kosong pada daftar dan
// linimasa dihapus. Dipakai sebelum validasi dan penyimpanan.
export function normalizeSettings(s: SiteSettings): SiteSettings {
  const t = (v: string) => v.trim();
  return {
    ...s,
    tagline: t(s.tagline),
    shortDescription: t(s.shortDescription),
    heroImage: t(s.heroImage),
    welcomeMessage: t(s.welcomeMessage),
    locationNote: t(s.locationNote),
    aboutPhotos: cleanList(s.aboutPhotos),
    excellence: cleanList(s.excellence),
    historySummary: t(s.historySummary),
    timeline: s.timeline
      .map((e) => ({ year: t(e.year), title: t(e.title), description: t(e.description) }))
      .filter((e) => e.year || e.title || e.description),
    vision: t(s.vision),
    missions: cleanList(s.missions),
    geoArea: t(s.geoArea),
    geoAltitude: t(s.geoAltitude),
    geoClimate: t(s.geoClimate),
    geoNorth: t(s.geoNorth),
    geoSouth: t(s.geoSouth),
    geoEast: t(s.geoEast),
    geoWest: t(s.geoWest),
    geoTopography: t(s.geoTopography),
    address: t(s.address),
    phone: t(s.phone),
    whatsapp: t(s.whatsapp),
    email: t(s.email),
    serviceHours: t(s.serviceHours),
    mapsUrl: t(s.mapsUrl),
    instagram: t(s.instagram),
    facebook: t(s.facebook),
    youtube: t(s.youtube),
    kalurahanAddress: t(s.kalurahanAddress),
    kalurahanPhone: t(s.kalurahanPhone),
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Pesan dibuat spesifik supaya Dukuh tahu kolom mana yang perlu diperbaiki.
export function validateSettings(s: SiteSettings): void {
  if (!s.tagline) throw new Error("Tagline di tab Beranda wajib diisi.");
  if (s.tagline.length > 100) throw new Error("Tagline maksimal 100 karakter.");
  if (!s.shortDescription) throw new Error("Deskripsi singkat di tab Beranda wajib diisi.");
  if (s.shortDescription.length > 300) throw new Error("Deskripsi singkat maksimal 300 karakter.");
  if (s.welcomeMessage.length > 1500) throw new Error("Sambutan Dukuh maksimal 1.500 karakter.");
  if (s.aboutPhotos.length > MAX_ABOUT_PHOTOS) throw new Error(`Foto bagian Tentang Dusun maksimal ${MAX_ABOUT_PHOTOS}.`);
  if (s.excellence.length > MAX_LIST_ITEMS) throw new Error(`Keunggulan maksimal ${MAX_LIST_ITEMS} butir.`);

  if (s.timeline.length > MAX_TIMELINE_ENTRIES) throw new Error(`Linimasa sejarah maksimal ${MAX_TIMELINE_ENTRIES} peristiwa.`);
  s.timeline.forEach((e, i) => {
    if (!e.year || !e.title) throw new Error(`Peristiwa ke-${i + 1} di linimasa harus punya Tahun/Masa dan Judul.`);
  });
  if (s.missions.length > MAX_LIST_ITEMS) throw new Error(`Misi maksimal ${MAX_LIST_ITEMS} butir.`);

  if (s.phone && !isPhoneLike(s.phone)) throw new Error("Nomor telepon hanya boleh berisi angka, spasi, +, tanda kurung, dan tanda hubung.");
  if (s.whatsapp && !isPhoneLike(s.whatsapp)) throw new Error("Nomor WhatsApp hanya boleh berisi angka, spasi, +, tanda kurung, dan tanda hubung.");
  if (s.kalurahanPhone && !isPhoneLike(s.kalurahanPhone)) throw new Error("Nomor telepon kalurahan hanya boleh berisi angka, spasi, +, tanda kurung, dan tanda hubung.");
  if (s.email && !EMAIL_PATTERN.test(s.email)) throw new Error("Format email tidak valid.");
  if (s.instagram && !instagramUrl(s.instagram)) throw new Error("Instagram: isi @username atau link lengkap (https://instagram.com/...).");
  if (s.facebook && !facebookUrl(s.facebook)) throw new Error("Facebook: isi nama halaman atau link lengkap (https://facebook.com/...).");
  if (s.youtube && !safeExternalUrl(s.youtube)) throw new Error("YouTube: isi link lengkap yang diawali https://.");
  if (s.mapsUrl && !safeExternalUrl(s.mapsUrl)) throw new Error("Link Google Maps harus diawali https://.");

  const hasLat = Number.isFinite(s.lat);
  const hasLng = Number.isFinite(s.lng);
  if (hasLat !== hasLng) throw new Error("Lokasi di peta belum lengkap. Pilih titik di peta atau tempel link Google Maps.");
  if (hasLat && (Math.abs(s.lat as number) > 90 || Math.abs(s.lng as number) > 180)) {
    throw new Error("Koordinat lokasi tidak valid.");
  }
}

function toRow(s: SiteSettings) {
  return {
    id: "main",
    tagline: s.tagline,
    short_description: s.shortDescription,
    hero_image: s.heroImage,
    welcome_message: s.welcomeMessage,
    location_note: s.locationNote,
    about_photos: s.aboutPhotos,
    excellence: s.excellence,
    history_summary: s.historySummary,
    timeline: s.timeline,
    vision: s.vision,
    missions: s.missions,
    geo_area: s.geoArea,
    geo_altitude: s.geoAltitude,
    geo_climate: s.geoClimate,
    geo_north: s.geoNorth,
    geo_south: s.geoSouth,
    geo_east: s.geoEast,
    geo_west: s.geoWest,
    geo_topography: s.geoTopography,
    address: s.address,
    phone: s.phone,
    whatsapp: s.whatsapp,
    email: s.email,
    service_hours: s.serviceHours,
    maps_url: s.mapsUrl,
    lat: Number.isFinite(s.lat) ? s.lat : null,
    lng: Number.isFinite(s.lng) ? s.lng : null,
    instagram: s.instagram,
    facebook: s.facebook,
    youtube: s.youtube,
    kalurahan_address: s.kalurahanAddress,
    kalurahan_phone: s.kalurahanPhone,
  };
}

// Menyimpan seluruh konten situs. Hanya akun Dusun; pemeriksaan di sini hanya
// untuk pesan yang ramah, yang mengikat adalah Row Level Security di database
// (policy site_insert / site_update memakai is_dusun()).
export async function saveSiteSettings(input: SiteSettings, previous: SiteSettings): Promise<SiteSettingsResult> {
  requireDusun(requireSession());
  const next = normalizeSettings(input);
  validateSettings(next);

  const { data, error } = await getSupabase()
    .from("site_settings")
    .upsert(toRow(next), { onConflict: "id" })
    .select("*")
    .single();
  if (error || !data) throw toUserError(error ?? { message: "no data" }, "Pengaturan situs gagal disimpan.");

  // Foto yang diganti/dihapus tidak dipakai lagi; bersihkan dari Storage.
  await removeMedia(
    droppedMedia([previous.heroImage, ...previous.aboutPhotos], [next.heroImage, ...next.aboutPhotos])
  );

  // Perbarui cache HTML di server. Gagal pun tidak masalah: cache habis sendiri
  // dalam 5 menit, dan browser selalu memuat data terbaru.
  void fetch("/api/revalidate-site", { method: "POST" }).catch(() => {});

  return rowToSiteSettings(data);
}
