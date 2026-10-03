import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { MapExplorer } from "@/components/map/map-explorer";
import { siteConfig } from "@/lib/data/siteConfig";

// Homepage map. The heading is server-rendered; the map itself is lazy and
// only starts downloading shortly before this section scrolls into view.
export function MapPreviewSection() {
  return (
    <section className="py-16 sm:py-24" aria-label="Peta lokasi dusun">
      <Container>
        <SectionHeading
          eyebrow="Peta Dusun"
          title={`Lokasi Penting di ${siteConfig.villageName}`}
          description="Balai warga, tempat ibadah, UMKM, dan organisasi. Klik penanda untuk detail dan petunjuk arah."
          className="mb-8"
        />
        <MapExplorer compact />
      </Container>
    </section>
  );
}
