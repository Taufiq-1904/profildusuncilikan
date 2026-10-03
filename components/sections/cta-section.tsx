import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { HeroLandscape } from "./hero-landscape";

export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 py-20 sm:py-24">
      <div className="absolute inset-0 opacity-40">
        <HeroLandscape />
      </div>
      <div className="absolute inset-0 bg-brand-950/60" />
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-xl text-balance font-display text-3xl font-semibold text-white sm:text-4xl">
          Kenali Dusun Cilikan Lebih Dekat
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-brand-100/80 sm:text-base">
          Jelajahi sejarah, pemerintahan, dan potensi yang membuat Cilikan terus tumbuh.
        </p>
        <Link
          href="/profil"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-gold-500 px-8 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-600"
        >
          Lihat Profil Dusun
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Container>
    </section>
  );
}
