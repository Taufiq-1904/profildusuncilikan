"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Tag, MapPin, X, Trash2, Plus } from "lucide-react";
import { CATEGORY_COLORS, DUSUN_CENTER, type MapPin as MapPinType } from "@/lib/data/mapData";

type Props = {
  pins: MapPinType[];
  height?: string;
  canAdd?: boolean;
  canDelete?: (pin: MapPinType) => boolean;
  onAddPin?: (lat: number, lng: number) => void;
  onDeletePin?: (id: string) => void;
  showAddHint?: boolean;
};

// Build a colored SVG icon for each category
function buildIcon(color: string) {
  // We use dynamic import (Leaflet not SSR-safe)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require("leaflet");
  const svgStr = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
      </filter>
      <path d="M16 2C9.37 2 4 7.37 4 14c0 10.5 12 26 12 26S28 24.5 28 14C28 7.37 22.63 2 16 2z"
        fill="${color}" filter="url(#shadow)"/>
      <circle cx="16" cy="14" r="5.5" fill="white" opacity="0.9"/>
    </svg>`;
  return L.divIcon({
    html: svgStr,
    className: "custom-pin",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
  });
}

export function InteractiveMap({
  pins,
  height = "480px",
  canAdd = false,
  canDelete,
  onAddPin,
  onDeletePin,
  showAddHint = false,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [selectedPin, setSelectedPin] = useState<MapPinType | null>(null);
  const [addingMode, setAddingMode] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let cancelled = false;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;

      // Fix Leaflet default icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: DUSUN_CENTER,
        zoom: 16,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Click to add pin
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        if (addingMode && onAddPin) {
          onAddPin(
            Math.round(e.latlng.lat * 1e6) / 1e6,
            Math.round(e.latlng.lng * 1e6) / 1e6
          );
          setAddingMode(false);
        }
      });
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update adding mode cursor
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const container = mapInstanceRef.current.getContainer() as HTMLElement;
    container.style.cursor = addingMode ? "crosshair" : "";
  }, [addingMode]);

  // Sync pins → markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      // Remove all existing markers
      mapInstanceRef.current.eachLayer((layer: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((layer as any).options?.icon) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Re-add
      pins.forEach((pin) => {
        const color = CATEGORY_COLORS[pin.kategori];
        const icon = buildIcon(color);
        const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(mapInstanceRef.current);
        marker.on("click", () => setSelectedPin(pin));
      });
    });
  }, [pins]);

  return (
    <div className="relative" style={{ height }}>
      {/* Add mode hint */}
      {canAdd && (
        <div className="absolute left-3 top-3 z-[1000] flex gap-2">
          {!addingMode ? (
            <button
              onClick={() => setAddingMode(true)}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-lg hover:bg-brand-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Lokasi
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white shadow-lg">
              <MapPin className="h-3.5 w-3.5 animate-bounce" />
              Klik di peta untuk menandai lokasi
              <button onClick={() => setAddingMode(false)} className="ml-1 rounded-full hover:bg-amber-600">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Map container */}
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />

      {/* Pin detail popup (custom, outside leaflet) */}
      {selectedPin && (
        <div className="absolute bottom-4 left-1/2 z-[1000] w-full max-w-sm -translate-x-1/2 rounded-2xl border border-line bg-white p-5 shadow-2xl">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <div
                className="mb-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: CATEGORY_COLORS[selectedPin.kategori] }}
              >
                {selectedPin.kategori}
              </div>
              <h3 className="font-display text-base font-semibold text-ink-900">{selectedPin.nama}</h3>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              className="shrink-0 rounded-full p-1.5 text-ink-400 hover:bg-cream hover:text-ink-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-ink-600">{selectedPin.deskripsi}</p>

          {selectedPin.kontak && (
            <a
              href={`tel:${selectedPin.kontak}`}
              className="mt-3 flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {selectedPin.kontak}
            </a>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-ink-400">
              <Tag className="h-3 w-3" />
              Oleh: {selectedPin.createdBy === "dusun" ? "Admin Dusun" : selectedPin.createdBy.toUpperCase()}
            </span>

            {canDelete && canDelete(selectedPin) && onDeletePin && (
              <button
                onClick={() => {
                  onDeletePin(selectedPin.id);
                  setSelectedPin(null);
                }}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Hapus
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
