import { requireSession, requireWilayah } from "./access";
import { PIN_CATEGORIES, type MapPin } from "./data/mapData";
import { getWilayahLevel } from "./data/wilayahData";
import { rowToPin } from "./db/mappers";
import { toUserError } from "./db/errors";
import { validateLocation } from "./geo";
import { removeMedia } from "./image-upload";
import { createRemoteStore } from "./remoteStore";
import { getSupabase } from "./supabase/client";

export type PinInput = Omit<MapPin, "id" | "createdAt">;

function clean(value?: string): string | null {
  const v = value?.trim();
  return v || null;
}

export async function getPins(): Promise<MapPin[]> {
  const { data, error } = await getSupabase()
    .from("map_pins")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw toUserError(error, "Gagal mengambil data lokasi.");
  return (data ?? []).map(rowToPin);
}

export async function getPinsByCreator(creator: MapPin["createdBy"]): Promise<MapPin[]> {
  const { data, error } = await getSupabase()
    .from("map_pins")
    .select("*")
    .eq("wilayah_id", creator)
    .order("created_at", { ascending: false });
  if (error) throw toUserError(error, "Gagal mengambil data lokasi.");
  return (data ?? []).map(rowToPin);
}

export const pinStore = createRemoteStore<MapPin>({ load: getPins });

export async function addPin(input: PinInput): Promise<MapPin> {
  const session = requireSession();
  requireWilayah(session, input.createdBy);

  if (!getWilayahLevel(input.createdBy)) throw new Error("Wilayah pemilik lokasi tidak valid.");
  if (!input.nama.trim()) throw new Error("Nama lokasi wajib diisi.");
  if (!input.deskripsi.trim()) throw new Error("Deskripsi wajib diisi.");
  if (!PIN_CATEGORIES.includes(input.kategori)) throw new Error("Kategori lokasi tidak valid.");
  if (input.lat === undefined || input.lng === undefined) throw new Error("Koordinat tidak valid.");
  validateLocation(input);

  const { data, error } = await getSupabase()
    .from("map_pins")
    .insert({
      nama: input.nama.trim(),
      deskripsi: input.deskripsi.trim(),
      kategori: input.kategori,
      lat: input.lat,
      lng: input.lng,
      kontak: clean(input.kontak),
      alamat: clean(input.alamat),
      foto: clean(input.foto),
      maps_url: clean(input.mapsUrl),
      wilayah_id: input.createdBy,
    })
    .select("*")
    .single();
  if (error || !data) throw toUserError(error ?? { message: "no data" }, "Lokasi gagal disimpan.");

  await pinStore.refresh();
  return rowToPin(data);
}

export async function deletePin(id: string): Promise<void> {
  const session = requireSession();
  const supabase = getSupabase();

  const { data: existing, error: findError } = await supabase
    .from("map_pins")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (findError) throw toUserError(findError, "Lokasi tidak ditemukan.");
  if (!existing) return;

  requireWilayah(session, existing.wilayah_id);

  const { data, error } = await supabase.from("map_pins").delete().eq("id", id).select("id");
  if (error) throw toUserError(error, "Lokasi gagal dihapus.");
  if (!data || data.length === 0) throw new Error("Lokasi gagal dihapus. Periksa hak akses Anda.");

  await removeMedia([existing.foto]);
  await pinStore.refresh();
}

export type { MapPin };
