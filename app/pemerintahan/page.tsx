import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { KepalaDusunSection } from "@/components/sections/kepala-dusun-section";
import { RTTabs } from "@/components/sections/rt-tabs";
import { siteConfig } from "@/lib/data/siteConfig";

export const metadata: Metadata = {
  title: "Pemerintahan",
  description: `Struktur pemerintahan, perangkat, dan data RT ${siteConfig.villageName}.`,
};

export default function PemerintahanPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pemerintahan"
        title="Struktur Pemerintahan Dusun"
        description="Mengenal perangkat dan pengurus Dusun Cilikan yang melayani masyarakat."
      />
      <Breadcrumb items={[{ label: "Pemerintahan" }]} />

      <KepalaDusunSection />

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
          <RTTabs />
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
