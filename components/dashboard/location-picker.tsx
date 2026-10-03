"use client";

import { useMemo, useRef, useState } from "react";
import { ExternalLink, LocateFixed, MapPin, X } from "lucide-react";
import { PlaceMapView } from "@/components/map/place-map-view";
import type { MapPlace, PlaceKind } from "@/lib/mapPlaces";
import { googleMapsUrl, isGoogleMapsHost, parseCoordinatesFromUrl, safeExternalUrl } from "@/lib/links";
import { cn } from "@/lib/utils";
import { fieldClass, hintClass, labelClass } from "./form-styles";

export type PickedLocation = {
  lat?: number;
  lng?: number;
  // Link Google Maps yang ditempel. Kosong bila lokasi ditentukan dengan klik di peta.
  mapsUrl: string;
};

type Status = { tone: "ok" | "error" | "info"; text: string };

const round6 = (n: number) => Math.round(n * 1e6) / 1e6;

// Pilih lokasi tanpa mengetik latitude/longitude:
//   1. klik langsung di peta,
//   2. tempel link Google Maps (panjang atau pendek maps.app.goo.gl) atau teks "lat, lng",
//   3. atau tombol "Gunakan lokasi saya".
// Koordinat tetap disimpan di belakang layar, sehingga tiap tempat bisa dibuka di Google Maps.
export function LocationPicker({
  idPrefix,
  value,
  onChange,
  kind = "Lainnya",
  clearable = false,
  height = "260px",
}: {
  idPrefix: string;
  value: PickedLocation;
  // Menerima potongan (patch) agar pemanggil menggabungkannya dengan data terbarunya.
  onChange: (patch: Partial<PickedLocation>) => void;
  kind?: PlaceKind;
  // Izinkan menghapus penanda (untuk lokasi yang opsional, mis. UMKM dan organisasi).
  clearable?: boolean;
  height?: string;
}) {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  // Menandai permintaan terbaru supaya hasil link lama tidak menimpa pilihan yang lebih baru.
  const requestId = useRef(0);
  const lastApplied = useRef("");

  const hasPoint = Number.isFinite(value.lat) && Number.isFinite(value.lng);

  const places = useMemo<MapPlace[]>(
    () =>
      hasPoint
        ? [{ id: "picked", nama: "Lokasi dipilih", kind, lat: value.lat as number, lng: value.lng as number }]
        : [],
    [hasPoint, kind, value.lat, value.lng]
  );

  function pickOnMap(lat: number, lng: number) {
    requestId.current++;
    lastApplied.current = "";
    setBusy(false);
    // Link lama tidak lagi cocok dengan titik baru, jadi dikosongkan; tombol Google Maps memakai titik ini.
    onChange({ lat, lng, mapsUrl: "" });
    setStatus({ tone: "ok", text: "Penanda diletakkan. Klik di tempat lain untuk memindahkan." });
  }

  async function applyLink(raw: string) {
    const text = raw.trim();
    if (!text) return;
    lastApplied.current = text;
    const id = ++requestId.current;
    const isUrl = Boolean(safeExternalUrl(text));

    const direct = parseCoordinatesFromUrl(text);
    if (direct) {
      onChange({ ...direct, mapsUrl: isUrl ? text : "" });
      setFrameKey((k) => k + 1);
      setStatus({ tone: "ok", text: "Lokasi diambil dari link. Geser dengan klik di peta bila kurang tepat." });
      return;
    }

    if (!isUrl) {
      setStatus({ tone: "error", text: "Tempel link Google Maps atau koordinat seperti -7.7028, 110.4219." });
      return;
    }
    if (!isGoogleMapsHost(new URL(text).hostname)) {
      setStatus({ tone: "error", text: "Itu bukan link Google Maps. Klik lokasinya langsung di peta." });
      return;
    }

    // Link pendek (maps.app.goo.gl) harus dibuka di server untuk mendapat koordinatnya.
    setBusy(true);
    setStatus({ tone: "info", text: "Membaca link Google Maps…" });
    try {
      const res = await fetch(`/api/resolve-maps?url=${encodeURIComponent(text)}`);
      const data = (await res.json()) as { lat?: number; lng?: number; error?: string };
      if (id !== requestId.current) return;
      if (res.ok && Number.isFinite(data.lat) && Number.isFinite(data.lng)) {
        onChange({ lat: data.lat, lng: data.lng, mapsUrl: text });
        setFrameKey((k) => k + 1);
        setStatus({ tone: "ok", text: "Lokasi diambil dari link. Geser dengan klik di peta bila kurang tepat." });
      } else {
        setStatus({ tone: "error", text: data.error ?? "Koordinat tidak ditemukan. Klik lokasi langsung di peta." });
      }
    } catch {
      if (id !== requestId.current) return;
      setStatus({ tone: "error", text: "Link tidak bisa dibaca sekarang. Klik lokasi langsung di peta." });
    } finally {
      if (id === requestId.current) setBusy(false);
    }
  }

  function locateMe() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus({ tone: "error", text: "Perangkat ini tidak mendukung penentuan lokasi." });
      return;
    }
    setBusy(true);
    setStatus({ tone: "info", text: "Mencari lokasi Anda…" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        requestId.current++;
        lastApplied.current = "";
        setBusy(false);
        onChange({ lat: round6(pos.coords.latitude), lng: round6(pos.coords.longitude), mapsUrl: "" });
        setFrameKey((k) => k + 1);
        setStatus({ tone: "ok", text: "Memakai lokasi Anda saat ini. Klik di peta untuk menyesuaikan." });
      },
      () => {
        setBusy(false);
        setStatus({ tone: "error", text: "Lokasi tidak bisa diakses. Izinkan akses lokasi, atau klik langsung di peta." });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function clearPoint() {
    requestId.current++;
    lastApplied.current = "";
    setBusy(false);
    setStatus(null);
    onChange({ lat: undefined, lng: undefined, mapsUrl: "" });
  }

  const verifyUrl = hasPoint ? googleMapsUrl({ lat: value.lat, lng: value.lng, mapsUrl: value.mapsUrl }) : undefined;

  return (
    <div className="space-y-3">
      <div>
        <p className={labelClass}>Lokasi di peta</p>
        <p className="-mt-1 mb-2 text-xs text-ink-500">
          Klik di peta tepat pada tempatnya untuk menaruh penanda, atau tempel link Google Maps di bawah.
        </p>
        <PlaceMapView
          places={places}
          height={height}
          eager
          pickMode
          onPick={pickOnMap}
          fitKey={`picker-${frameKey}`}
          className="rounded-xl border border-line"
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-maps`} className={labelClass}>
          Link Google Maps <span className="font-normal text-ink-500">(opsional)</span>
        </label>
        <input
          id={`${idPrefix}-maps`}
          type="text"
          inputMode="url"
          autoComplete="off"
          value={value.mapsUrl}
          onChange={(e) => onChange({ mapsUrl: e.target.value })}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text");
            if (pasted.trim()) void applyLink(pasted);
          }}
          onBlur={() => {
            const current = value.mapsUrl.trim();
            if (current && current !== lastApplied.current) void applyLink(current);
          }}
          onKeyDown={(e) => {
            // Di dalam <form>, Enter akan menyimpan form; di sini ia hanya membaca link.
            if (e.key === "Enter") {
              e.preventDefault();
              void applyLink(value.mapsUrl);
            }
          }}
          placeholder="https://maps.app.goo.gl/… atau https://www.google.com/maps/…"
          className={fieldClass}
        />
        <p className={hintClass}>
          Salin dari tombol Bagikan di Google Maps. Link pendek juga bisa, lokasinya terbaca otomatis.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={locateMe}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-cream-100 disabled:opacity-50"
        >
          <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
          Gunakan lokasi saya
        </button>
        {verifyUrl && (
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Cek di Google Maps
            <span className="sr-only"> (tab baru)</span>
          </a>
        )}
        {clearable && hasPoint && (
          <button
            type="button"
            onClick={clearPoint}
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Hapus penanda
          </button>
        )}
      </div>

      <div aria-live="polite">
        {status ? (
          <p
            className={cn(
              "rounded-xl px-3 py-2 text-xs",
              status.tone === "error" && "bg-red-50 text-red-600",
              status.tone === "ok" && "bg-brand-50 text-brand-700",
              status.tone === "info" && "bg-cream-100 text-ink-500"
            )}
          >
            {status.text}
          </p>
        ) : !hasPoint ? (
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Belum ada penanda.
          </p>
        ) : null}
      </div>
    </div>
  );
}
