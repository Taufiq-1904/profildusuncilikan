"use client";

import { Quote } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { headWelcome } from "@/lib/data/officialsData";
import { useWilayahHeads } from "@/lib/hooks/use-directory";

export function HeadWelcomeSection() {
  const { headOf, ready } = useWilayahHeads();
  const head = headOf("dusun");

  // Nama dan jabatan dibaca dari Dashboard > Struktur (kepala wilayah "dusun").
  const name = head?.name ?? (ready ? "Dukuh Cilikan" : "…");
  const position = head?.position ?? "Dukuh";

  return (
    <section className="bg-cream py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="relative mx-auto w-full max-w-xs">
            <ImagePlaceholder
              tone="green"
              icon="users"
              label={name}
              className="aspect-[4/5] w-full rounded-3xl"
            />
            <div className="absolute -bottom-5 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl border border-line bg-paper px-5 py-3 text-center shadow-md">
              <p className="font-display text-sm font-semibold text-ink-900">{name}</p>
              <p className="text-xs text-ink-500">{position}</p>
            </div>
          </div>

          <div className="pt-6 lg:pt-0">
            <Quote className="h-9 w-9 text-gold-500" strokeWidth={1.5} />
            <p className="mt-4 text-balance font-display text-xl leading-relaxed text-ink-900 sm:text-2xl">
              {headWelcome.message}
            </p>
            <div className="mt-7 h-px w-16 bg-gold-500" />
            <p className="mt-4 font-display text-base font-semibold text-brand-800">{name}</p>
            <p className="text-sm text-ink-500">
              {position}
              {head?.period ? ` · Periode ${head.period}` : ""}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
