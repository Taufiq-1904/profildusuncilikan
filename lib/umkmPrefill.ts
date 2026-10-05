import type { MapPin } from "./data/mapData";
import { getWilayahLevel } from "./data/wilayahData";

// Data awal untuk form UMKM baru yang berasal dari sebuah pinpoint. UMKM hanya
// punya satu sumber, yaitu tabel `umkm`, supaya yang tampil di daftar UMKM dan
// yang tampil di peta selalu sama. Pinpoint berkategori UMKM tidak disimpan
// sendiri; ia dibawa ke form UMKM lewat tautan ini.
export type UmkmPrefill = {
  nama?: string;
  deskripsi?: string;
  kontak?: string;
  alamat?: string;
  mapsUrl?: string;
  lat?: string;
  lng?: string;
  logo?: string;
  rtId?: string;
  // Pinpoint lama yang dipindahkan; dihapus setelah UMKM-nya tersimpan.
  dariPin?: string;
};

const FIELDS: Array<keyof UmkmPrefill> = [
  "nama", "deskripsi", "kontak", "alamat", "mapsUrl", "lat", "lng", "logo", "rtId", "dariPin",
];

const NEW_UMKM_PATH = "/dashboard/umkm/baru";

export function umkmFormHref(prefill: UmkmPrefill): string {
  const query = new URLSearchParams();
  for (const key of FIELDS) {
    const value = prefill[key]?.trim();
    if (value) query.set(key === "rtId" ? "rt" : key, value);
  }
  const qs = query.toString();
  return qs ? `${NEW_UMKM_PATH}?${qs}` : NEW_UMKM_PATH;
}

export function readUmkmPrefill(params: URLSearchParams): UmkmPrefill {
  const get = (key: string) => params.get(key) ?? undefined;
  return {
    nama: get("nama"),
    deskripsi: get("deskripsi"),
    kontak: get("kontak"),
    alamat: get("alamat"),
    mapsUrl: get("mapsUrl"),
    lat: get("lat"),
    lng: get("lng"),
    logo: get("logo"),
    rtId: get("rt"),
    dariPin: get("dariPin"),
  };
}

// Pinpoint "UMKM" yang sudah telanjur tersimpan sebelum perbaikan ini.
export function umkmFormHrefFromPin(pin: MapPin): string {
  return umkmFormHref({
    nama: pin.nama,
    deskripsi: pin.deskripsi,
    kontak: pin.kontak,
    alamat: pin.alamat,
    mapsUrl: pin.mapsUrl,
    lat: String(pin.lat),
    lng: String(pin.lng),
    logo: pin.foto,
    rtId: getWilayahLevel(pin.createdBy) === "rt" ? pin.createdBy : undefined,
    dariPin: pin.id,
  });
}
