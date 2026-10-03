import { PLACE_KIND_COLORS, type PlaceKind } from "@/lib/mapPlaces";

// One glyph per kind, drawn on a 24x24 grid with a round white stroke. Colour
// alone is not enough to tell kinds apart (and fails for colour-blind
// visitors), so each kind also has its own shape.
const GLYPHS: Record<PlaceKind, string> = {
  "Fasilitas Umum": "M3 21h18M5 21V9l7-5 7 5v12M10 21v-5h4v5",
  Ibadah: "M5 21v-7a7 7 0 0 1 14 0v7M3 21h18M12 7V3M9.5 21v-3.5a2.5 2.5 0 0 1 5 0V21",
  Pendidikan: "M5 4h13a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V4zM5 18a2 2 0 0 1 2-2h12",
  Kesehatan: "M12 5v14M5 12h14",
  Keamanan: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z",
  UMKM: "M4 10v10h16V10M3 10l2-6h14l2 6H3zM10 20v-5h4v5",
  Organisasi: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.2a3 3 0 0 1 0 5.6M18 14.3c1.8.8 3 2.6 3 4.7",
  Lainnya: "M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10zM12 11h.01",
};

const svgAttrs =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

// HTML for a Leaflet divIcon. Styling lives in globals.css (.map-pin), so an
// icon is a few bytes of markup: no per-marker SVG filters or duplicate ids.
export function markerHtml(kind: PlaceKind): string {
  return `<span class="map-pin" style="--pin:${PLACE_KIND_COLORS[kind]}"><svg ${svgAttrs}><path d="${GLYPHS[kind]}"/></svg></span>`;
}

// The same glyph as a React element, for the legend, chips and list.
export function PlaceGlyph({ kind, className = "h-7 w-7" }: { kind: PlaceKind; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-white ${className}`}
      style={{ backgroundColor: PLACE_KIND_COLORS[kind] }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[58%] w-[58%]"
      >
        <path d={GLYPHS[kind]} />
      </svg>
    </span>
  );
}
