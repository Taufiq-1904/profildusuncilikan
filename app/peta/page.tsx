import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { MapExplorer } from "@/components/map/map-explorer";
import { PageHeader } from "@/components/sections/page-header";
import { siteConfig } from "@/lib/data/siteConfig";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Peta Dusun",
  description: `Peta lokasi penting di ${siteConfig.villageName}: balai warga, tempat ibadah, fasilitas umum, UMKM, dan organisasi.`,
  path: "/peta",
});

export default function PetaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Peta Dusun"
        title={`Peta ${siteConfig.villageName}`}
        description="Temukan fasilitas umum, tempat ibadah, UMKM, dan organisasi warga, lalu buka petunjuk arahnya di Google Maps."
      />
      <Breadcrumb items={[{ label: "Peta Dusun" }]} />
      <section className="py-12 sm:py-16">
        <Container>
          <MapExplorer />
        </Container>
      </section>
    </>
  );
}
