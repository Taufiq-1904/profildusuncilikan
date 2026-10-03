import type { Metadata } from "next";
import { Target, Compass } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Timeline } from "@/components/sections/timeline";
import { DemografiSection, WilayahSection } from "@/components/sections/kependudukan";
import { Card } from "@/components/ui/card";
import {
  villageHistory,
  villageVision,
  villageMissions,
  geography,
} from "@/lib/data/villageData";
import { siteConfig } from "@/lib/data/siteConfig";

export const metadata: Metadata = {
  title: "Profil Dusun",
  description: `Sejarah, visi misi, kondisi geografis, dan demografi ${siteConfig.villageName}.`,
};

export default function ProfilPage() {
  return (
    <>
      <PageHeader
        eyebrow="Profil Dusun"
        title="Mengenal Dusun Cilikan"
        description="Sejarah, arah pembangunan, dan data wilayah Dusun Cilikan, Umbulmartani, Sleman."
      />
      <Breadcrumb items={[{ label: "Profil Dusun" }]} />

      {/* Sejarah */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Sejarah"
            title="Perjalanan Dusun Cilikan"
            description={villageHistory.summary}
            className="mb-12"
          />
          <Timeline items={villageHistory.timeline} />
        </Container>
      </section>

      {/* Visi Misi */}
      <section className="bg-brand-950 py-20 text-white sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Compass className="h-8 w-8 text-gold-400" strokeWidth={1.5} />
              <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Visi</h2>
              <p className="mt-4 text-balance text-lg leading-relaxed text-brand-100/90">
                {villageVision}
              </p>
            </div>
            <div>
              <Target className="h-8 w-8 text-gold-400" strokeWidth={1.5} />
              <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Misi</h2>
              <ol className="mt-4 space-y-3">
                {villageMissions.map((mission, i) => (
                  <li key={mission} className="flex gap-3 text-sm leading-relaxed text-brand-100/85">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-400 text-xs font-semibold text-gold-400">
                      {i + 1}
                    </span>
                    {mission}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* Geografis */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Wilayah" title="Kondisi Geografis" className="mb-10" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Luas Wilayah", value: geography.area },
              { label: "Ketinggian", value: geography.altitude },
              { label: "Iklim", value: geography.climate },
              { label: "Batas Utara", value: geography.boundaries.north },
            ].map((item) => (
              <Card key={item.label} className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium text-ink-900">{item.value}</p>
              </Card>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Batas Selatan", value: geography.boundaries.south },
              { label: "Batas Timur", value: geography.boundaries.east },
              { label: "Batas Barat", value: geography.boundaries.west },
            ].map((item) => (
              <Card key={item.label} className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium text-ink-900">{item.value}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-500">
            {geography.topography}
          </p>
        </Container>
      </section>

      <DemografiSection />
      <WilayahSection />
    </>
  );
}
