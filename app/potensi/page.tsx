import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { PotentialCard } from "@/components/cards/potential-card";
import { potentials } from "@/lib/data/potentialsData";
import { siteConfig } from "@/lib/data/siteConfig";

export const metadata: Metadata = {
  title: "Potensi Dusun",
  description: `Potensi pertanian, UMKM, wisata, dan produk unggulan ${siteConfig.villageName}.`,
};

export default function PotensiPage() {
  const categories = Array.from(new Set(potentials.map((p) => p.category)));

  return (
    <>
      <PageHeader
        eyebrow="Potensi Dusun"
        title="Kekayaan dan Peluang Cilikan"
        description="Pertanian, perkebunan, peternakan, UMKM, wisata, hingga kerajinan yang menjadi kekuatan ekonomi dusun."
      />
      <Breadcrumb items={[{ label: "Potensi Dusun" }]} />

      <section className="py-20 sm:py-24">
        <Container>
          {categories.map((category) => {
            const items = potentials.filter((p) => p.category === category);
            return (
              <div key={category} className="mb-16 last:mb-0">
                <h2 className="mb-6 font-display text-2xl font-semibold text-ink-900">
                  {category}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((potential) => (
                    <PotentialCard key={potential.slug} potential={potential} />
                  ))}
                </div>
              </div>
            );
          })}
        </Container>
      </section>
    </>
  );
}
