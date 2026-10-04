"use client";

import { Target, Compass } from "lucide-react";
import { Container } from "@/components/layout/container";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { Timeline } from "./timeline";

// Sejarah, visi-misi, dan kondisi geografis halaman /profil. Semua teksnya
// dikelola Dukuh di Dashboard > Beranda & Profil; bagian yang dikosongkan
// tidak ditampilkan sama sekali.
export function ProfileContent() {
  const { settings } = useSiteSettings();

  const hasHistory = Boolean(settings.historySummary) || settings.timeline.length > 0;
  const hasVisionMission = Boolean(settings.vision) || settings.missions.length > 0;

  const geoCards = [
    { label: "Luas Wilayah", value: settings.geoArea },
    { label: "Ketinggian", value: settings.geoAltitude },
    { label: "Iklim", value: settings.geoClimate },
    { label: "Batas Utara", value: settings.geoNorth },
    { label: "Batas Selatan", value: settings.geoSouth },
    { label: "Batas Timur", value: settings.geoEast },
    { label: "Batas Barat", value: settings.geoWest },
  ].filter((c) => c.value);
  const hasGeography = geoCards.length > 0 || Boolean(settings.geoTopography);

  return (
    <>
      {hasHistory && (
        <section className="py-20 sm:py-24">
          <Container>
            <SectionHeading
              eyebrow="Sejarah"
              title="Perjalanan Dusun Cilikan"
              description={settings.historySummary || undefined}
              className="mb-12"
            />
            {settings.timeline.length > 0 && <Timeline items={settings.timeline} />}
          </Container>
        </section>
      )}

      {hasVisionMission && (
        <section className="bg-brand-950 py-20 text-white sm:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              {settings.vision && (
                <div>
                  <Compass className="h-8 w-8 text-gold-400" strokeWidth={1.5} />
                  <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Visi</h2>
                  <p className="mt-4 text-balance text-lg leading-relaxed text-brand-100/90">
                    {settings.vision}
                  </p>
                </div>
              )}
              {settings.missions.length > 0 && (
                <div>
                  <Target className="h-8 w-8 text-gold-400" strokeWidth={1.5} />
                  <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Misi</h2>
                  <ol className="mt-4 space-y-3">
                    {settings.missions.map((mission, i) => (
                      <li key={`${i}-${mission}`} className="flex gap-3 text-sm leading-relaxed text-brand-100/85">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-400 text-xs font-semibold text-gold-400">
                          {i + 1}
                        </span>
                        {mission}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {hasGeography && (
        <section className="py-20 sm:py-24">
          <Container>
            <SectionHeading eyebrow="Wilayah" title="Kondisi Geografis" className="mb-10" />
            {geoCards.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {geoCards.map((item) => (
                  <Card key={item.label} className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-ink-900">{item.value}</p>
                  </Card>
                ))}
              </div>
            )}
            {settings.geoTopography && (
              <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-500">
                {settings.geoTopography}
              </p>
            )}
          </Container>
        </section>
      )}
    </>
  );
}
