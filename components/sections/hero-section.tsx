"use client";

import Link from "next/link";
import { ArrowRight, MapPinned, Map } from "lucide-react";
import { Container } from "@/components/layout/container";
import { useHeroImage, useSiteSettings } from "@/components/providers/site-settings-provider";
import { siteConfig } from "@/lib/data/siteConfig";

export function HeroSection() {
  const { settings } = useSiteSettings();
  // Foto yang sama juga dipakai header semua halaman (PageHeader).
  const background = useHeroImage();

  return (
    <section
      className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-brand-950 bg-cover bg-center pb-20 pt-40 sm:min-h-[85vh]"
      style={{
        backgroundImage: `url("${background}")`,
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/65 to-brand-950/15"
        style={{
          backgroundColor: "rgba(5, 46, 22, 0.2)",
        }}
      />

      <Container className="relative">
        <div className="animate-fade-up max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300 backdrop-blur-sm">
            <MapPinned className="h-3.5 w-3.5" />
            {siteConfig.regency}, {siteConfig.province}
          </span>

          <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {siteConfig.villageName}
          </h1>
          {settings.tagline && (
            <p className="mt-3 font-display text-lg italic text-amber-400 sm:text-xl">
              &ldquo;{settings.tagline}&rdquo;
            </p>
          )}
          {settings.shortDescription && (
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              {settings.shortDescription}
            </p>
          )}

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/profil"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 transition-all hover:bg-brand-400 hover:shadow-brand-900/60"
            >
              Jelajahi Dusun
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/peta"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Map className="h-4 w-4" />
              Lihat Peta
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
