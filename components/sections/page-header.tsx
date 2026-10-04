"use client";

import { Container } from "@/components/layout/container";
import { useHeroImage } from "@/components/providers/site-settings-provider";
import { HeroLandscape } from "./hero-landscape";

// Header semua halaman memakai foto latar yang sama dengan hero beranda.
// Lapisan gelap dibuat lebih pekat daripada di beranda supaya judul putih
// tetap kontras di atas foto yang terang. Ilustrasi lanskap tetap ada di
// bawah foto sebagai cadangan bila gambar gagal dimuat.
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const background = useHeroImage();

  return (
    <section className="relative isolate overflow-hidden bg-brand-950 py-24 pt-40 sm:pt-44">
      <div className="absolute inset-0 opacity-70">
        <HeroLandscape />
      </div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${background}")` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-brand-950/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/30" />
      <Container className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl font-semibold text-white sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-100/90">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
