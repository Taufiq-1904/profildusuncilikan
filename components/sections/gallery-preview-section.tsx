import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "./section-heading";
import { GalleryGrid } from "./gallery-grid";
import { galleryItems } from "@/lib/data/galleryData";

export function GalleryPreviewSection() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Galeri Dusun"
            title="Momen dan Suasana Dusun Cilikan"
            description="Dokumentasi kegiatan masyarakat, pemerintahan, dan keindahan alam dusun."
          />
          <Link
            href="/galeri"
            className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex"
          >
            Lihat Galeri Lengkap
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
          <GalleryGrid items={galleryItems.slice(0, 8)} />
        </div>

        <Link
          href="/galeri"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 sm:hidden"
        >
          Lihat Galeri Lengkap
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Container>
    </section>
  );
}
