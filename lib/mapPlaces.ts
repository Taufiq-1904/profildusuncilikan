import { CATEGORY_COLORS, type MapPin, type PinCategory } from "./data/mapData";
import type { Organization } from "./data/organizationData";
import type { UMKM } from "./data/umkmData";
import { getRTWithRWLabel, getWilayahLabel } from "./data/wilayahData";
import { hasCoordinates } from "./geo";
import { googleMapsUrl } from "./links";

// Everything the map can show, whatever it came from. The map itself only
// knows about MapPlace, so a new source (say, a future "Fasilitas" table) is
// one more mapper here and no change to any map component.
export type PlaceKind = PinCategory | "Organisasi";

export type MapPlace = {
  id: string;
  nama: string;
  kind: PlaceKind;
  lat: number;
  lng: number;
  alamat?: string;
  deskripsi?: string;
  kontak?: string;
  foto?: string;
  wilayah?: string;
  // Internal page for this place, when it has one.
  detailHref?: string;
  // Explicit Google Maps link; otherwise one is built from the coordinates.
  mapsUrl?: string;
};

export const PLACE_KIND_COLORS: Record<PlaceKind, string> = {
  ...CATEGORY_COLORS,
  Organisasi: "#be185d",
};

export const PLACE_KIND_ORDER: PlaceKind[] = [
  "Fasilitas Umum",
  "Ibadah",
  "Pendidikan",
  "Kesehatan",
  "Keamanan",
  "UMKM",
  "Organisasi",
  "Lainnya",
];

export function placeMapsUrl(place: MapPlace): string {
  // Coordinates are always present on a MapPlace, so this never comes back empty.
  return googleMapsUrl(place) as string;
}

export function pinToPlace(pin: MapPin): MapPlace {
  return {
    id: pin.id,
    nama: pin.nama,
    kind: pin.kategori,
    lat: pin.lat,
    lng: pin.lng,
    alamat: pin.alamat,
    deskripsi: pin.deskripsi,
    kontak: pin.kontak,
    foto: pin.foto,
    mapsUrl: pin.mapsUrl,
    wilayah: getWilayahLabel(pin.createdBy),
  };
}

export function umkmToPlace(umkm: UMKM & { lat: number; lng: number }): MapPlace {
  return {
    id: `umkm:${umkm.id}`,
    nama: umkm.nama,
    kind: "UMKM",
    lat: umkm.lat,
    lng: umkm.lng,
    alamat: umkm.alamat,
    deskripsi: umkm.deskripsi,
    kontak: umkm.kontak,
    foto: umkm.galeri[0] ?? umkm.logo,
    wilayah: getRTWithRWLabel(umkm.rtId),
    detailHref: `/umkm/${umkm.slug}`,
    mapsUrl: umkm.mapsUrl,
  };
}

export function organizationToPlace(org: Organization & { lat: number; lng: number }): MapPlace {
  return {
    id: `org:${org.id}`,
    nama: org.name,
    kind: "Organisasi",
    lat: org.lat,
    lng: org.lng,
    alamat: org.alamat,
    deskripsi: org.summary,
    kontak: org.contact,
    foto: org.logo,
    wilayah: getWilayahLabel(org.wilayahId),
    detailHref: `/organisasi/${org.slug}`,
    mapsUrl: org.mapsUrl,
  };
}

// Great-circle distance in metres.
export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Older browsers may still hold pins saved as category "UMKM" for businesses
// that are in the directory now. When the directory entry is right there, the
// directory wins, so the same shop is not drawn twice.
const DUPLICATE_RADIUS_M = 30;

export function buildMapPlaces(sources: {
  pins: MapPin[];
  umkm: UMKM[];
  organizations: Organization[];
}): MapPlace[] {
  const umkmPlaces = sources.umkm.filter((u) => u.aktif && hasCoordinates(u)).map((u) => umkmToPlace(u as UMKM & { lat: number; lng: number }));
  const orgPlaces = sources.organizations
    .filter(hasCoordinates)
    .map((o) => organizationToPlace(o as Organization & { lat: number; lng: number }));

  const pinPlaces = sources.pins
    .filter((p) => hasCoordinates(p))
    .filter((p) => p.kategori !== "UMKM" || !umkmPlaces.some((u) => distanceMeters(p, u) <= DUPLICATE_RADIUS_M))
    .map(pinToPlace);

  const order = (k: PlaceKind) => PLACE_KIND_ORDER.indexOf(k);
  return [...pinPlaces, ...umkmPlaces, ...orgPlaces].sort(
    (a, b) => order(a.kind) - order(b.kind) || a.nama.localeCompare(b.nama, "id")
  );
}
