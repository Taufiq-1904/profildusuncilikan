"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { CATEGORY_COLORS } from "@/lib/data/mapData";
import { usePins } from "@/lib/hooks/use-directory";

// Dynamically import map to avoid SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/ui/interactive-map").then((m) => m.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-brand-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="text-sm text-ink-500">Memuat peta...</p>
        </div>
      </div>
    ),
  }
);

export function MapSectionInteractive({ compact = false }: { compact?: boolean }) {
  const { pins, loading } = usePins();
  const mounted = !loading;

  // Category legend
  const uniqueCategories = [...new Set(pins.map((p) => p.kategori))];

  return (
    <section className={compact ? "" : "py-16 sm:py-24"}>
      <Container>
        {!compact && (
          <SectionHeading
            eyebrow="Peta Dusun"
            title="Peta Interaktif Dusun Cilikan"
            description="Temukan lokasi-lokasi penting di Dusun Cilikan. Klik pin untuk detail dan kontak."
            className="mb-8"
          />
        )}

        <div className="overflow-hidden rounded-3xl border border-line shadow-lg">
          {/* Legend */}
          {mounted && uniqueCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 border-b border-line bg-cream-100 px-5 py-3">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Kategori:</span>
              {uniqueCategories.map((cat) => (
                <span key={cat} className="flex items-center gap-1.5 text-xs font-medium text-ink-700">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                  />
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Map */}
          <div style={{ height: compact ? "320px" : "480px" }}>
            {mounted ? (
              <InteractiveMap pins={pins} height={compact ? "320px" : "480px"} />
            ) : (
              <div className="flex h-full items-center justify-center bg-brand-50">
                <p className="text-sm text-ink-500">Memuat peta...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between bg-cream-100 px-5 py-3">
            <p className="flex items-center gap-2 text-xs text-ink-500">
              <MapPin className="h-3.5 w-3.5 text-brand-600" />
              {mounted ? pins.length : "–"} lokasi terdaftar
            </p>
            {!compact && (
              <Link
                href="/peta"
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
              >
                Buka peta penuh
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
