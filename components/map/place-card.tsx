"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, X } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { googleMapsDirectionsUrl } from "@/lib/links";
import { PLACE_KIND_COLORS, placeMapsUrl, type MapPlace } from "@/lib/mapPlaces";
import { cn } from "@/lib/utils";

// Detail card for the selected marker. It is React rather than a Leaflet
// popup so it can use next/link, the shared image component and normal focus
// handling, and so nothing here has to be loaded with the map itself.
export function PlaceCard({
  place,
  onClose,
  actions,
  className,
}: {
  place: MapPlace;
  onClose: () => void;
  // Extra controls, e.g. "Hapus" on the dashboard.
  actions?: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <section
      aria-label={`Detail lokasi ${place.nama}`}
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-paper shadow-xl",
        className
      )}
    >
      <div className="flex gap-4 p-4">
        {place.foto && (
          <MediaImage
            src={place.foto}
            alt={`Foto ${place.nama}`}
            icon="package"
            sizes="96px"
            className="h-24 w-24 shrink-0 rounded-xl"
          />
        )}
        <div className="min-w-0 flex-1">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
            style={{ backgroundColor: PLACE_KIND_COLORS[place.kind] }}
          >
            {place.kind}
          </span>
          <h3 className="mt-1.5 text-balance font-display text-base font-semibold leading-snug text-ink-900">
            {place.nama}
          </h3>
          {place.alamat ? (
            <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-500">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="line-clamp-2">{place.alamat}</span>
            </p>
          ) : (
            place.wilayah && <p className="mt-1 text-sm text-ink-500">{place.wilayah}</p>
          )}
          {place.kontak && (
            <a
              href={`tel:${place.kontak}`}
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {place.kontak}
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail lokasi"
          className="-mr-1 -mt-1 h-8 w-8 shrink-0 self-start rounded-full text-ink-500 transition-colors hover:bg-cream-100 hover:text-ink-900"
        >
          <X className="mx-auto h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-cream px-4 py-3">
        {place.detailHref && (
          <Link
            href={place.detailHref}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Lihat Detail
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
        <a
          href={placeMapsUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors",
            place.detailHref
              ? "border border-line text-ink-700 hover:bg-cream-100"
              : "bg-brand-700 text-white hover:bg-brand-800"
          )}
        >
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          Buka di Google Maps
          <span className="sr-only"> (tab baru)</span>
        </a>
        <a
          href={googleMapsDirectionsUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-semibold text-ink-700 transition-colors hover:bg-cream-100"
        >
          Petunjuk arah
          <span className="sr-only"> (tab baru)</span>
        </a>
        {actions}
      </div>
    </section>
  );
}
