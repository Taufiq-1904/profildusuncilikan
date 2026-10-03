"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMapPlaces } from "@/lib/hooks/use-directory";
import { PLACE_KIND_ORDER, type PlaceKind } from "@/lib/mapPlaces";
import { cn } from "@/lib/utils";
import { PlaceGlyph } from "./marker-icons";
import { PlaceList } from "./place-list";
import { PlaceMapView } from "./place-map-view";

// Public map. `compact` is the homepage preview: a legend and the map, no
// search or list. The full version adds kind filters, search and a list.
export function MapExplorer({ compact = false }: { compact?: boolean }) {
  const places = useMapPlaces();
  const [hidden, setHidden] = useState<ReadonlySet<PlaceKind>>(new Set());
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Only kinds that actually have places get a chip.
  const kinds = useMemo(() => {
    const counts = new Map<PlaceKind, number>();
    places.forEach((p) => counts.set(p.kind, (counts.get(p.kind) ?? 0) + 1));
    return PLACE_KIND_ORDER.filter((k) => counts.has(k)).map((k) => ({ kind: k, count: counts.get(k) ?? 0 }));
  }, [places]);

  const visiblePlaces = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter(
      (p) =>
        !hidden.has(p.kind) &&
        (!q || p.nama.toLowerCase().includes(q) || (p.alamat ?? "").toLowerCase().includes(q))
    );
  }, [places, hidden, query]);

  // A selection that has been filtered out is no longer selected.
  const activeId = visiblePlaces.some((p) => p.id === selectedId) ? selectedId : null;
  const fitKey = visiblePlaces.map((p) => p.id).join(",");

  function toggleKind(kind: PlaceKind) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }

  function selectFromList(id: string) {
    setSelectedId(id);
    // On a phone the list sits below the map, so bring the map back into view.
    const map = document.getElementById("peta-utama");
    if (map) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      map.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    }
  }

  const legend = (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Keterangan jenis lokasi">
      {kinds.map(({ kind }) => (
        <li key={kind} className="flex items-center gap-2 text-xs font-medium text-ink-700">
          <PlaceGlyph kind={kind} className="h-5 w-5" />
          {kind}
        </li>
      ))}
    </ul>
  );

  if (compact) {
    return (
      <div className="overflow-hidden rounded-3xl border border-line bg-paper shadow-sm">
        <div className="border-b border-line bg-cream px-5 py-3">{legend}</div>
        <PlaceMapView
          places={places}
          selectedId={selectedId}
          onSelect={setSelectedId}
          height="380px"
          className="rounded-none"
        />
        <div className="flex items-center justify-between bg-cream px-5 py-3">
          <p className="text-xs text-ink-500">{places.length} lokasi</p>
          <Link href="/peta" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
            Buka peta lengkap
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau alamat"
            aria-label="Cari lokasi"
            className="h-11 w-full rounded-full border border-line bg-paper pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <p className="text-sm text-ink-500" aria-live="polite">
          {visiblePlaces.length} dari {places.length} lokasi ditampilkan
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter jenis lokasi">
        {kinds.map(({ kind, count }) => {
          const on = !hidden.has(kind);
          return (
            <button
              key={kind}
              type="button"
              onClick={() => toggleKind(kind)}
              aria-pressed={on}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-xs font-semibold transition-colors",
                on ? "border-brand-700 bg-brand-50 text-brand-800" : "border-line text-ink-500 hover:border-brand-300"
              )}
            >
              <span className={cn(!on && "opacity-40")}>
                <PlaceGlyph kind={kind} className="h-6 w-6" />
              </span>
              {kind}
              <span className="text-ink-500">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <PlaceMapView
          id="peta-utama"
          places={visiblePlaces}
          selectedId={activeId}
          onSelect={setSelectedId}
          fitKey={fitKey}
          height="clamp(380px, 62vh, 600px)"
          eager
          className="rounded-3xl border border-line shadow-sm"
        />

        <aside aria-label="Daftar lokasi" className="flex max-h-[600px] flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-sm">
          <h2 className="border-b border-line bg-cream px-4 py-3 font-display text-base font-semibold text-ink-900">
            Daftar Lokasi
          </h2>
          <PlaceList places={visiblePlaces} selectedId={activeId} onSelect={selectFromList} className="overflow-y-auto" />
        </aside>
      </div>
    </div>
  );
}
