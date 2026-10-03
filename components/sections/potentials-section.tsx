import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "./section-heading";
import { PotentialCard } from "@/components/cards/potential-card";
import { potentials } from "@/lib/data/potentialsData";

export function PotentialsSection() {
  return (
    <section className="bg-brand-50/60 py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Potensi Unggulan"
            title="Kekayaan Cilikan yang Terus Bertumbuh"
            description="Dari sawah subur hingga kerajinan tangan, inilah sektor-sektor yang menopang kehidupan warga Cilikan."
          />
          <Link
            href="/potensi"
            className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex"
          >
            Lihat Semua Potensi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {potentials.slice(0, 4).map((potential) => (
            <PotentialCard key={potential.slug} potential={potential} />
          ))}
        </div>

        <Link
          href="/potensi"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 sm:hidden"
        >
          Lihat Semua Potensi
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Container>
    </section>
  );
}
