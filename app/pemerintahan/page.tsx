import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { RTTabs } from "@/components/sections/rt-tabs";
import { officials, villageHead } from "@/lib/data/officialsData";
import { siteConfig } from "@/lib/data/siteConfig";

export const metadata: Metadata = {
  title: "Pemerintahan",
  description: `Struktur pemerintahan, perangkat, dan data RT ${siteConfig.villageName}.`,
};

export default function PemerintahanPage() {
  const rtOfficials = officials.filter((o) => o.category === "rt");

  return (
    <>
      <PageHeader
        eyebrow="Pemerintahan"
        title="Struktur Pemerintahan Dusun"
        description="Mengenal perangkat dan pengurus Dusun Cilikan yang melayani masyarakat."
      />
      <Breadcrumb items={[{ label: "Pemerintahan" }]} />

      {/* Kepala Dusun */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Pimpinan" title="Kepala Dusun Cilikan" className="mb-10" />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
            {/* Avatar block */}
            <div className="flex-shrink-0">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-brand-100 text-4xl font-bold text-brand-700 shadow-sm">
                {villageHead.name.split(" ").slice(-1)[0].charAt(0)}
              </div>
            </div>
            <div>
              <p className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {villageHead.position}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900">{villageHead.name}</h2>
              {villageHead.period && (
                <p className="mt-1 text-sm text-ink-500">Masa jabatan: {villageHead.period}</p>
              )}
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-700">
                Kepala Dusun Cilikan bertanggung jawab atas koordinasi kegiatan kemasyarakatan, pembinaan warga,
                serta menjadi penghubung antara warga dusun dengan kelurahan dan instansi terkait.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4 Ketua RT */}
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Rukun Tetangga"
            title="Pengurus 4 RT Dusun Cilikan"
            className="mb-4"
          />
          <p className="mb-10 max-w-xl text-sm text-ink-500">
            Dusun Cilikan terdiri dari 4 Rukun Tetangga (RT). Klik tab untuk melihat detail masing-masing RT.
          </p>
          <RTTabs officials={rtOfficials} />
        </Container>
      </section>

      {/* Bagan Organisasi now lives on its own data-driven page */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-paper p-8 text-center shadow-sm">
            <SectionHeading
              eyebrow="Struktur Organisasi"
              title="Bagan Organisasi Dusun"
              className="mb-4"
              align="center"
            />
            <p className="text-sm leading-relaxed text-ink-500">
              Susunan lengkap pengurus dusun, dari kepala dusun hingga ketua RT, tersedia pada halaman struktur
              organisasi.
            </p>
            <Link
              href="/profil/struktur"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Lihat struktur organisasi
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
