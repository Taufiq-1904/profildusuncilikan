"use client";

import { Images } from "lucide-react";
import { GalleryExplorer } from "@/components/sections/gallery-explorer";
import { useGallery, useGalleryReady } from "@/lib/hooks/use-directory";

// Isi halaman /galeri: foto dimuat dari Supabase, jadi ada tiga keadaan —
// memuat, kosong, dan berisi.
export function GalleryPageContent() {
  const items = useGallery();
  const ready = useGalleryReady();

  if (!ready) {
    return (
      <div
        className="grid auto-rows-[220px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        aria-busy="true"
        aria-label="Memuat galeri"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-cream-100" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-line bg-paper py-20 text-center">
        <Images className="h-10 w-10 text-ink-300" aria-hidden="true" />
        <p className="text-sm text-ink-500">Belum ada foto di galeri. Silakan kembali lagi nanti.</p>
      </div>
    );
  }

  return <GalleryExplorer items={items} />;
}
