"use client";

import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/lib/data/galleryData";

export function GalleryCard({
  item,
  onOpen,
}: {
  item: GalleryItem;
  onOpen?: (item: GalleryItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      aria-label={`Perbesar foto: ${item.title}`}
      className={cn(
        "group relative block w-full overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2",
        item.span === "tall" && "row-span-2",
        item.span === "wide" && "sm:col-span-2"
      )}
    >
      <MediaImage
        src={item.image}
        alt={item.title}
        icon="package"
        sizes={
          item.span === "wide"
            ? "(min-width: 1024px) 50vw, (min-width: 640px) 66vw, 100vw"
            : "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        }
        className={cn("h-full w-full", item.span === "tall" ? "aspect-[3/4]" : "aspect-[4/3]")}
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 p-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-300">
          {item.category}
        </p>
        <p className="text-sm font-medium text-white">{item.title}</p>
      </div>
    </button>
  );
}
