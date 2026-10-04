/* eslint-disable @typescript-eslint/no-explicit-any */
// Pemetaan baris database (snake_case) <-> tipe aplikasi (camelCase).
// Dipakai bersama oleh service di browser dan fetcher di server.

import { AGE_GROUPS, type Demografi } from "../data/demografiData";
import type { DusunOfficial } from "../data/dusunOfficialsData";
import type { GalleryItem, GallerySpan } from "../data/galleryData";
import type { MapPin } from "../data/mapData";
import type { NewsArticle } from "../data/newsData";
import type { Organization } from "../data/organizationData";
import type { RTPotensi } from "../data/potensiData";
import {
  defaultSiteSettings,
  type SiteSettings,
  type SiteSettingsResult,
  type TimelineEntry,
} from "../data/siteSettingsData";
import type { UMKM } from "../data/umkmData";

type Row = Record<string, any>;

const opt = <V>(v: V | null | undefined): V | undefined => (v === null || v === undefined ? undefined : v);

export function rowToNews(r: Row): NewsArticle {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content ?? [],
    coverImage: opt(r.cover_image),
    categoryId: r.category_id,
    status: r.status,
    publishedAt: r.published_at,
    authorUsername: r.author_username ?? "",
    authorName: r.author_name ?? "",
    wilayahId: r.wilayah_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function rowToUmkm(r: Row): UMKM {
  return {
    id: r.id,
    slug: r.slug,
    nama: r.nama,
    jenis: r.jenis ?? "",
    pemilik: r.pemilik ?? "",
    tampilkanPemilik: Boolean(r.tampilkan_pemilik),
    kontak: opt(r.kontak),
    deskripsi: opt(r.deskripsi),
    produk: opt(r.produk),
    alamat: opt(r.alamat),
    jamOperasional: opt(r.jam_operasional),
    mapsUrl: opt(r.maps_url),
    lat: opt(r.lat),
    lng: opt(r.lng),
    logo: opt(r.logo),
    galeri: r.galeri ?? [],
    aktif: Boolean(r.aktif),
    rtId: r.rt_id,
    createdBy: opt(r.created_by),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function rowToOrganization(r: Row): Organization {
  const members = Array.isArray(r.members) ? r.members : [];
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    logo: opt(r.logo),
    summary: r.summary ?? "",
    description: r.description ?? [],
    fieldId: r.field_id,
    wilayahId: r.wilayah_id,
    foundedYear: opt(r.founded_year),
    leader: opt(r.leader),
    contact: opt(r.contact),
    alamat: opt(r.alamat),
    mapsUrl: opt(r.maps_url),
    lat: opt(r.lat),
    lng: opt(r.lng),
    instagram: opt(r.instagram),
    facebook: opt(r.facebook),
    website: opt(r.website),
    gallery: r.gallery ?? [],
    // Kosong berarti "hanya profil" (sama seperti sebelumnya).
    members: members.length > 0 ? members : undefined,
    createdBy: opt(r.created_by),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function rowToOfficial(r: Row): DusunOfficial {
  return {
    id: r.id,
    name: r.name,
    position: r.position,
    photo: opt(r.photo),
    period: opt(r.period),
    ownerId: r.owner_id ?? "dusun",
    wilayahId: opt(r.wilayah_id),
    tier: r.tier,
    order: r.sort_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function rowToPin(r: Row): MapPin {
  return {
    id: r.id,
    nama: r.nama,
    deskripsi: r.deskripsi ?? "",
    kategori: r.kategori,
    lat: Number(r.lat),
    lng: Number(r.lng),
    kontak: opt(r.kontak),
    alamat: opt(r.alamat),
    foto: opt(r.foto),
    mapsUrl: opt(r.maps_url),
    createdBy: r.wilayah_id,
    createdAt: r.created_at?.slice(0, 10) ?? "",
  };
}

export function rowToPotensi(r: Row): RTPotensi {
  return {
    id: r.id,
    judul: r.judul,
    deskripsi: r.deskripsi ?? "",
    kategori: r.kategori,
    rtId: r.rt_id,
  };
}

export function rowToDemografi(r: Row): Demografi {
  const umur: unknown[] = Array.isArray(r.kelompok_umur) ? r.kelompok_umur : [];
  return {
    rtId: r.rt_id,
    jumlahKK: Number(r.jumlah_kk),
    laki: Number(r.laki),
    perempuan: Number(r.perempuan),
    kelompokUmur: AGE_GROUPS.map((_, i) => Number(umur[i] ?? 0)),
  };
}

// --- Konten situs -------------------------------------------------------------

// Kolom yang belum pernah disimpan (null) memakai isi bawaan; kolom yang sengaja
// dikosongkan Dukuh (teks "" atau daftar []) tetap kosong.
const text = (v: unknown, fallback: string): string => (typeof v === "string" ? v : fallback);

const textList = (v: unknown, fallback: string[]): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : fallback;

const timelineList = (v: unknown, fallback: TimelineEntry[]): TimelineEntry[] => {
  if (!Array.isArray(v)) return fallback;
  return v
    .filter((x): x is Row => typeof x === "object" && x !== null)
    .map((x) => ({
      year: text(x.year, ""),
      title: text(x.title, ""),
      description: text(x.description, ""),
    }));
};

const num = (v: unknown, fallback: number | undefined): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

export function rowToSiteSettings(r: Row | null | undefined): SiteSettingsResult {
  const d = defaultSiteSettings;
  if (!r) return { settings: d, stored: false };
  const settings: SiteSettings = {
    tagline: text(r.tagline, d.tagline),
    shortDescription: text(r.short_description, d.shortDescription),
    heroImage: text(r.hero_image, d.heroImage),
    welcomeMessage: text(r.welcome_message, d.welcomeMessage),
    locationNote: text(r.location_note, d.locationNote),
    aboutPhotos: textList(r.about_photos, d.aboutPhotos),
    excellence: textList(r.excellence, d.excellence),

    historySummary: text(r.history_summary, d.historySummary),
    timeline: timelineList(r.timeline, d.timeline),
    vision: text(r.vision, d.vision),
    missions: textList(r.missions, d.missions),

    geoArea: text(r.geo_area, d.geoArea),
    geoAltitude: text(r.geo_altitude, d.geoAltitude),
    geoClimate: text(r.geo_climate, d.geoClimate),
    geoNorth: text(r.geo_north, d.geoNorth),
    geoSouth: text(r.geo_south, d.geoSouth),
    geoEast: text(r.geo_east, d.geoEast),
    geoWest: text(r.geo_west, d.geoWest),
    geoTopography: text(r.geo_topography, d.geoTopography),

    address: text(r.address, d.address),
    phone: text(r.phone, d.phone),
    whatsapp: text(r.whatsapp, d.whatsapp),
    email: text(r.email, d.email),
    serviceHours: text(r.service_hours, d.serviceHours),
    mapsUrl: text(r.maps_url, d.mapsUrl),
    lat: num(r.lat, d.lat),
    lng: num(r.lng, d.lng),
    instagram: text(r.instagram, d.instagram),
    facebook: text(r.facebook, d.facebook),
    youtube: text(r.youtube, d.youtube),
    kalurahanAddress: text(r.kalurahan_address, d.kalurahanAddress),
    kalurahanPhone: text(r.kalurahan_phone, d.kalurahanPhone),
  };
  return { settings, stored: true };
}

export function rowToGalleryPhoto(r: Row): GalleryItem {
  const span: GallerySpan = r.span === "tall" || r.span === "wide" ? r.span : "normal";
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    image: r.image,
    span,
    order: Number(r.sort_order ?? 0),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}
