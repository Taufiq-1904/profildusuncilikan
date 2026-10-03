"use client";

import { useMemo, useState } from "react";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/lib/data/galleryData";

export function GalleryExplorer({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState("Semua");
  const categories = ["Semua", ...Array.from(new Set(items.map((i) => i.category)))];

  const filtered = useMemo(
    () => (category === "Semua" ? items : items.filter((i) => i.category === category)),
    [items, category]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
              category === c
                ? "border-brand-700 bg-brand-700 text-white"
                : "border-line text-ink-500 hover:border-brand-300 hover:text-brand-700"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <GalleryGrid items={filtered} />
      </div>
    </div>
  );
}
