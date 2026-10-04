"use client";

import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import { Container } from "@/components/layout/container";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { MediaImage } from "@/components/ui/media-image";
import { SectionHeading } from "./section-heading";

export function AboutSection() {
  const { settings } = useSiteSettings();
  const [first, second, third] = settings.aboutPhotos;

  // Kolom yang dikosongkan Dukuh tidak ditampilkan, jadi tidak ada "Data menyusul".
  const facts = [
    { label: "Lokasi", value: settings.locationNote },
    { label: "Luas Wilayah", value: settings.geoArea },
    { label: "Ketinggian", value: settings.geoAltitude },
    { label: "Iklim", value: settings.geoClimate },
  ].filter((f) => f.value);

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Tentang Dusun"
              title="Mengenal Lebih Dekat Dusun Cilikan"
              description={settings.historySummary}
            />

            {facts.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{f.label}</dt>
                    <dd className="mt-1 text-sm text-ink-900">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {settings.excellence.length > 0 && (
              <ul className="mt-8 space-y-3">
                {settings.excellence.map((point, i) => (
                  <li key={`${i}-${point}`} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                    <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            <Link
              href="/profil"
              className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Lihat Profil Lengkap
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Foto diunggah Dukuh; slot yang kosong menampilkan placeholder bergambar ikon. */}
          <div className="grid grid-cols-2 gap-4">
            <MediaImage
              src={first}
              alt="Suasana Dusun Cilikan"
              icon="wheat"
              tone="green"
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="aspect-[3/4] rounded-2xl"
            />
            <div className="flex flex-col gap-4">
              <MediaImage
                src={second}
                alt="Lingkungan Dusun Cilikan"
                icon="mountain-snow"
                tone="sky"
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="aspect-square rounded-2xl"
              />
              <MediaImage
                src={third}
                alt="Kegiatan warga Dusun Cilikan"
                icon="trees"
                tone="gold"
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="aspect-square rounded-2xl"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
