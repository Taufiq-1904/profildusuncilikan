import { requireSession, requireWilayah } from "./access";
import { validateLocation } from "./geo";
import { createLocalStore } from "./localStore";
import { initialPins, PIN_CATEGORIES, type MapPin } from "./data/mapData";
import { getWilayahLevel } from "./data/wilayahData";

// Same storage key as before, so pins already saved in a browser are kept.
export const pinStore = createLocalStore<MapPin>({
  key: "cilikan_map_pins",
  seed: initialPins,
});

export type PinInput = Omit<MapPin, "id" | "createdAt">;

// Plain reads for code that is not subscribed to the store.
export function getPins(): MapPin[] {
  return pinStore.getSnapshot();
}

export function getPinsByCreator(creator: MapPin["createdBy"]): MapPin[] {
  return getPins().filter((p) => p.createdBy === creator);
}

function clean(value?: string): string | undefined {
  const v = value?.trim();
  return v || undefined;
}

// `createdBy` is the wilayah that owns the pin, so it is also what decides who
// may add or remove it.
export function addPin(input: PinInput): MapPin {
  const session = requireSession();
  requireWilayah(session, input.createdBy);

  if (!getWilayahLevel(input.createdBy)) throw new Error("Wilayah pemilik lokasi tidak valid.");
  if (!input.nama.trim()) throw new Error("Nama lokasi wajib diisi.");
  if (!input.deskripsi.trim()) throw new Error("Deskripsi wajib diisi.");
  if (!PIN_CATEGORIES.includes(input.kategori)) throw new Error("Kategori lokasi tidak valid.");
  if (input.lat === undefined || input.lng === undefined) throw new Error("Koordinat tidak valid.");
  validateLocation(input);

  const pin: MapPin = {
    ...input,
    nama: input.nama.trim(),
    deskripsi: input.deskripsi.trim(),
    kontak: clean(input.kontak),
    alamat: clean(input.alamat),
    mapsUrl: clean(input.mapsUrl),
    id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  pinStore.write([...getPins(), pin]);
  return pin;
}

export function deletePin(id: string): void {
  const session = requireSession();
  const all = getPins();
  const pin = all.find((p) => p.id === id);
  if (!pin) return;
  requireWilayah(session, pin.createdBy);
  pinStore.write(all.filter((p) => p.id !== id));
}

export type { MapPin };
