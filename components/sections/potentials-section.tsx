"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "./section-heading";
import { PotentialCard } from "@/components/cards/potential-card";
import { usePotensi } from "@/lib/hooks/use-directory";

export function PotentialsSection() {
  const potensi = usePotensi();

  // Bagian ini hanya tampil bila pengelola sudah menginput potensi.
  if (potensi.length === 0) return null;

  // Potensi terbaru lebih dulu; store mengurutkan dari yang paling lama.
  const latest = [...potensi].reverse().slice(0, 4);

  return (
    <section className="bg-brand-50/60 py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Potensi Unggulan"
            title="Kekayaan Cilikan yang Terus Bertumbuh"
            description="Potensi yang dikelola dan dicatat langsung oleh pengurus RT, RW, dan dusun."
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
          {latest.map((potential) => (
            <PotentialCard key={potential.id} potential={potential} />
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
