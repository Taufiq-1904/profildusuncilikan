"use client";

import { useEffect, useRef } from "react";
import type { PlaceKind } from "@/lib/mapPlaces";
import { fieldClass, labelClass } from "./form-styles";
import { LocationPicker, type PickedLocation } from "./location-picker";

export type LocationValues = { alamat: string; mapsUrl: string; lat: string; lng: string };

// Alamat + pemilih lokasi di peta, dipakai semua form yang datanya bisa tampil di peta.
// Pengguna tidak mengetik latitude/longitude: cukup klik di peta atau tempel link Google Maps.
// Nilai tetap disimpan sebagai string (lat/lng) agar form pemanggil tidak perlu diubah;
// pemanggil mengubahnya dengan parseCoordinate saat menyimpan.
export function LocationFields({
  idPrefix,
  values,
  onChange,
  kind,
}: {
  idPrefix: string;
  values: LocationValues;
  onChange: (next: LocationValues) => void;
  kind?: PlaceKind;
}) {
  // Pembacaan link berjalan async; tanpa ref ini ia bisa menimpa alamat yang baru diketik.
  const latest = useRef(values);
  useEffect(() => {
    latest.current = values;
  });

  const picked: PickedLocation = {
    lat: parseCoordinate(values.lat),
    lng: parseCoordinate(values.lng),
    mapsUrl: values.mapsUrl,
  };

  function handlePick(patch: Partial<PickedLocation>) {
    const next = { ...latest.current };
    if ("mapsUrl" in patch) next.mapsUrl = patch.mapsUrl ?? "";
    if ("lat" in patch) next.lat = patch.lat === undefined ? "" : String(patch.lat);
    if ("lng" in patch) next.lng = patch.lng === undefined ? "" : String(patch.lng);
    latest.current = next;
    onChange(next);
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={`${idPrefix}-alamat`} className={labelClass}>Alamat</label>
        <input
          id={`${idPrefix}-alamat`}
          type="text"
          value={values.alamat}
          onChange={(e) => onChange({ ...latest.current, alamat: e.target.value })}
          className={fieldClass}
        />
      </div>

      <LocationPicker idPrefix={idPrefix} value={picked} onChange={handlePick} kind={kind} clearable />
    </div>
  );
}

// "" -> undefined, a number -> number, junk -> NaN (so the caller can report it).
export function parseCoordinate(value: string): number | undefined {
  const v = value.trim().replace(",", ".");
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : Number.NaN;
}
