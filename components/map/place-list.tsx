import { cn } from "@/lib/utils";
import type { MapPlace } from "@/lib/mapPlaces";
import { PlaceGlyph } from "./marker-icons";

// Text alternative to the map: the same places as a list. Useful on phones,
// for keyboard and screen-reader users, and as an index of what is on the map.
export function PlaceList({
  places,
  selectedId,
  onSelect,
  className,
}: {
  places: MapPlace[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  className?: string;
}) {
  if (places.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-ink-500">Tidak ada lokasi yang cocok.</p>;
  }
  return (
    <ul className={cn("divide-y divide-line", className)}>
      {places.map((place) => {
        const active = place.id === selectedId;
        return (
          <li key={place.id}>
            <button
              type="button"
              onClick={() => onSelect(place.id)}
              aria-pressed={active}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                active ? "bg-brand-50" : "hover:bg-cream-100"
              )}
            >
              <PlaceGlyph kind={place.kind} className="h-9 w-9" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink-900">{place.nama}</span>
                <span className="block truncate text-xs text-ink-500">
                  {place.kind}
                  {place.wilayah ? ` · ${place.wilayah}` : ""}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
