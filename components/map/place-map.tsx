"use client";

import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DUSUN_CENTER } from "@/lib/data/mapData";
import type { MapPlace, PlaceKind } from "@/lib/mapPlaces";
import { markerHtml } from "./marker-icons";

export type PlaceMapProps = {
  places: MapPlace[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  // When on, a click on the map reports coordinates instead of clearing the selection.
  pickMode?: boolean;
  onPick?: (lat: number, lng: number) => void;
  // Change this to re-frame the map; the view is left alone when it stays the same.
  fitKey?: string;
  // Pixels at the bottom kept clear for the detail card.
  cardClearance?: number;
};

// One icon per kind, built once. Markers share it instead of each carrying its own markup.
const iconCache = new Map<PlaceKind, L.DivIcon>();
function iconFor(kind: PlaceKind): L.DivIcon {
  let icon = iconCache.get(kind);
  if (!icon) {
    icon = L.divIcon({
      html: markerHtml(kind),
      className: "map-marker",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
    iconCache.set(kind, icon);
  }
  return icon;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Thin imperative wrapper around Leaflet. Nothing in here renders React UI:
// the detail card, filters and list live outside so this chunk stays small
// and is only fetched when a map is actually about to be seen.
export default function PlaceMap({
  places,
  selectedId = null,
  onSelect,
  pickMode = false,
  onPick,
  fitKey,
  cardClearance = 0,
}: PlaceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const fittedFor = useRef<string | null>(null);

  // Leaflet handlers are attached once, so they read the latest props from a
  // ref. (Capturing props directly is what made "add pin" silently do nothing.)
  const latest = useRef({ onSelect, onPick, pickMode });
  useEffect(() => {
    latest.current = { onSelect, onPick, pickMode };
  });

  // Create the map once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: DUSUN_CENTER,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      // Wheel zoom would hijack page scrolling; it switches on once the map has focus.
      scrollWheelZoom: false,
    });

    L.control.zoom({ position: "topright", zoomInTitle: "Perbesar", zoomOutTitle: "Perkecil" }).addTo(map);
    L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { pickMode: picking, onPick: pick, onSelect: select } = latest.current;
      if (picking) pick?.(Math.round(e.latlng.lat * 1e6) / 1e6, Math.round(e.latlng.lng * 1e6) / 1e6);
      else select?.(null);
    });
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());

    // The container changes size when filters or the list reflow around it.
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);

    mapRef.current = map;
    const markers = markersRef.current;
    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      markers.clear();
      fittedFor.current = null;
    };
  }, []);

  // Crosshair while picking a location.
  useEffect(() => {
    containerRef.current?.classList.toggle("is-picking", pickMode);
  }, [pickMode]);

  // Draw markers, and re-frame the map only when fitKey changes.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markersRef.current.clear();
    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: iconFor(place.kind),
        title: `${place.nama} (${place.kind})`,
        alt: `${place.nama}, ${place.kind}`,
        riseOnHover: true,
      });
      marker.on("click", () => latest.current.onSelect?.(place.id));
      marker.addTo(layer);
      markersRef.current.set(place.id, marker);
    });

    const key = fitKey ?? places.map((p) => p.id).join(",");
    if (fittedFor.current !== key) {
      fittedFor.current = key;
      const animate = !prefersReducedMotion();
      if (places.length === 1) {
        map.setView([places[0].lat, places[0].lng], 17, { animate });
      } else if (places.length > 1) {
        map.fitBounds(L.latLngBounds(places.map((p) => [p.lat, p.lng] as [number, number])), {
          padding: [48, 48],
          maxZoom: 17,
          animate,
        });
      }
    }
  }, [places, fitKey]);

  // Highlight the selected marker and nudge it clear of the detail card.
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.getElement()?.classList.toggle("is-selected", id === selectedId);
      marker.setZIndexOffset(id === selectedId ? 1000 : 0);
    });

    const map = mapRef.current;
    const place = selectedId ? places.find((p) => p.id === selectedId) : undefined;
    if (!map || !place) return;

    const size = map.getSize();
    const point = map.latLngToContainerPoint([place.lat, place.lng]);
    const margin = 48;
    const maxY = size.y - cardClearance - margin;
    const dy = point.y > maxY ? point.y - maxY : point.y < margin ? point.y - margin : 0;
    const dx = point.x < margin ? point.x - margin : point.x > size.x - margin ? point.x - (size.x - margin) : 0;
    if (dx || dy) map.panBy([dx, dy], { animate: !prefersReducedMotion() });
  }, [selectedId, places, cardClearance]);

  return <div ref={containerRef} className="h-full w-full" />;
}
