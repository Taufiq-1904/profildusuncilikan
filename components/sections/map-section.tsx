"use client";

import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "./section-heading";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { buildContact } from "@/lib/siteContact";

/** Contact-page location block: opens Google Maps instead of embedding it. */
export function MapSection({ compact = false }: { compact?: boolean }) {
  const { settings } = useSiteSettings();
  const { mapsHref } = buildContact(settings);

  return (
    <section className={compact ? "" : "py-20 sm:py-28"}>
      <Container>
        {!compact && (
          <SectionHeading
            eyebrow="Lokasi Dusun"
            title="Temukan Kantor Dusun Cilikan"
            description="Kunjungi kantor dusun untuk layanan administrasi dan informasi publik."
            className="mb-10"
          />
        )}

        <div className="grid overflow-hidden rounded-3xl border border-line lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col justify-center gap-6 bg-brand-900 p-8 text-brand-50 sm:p-10">
            {settings.address && (
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Alamat Kantor Dukuh</p>
                  <p className="mt-1 text-sm text-brand-100/80">{settings.address}</p>
                </div>
              </div>
            )}
            {settings.phone && (
              <div className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Telepon</p>
                  <p className="mt-1 text-sm text-brand-100/80">{settings.phone}</p>
                </div>
              </div>
            )}
            {settings.serviceHours && (
              <div className="flex gap-3">
                <Clock className="h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Jam Pelayanan</p>
                  <p className="mt-1 text-sm text-brand-100/80">{settings.serviceHours}</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex min-h-[280px] items-center justify-center bg-brand-50">
            <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-60" aria-hidden="true">
              <path d="M0 60H400M0 120H400M0 180H400M0 240H400" stroke="var(--brand-100)" strokeWidth="1.5" />
              <path d="M60 0V300M140 0V300M220 0V300M300 0V300M380 0V300" stroke="var(--brand-100)" strokeWidth="1.5" />
            </svg>
            <div className="relative flex flex-col items-center gap-4 px-6 text-center">
              <MapPin className="h-8 w-8 text-brand-700" strokeWidth={1.5} aria-hidden="true" />
              <p className="max-w-[260px] text-sm text-ink-700">Buka lokasi dusun di Google Maps untuk petunjuk arah.</p>
              <div className="flex flex-wrap justify-center gap-3">
                {mapsHref && (
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
                  >
                    Buka di Google Maps
                    <span className="sr-only"> (tab baru)</span>
                  </a>
                )}
                <Link
                  href="/peta"
                  className="inline-flex h-11 items-center rounded-full border border-brand-700 px-5 text-sm font-semibold text-brand-700 transition-colors hover:bg-white"
                >
                  Lihat peta dusun
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
