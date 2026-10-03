"use client";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { useWilayahHeads } from "@/lib/hooks/use-directory";

export function KepalaDusunSection() {
  const { headOf, ready } = useWilayahHeads();
  const head = headOf("dusun");
  const name = head?.name ?? (ready ? "Belum diisi" : "…");
  const initial = head ? head.name.trim().charAt(0).toUpperCase() : "–";

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Pimpinan" title="Kepala Dusun Cilikan" className="mb-10" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
          <div className="flex-shrink-0">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-brand-100 text-4xl font-bold text-brand-700 shadow-sm">
              {initial}
            </div>
          </div>
          <div>
            <p className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {head?.position ?? "Dukuh"}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900">{name}</h2>
            {head?.period && <p className="mt-1 text-sm text-ink-500">Masa jabatan: {head.period}</p>}
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-700">
              Kepala Dusun Cilikan bertanggung jawab atas koordinasi kegiatan kemasyarakatan, pembinaan warga,
              serta menjadi penghubung antara warga dusun dengan kelurahan dan instansi terkait.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
