import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PotentialCard } from "@/components/cards/potential-card";
import { potentials } from "@/lib/data/potentialsData";

export function generateStaticParams() {
  return potentials.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const potential = potentials.find((p) => p.slug === slug);
  if (!potential) return {};
  return {
    title: potential.title,
    description: potential.summary,
    openGraph: { title: potential.title, description: potential.summary },
  };
}

export default async function PotensiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const potential = potentials.find((p) => p.slug === slug);
  if (!potential) notFound();

  const related = potentials.filter((p) => p.slug !== potential.slug).slice(0, 3);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Potensi Dusun", href: "/potensi" },
          { label: potential.title },
        ]}
      />

      <article className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <ImagePlaceholder
                tone={potential.imageTone}
                icon={potential.icon}
                label={potential.title}
                className="aspect-[4/3] w-full rounded-3xl"
              />

              <Badge variant="gold" className="mt-8">
                {potential.category}
              </Badge>
              <h1 className="mt-4 text-balance font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
                {potential.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                {potential.summary}
              </p>

              <div className="mt-8 space-y-4">
                {potential.description.map((para, i) => (
                  <p key={i} className="text-base leading-relaxed text-ink-700">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              {potential.stats && (
                <Card className="p-6">
                  <h2 className="font-display text-base font-semibold text-ink-900">
                    Data Singkat
                  </h2>
                  <dl className="mt-4 space-y-4">
                    {potential.stats.map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between border-b border-line pb-3 last:border-0 last:pb-0">
                        <dt className="text-sm text-ink-500">{stat.label}</dt>
                        <dd className="text-sm font-semibold text-ink-900">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              )}

              <Card className="bg-brand-950 p-6 text-white">
                <h2 className="font-display text-base font-semibold">Tertarik Berkolaborasi?</h2>
                <p className="mt-2 text-sm text-brand-100/80">
                  Hubungi kantor dukuh untuk informasi lebih lanjut mengenai potensi ini.
                </p>
                <Link
                  href="/kontak"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300"
                >
                  Hubungi Kami
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            </aside>
          </div>
        </Container>
      </article>

      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <h2 className="mb-8 font-display text-2xl font-semibold text-ink-900">
            Potensi Lainnya
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PotentialCard key={p.slug} potential={p} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
