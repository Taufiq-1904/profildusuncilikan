import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { GalleryExplorer } from "@/components/sections/gallery-explorer";
import { galleryItems } from "@/lib/data/galleryData";
import { siteConfig } from "@/lib/data/siteConfig";

export const metadata: Metadata = {
  title: "Galeri Dusun",
  description: `Dokumentasi kegiatan dan potensi ${siteConfig.villageName}.`,
};

export default function GaleriPage() {
  return (
    <>
      <PageHeader
        eyebrow="Galeri Dusun"
        title="Dokumentasi Cilikan"
        description="Kumpulan momen kegiatan masyarakat, pemerintahan, infrastruktur, dan potensi dusun."
      />
      <Breadcrumb items={[{ label: "Galeri" }]} />

      <section className="py-16 sm:py-20">
        <Container>
          <GalleryExplorer items={galleryItems} />
        </Container>
      </section>
    </>
  );
}
