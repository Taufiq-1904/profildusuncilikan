import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "./section-heading";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { villageHistory, geography, villageExcellence } from "@/lib/data/villageData";

export function AboutSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Tentang Dusun"
              title="Mengenal Lebih Dekat Dusun Cilikan"
              description={villageHistory.summary}
            />

            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">Lokasi</dt>
                <dd className="mt-1 text-sm text-ink-900">Kaki Bukit Girimulyo</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">Luas Wilayah</dt>
                <dd className="mt-1 text-sm text-ink-900">{geography.area}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">Ketinggian</dt>
                <dd className="mt-1 text-sm text-ink-900">{geography.altitude}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">Iklim</dt>
                <dd className="mt-1 text-sm text-ink-900">{geography.climate}</dd>
              </div>
            </dl>

            <ul className="mt-8 space-y-3">
              {villageExcellence.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                  <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              href="/profil"
              className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Lihat Profil Lengkap
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ImagePlaceholder tone="green" icon="wheat" label="Sawah Cilikan" className="aspect-[3/4] rounded-2xl" />
            <div className="flex flex-col gap-4">
              <ImagePlaceholder tone="sky" icon="mountain-snow" label="Perbukitan Cilikan" className="aspect-square rounded-2xl" />
              <ImagePlaceholder tone="gold" icon="trees" label="Kebun Warga" className="aspect-square rounded-2xl" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
