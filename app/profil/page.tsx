import type { Metadata } from "next";
import { Target, Compass } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Timeline } from "@/components/sections/timeline";
import { BarStat } from "@/components/sections/bar-stat";
import { Card } from "@/components/ui/card";
import {
  villageHistory,
  villageVision,
  villageMissions,
  geography,
  demographics,
  administrativeAreas,
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

      {/* Demografi */}
      <section className="bg-cream py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Kependudukan" title="Demografi Dusun" className="mb-10" />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
              {[
                { label: "Total Penduduk", value: demographics.total },
                { label: "Laki-laki", value: demographics.male },
                { label: "Perempuan", value: demographics.female },
                { label: "Kepala Keluarga", value: demographics.households },
              ].map((item) => (
                <Card key={item.label} className="p-5">
                  <p className="font-display text-2xl font-semibold text-ink-900">
                    {item.value.toLocaleString("id-ID")}
                  </p>
                  <p className="mt-1 text-sm text-ink-500">{item.label}</p>
                </Card>
              ))}
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 font-display text-base font-semibold text-ink-900">
                  Berdasarkan Kelompok Usia
                </h3>
                <BarStat data={demographics.byAge} total={demographics.total} />
              </div>
              <div>
                <h3 className="mb-4 font-display text-base font-semibold text-ink-900">
                  Berdasarkan Mata Pencaharian
                </h3>
                <BarStat data={demographics.byLivelihood} total={demographics.total} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Wilayah Administratif */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Wilayah Administratif"
            title="RT dan RW Dusun Cilikan"
            description="Dusun Cilikan berada di Kalurahan Umbulmartani dan terbagi ke dalam 4 RT dalam 1 RW, dengan total 142 kepala keluarga."
            className="mb-10"
          />
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-brand-50 text-xs font-semibold uppercase tracking-wide text-brand-800">
                <tr>
                  <th className="px-5 py-3.5">Wilayah RT</th>
                  <th className="px-5 py-3.5">Ketua RT</th>
                  <th className="px-5 py-3.5">Nomor RT</th>
                  <th className="px-5 py-3.5">Nomor RW</th>
                  <th className="px-5 py-3.5">Kepala Keluarga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {administrativeAreas.map((area) => (
                  <tr key={area.name} className="hover:bg-cream-100/60">
                    <td className="px-5 py-4 font-medium text-ink-900">{area.name}</td>
                    <td className="px-5 py-4 text-ink-700">{area.head}</td>
                    <td className="px-5 py-4 text-ink-700">{area.rt}</td>
                    <td className="px-5 py-4 text-ink-700">{area.rw}</td>
                    <td className="px-5 py-4 text-ink-700">{area.households}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>
    </>
  );
}
