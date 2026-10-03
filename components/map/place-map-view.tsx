"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { MapPlace } from "@/lib/mapPlaces";
import { cn } from "@/lib/utils";
import { PlaceCard } from "./place-card";

// Leaflet and its stylesheet live in this chunk and nowhere else, so pages
// that never show a map never download them.
const PlaceMap = dynamic(() => import("./place-map"), {
  ssr: false,
  loading: () => <MapSkeleton busy />,
});

// Same footprint as the real map (no layout shift), so it can stand in for it
// while it is off-screen or downloading.
function MapSkeleton({ busy = false, count, onLoad }: { busy?: boolean; count?: number; onLoad?: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-brand-50">
      <svg className="absolute inset-0 h-full w-full opacity-60" aria-hidden="true">
        <defs>
          <pattern id="map-skeleton-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="var(--brand-100)" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-skeleton-grid)" />
      </svg>
      <div className="relative flex flex-col items-center gap-3 px-6 text-center" role="status">
        <MapPin className={cn("h-8 w-8 text-brand-700", busy && "animate-pulse")} strokeWidth={1.5} aria-hidden="true" />
        {busy ? (
          <p className="text-sm text-ink-500">Memuat peta…</p>
        ) : (
          <>
            <p className="text-sm text-ink-500">
              {count !== undefined ? `${count} lokasi` : "Peta"} akan dimuat saat bagian ini terlihat.
            </p>
            <button
              type="button"
              onClick={onLoad}
              className="rounded-full border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-white"
            >
              Muat peta sekarang
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function PlaceMapView({
  places,
  selectedId = null,
  onSelect,
  height = "480px",
  eager = false,
  pickMode = false,
  onPick,
  fitKey,
  renderActions,
  className,
  id,
}: {
  places: MapPlace[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  height?: string;
  // Load immediately instead of waiting to scroll into view (for pages where the map is the point).
  eager?: boolean;
  pickMode?: boolean;
  onPick?: (lat: number, lng: number) => void;
  fitKey?: string;
  renderActions?: (place: MapPlace) => ReactNode;
  className?: string;
  id?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);

  // Start loading a little before the map scrolls into view. If the browser
  // has no IntersectionObserver, the skeleton's button still loads it.
  useEffect(() => {
    const el = wrapperRef.current;
    if (visible || !el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  const selected = selectedId ? places.find((p) => p.id === selectedId) : undefined;

  return (
    <div
      ref={wrapperRef}
      id={id}
      className={cn("relative isolate overflow-hidden", className)}
      style={{ height }}
    >
      {visible ? (
        <PlaceMap
          places={places}
          selectedId={selectedId}
          onSelect={onSelect}
          pickMode={pickMode}
          onPick={onPick}
          fitKey={fitKey}
          cardClearance={selected ? 190 : 0}
        />
      ) : (
        <MapSkeleton count={places.length} onLoad={() => setVisible(true)} />
      )}

      {visible && selected && (
        <div className="absolute inset-x-3 bottom-7 z-[1100] sm:right-auto sm:w-[26rem]">
          <PlaceCard place={selected} onClose={() => onSelect?.(null)} actions={renderActions?.(selected)} />
        </div>
      )}
    </div>
  );
}
