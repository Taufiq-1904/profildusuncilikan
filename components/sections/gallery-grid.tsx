"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryCard } from "@/components/cards/gallery-card";
import { MediaImage } from "@/components/ui/media-image";
import type { GalleryItem } from "@/lib/data/galleryData";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);
  const showNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
  const showPrev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      <div className="grid auto-rows-[220px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <GalleryCard
            key={item.id}
            item={item}
            onOpen={(i) => setActiveIndex(items.findIndex((g) => g.id === i.id))}
          />
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-950/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Tutup"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Sebelumnya"
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <MediaImage
              src={active.image}
              alt={active.title}
              icon="package"
              fit="contain"
              priority
              sizes="(min-width: 768px) 672px, 100vw"
              className="aspect-[4/3] w-full rounded-2xl bg-black/20"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-300">
                {active.category}
              </p>
              <p className="mt-1 font-display text-lg">{active.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Selanjutnya"
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}
