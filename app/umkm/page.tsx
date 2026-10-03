import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/sections/page-header";
import { UmkmDirectory } from "@/components/sections/umkm-directory";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "UMKM Dusun",
  description:
    "Direktori usaha warga: kuliner, kerajinan, perdagangan, peternakan, dan jasa, lengkap dengan lokasi dan kontak.",
  path: "/umkm",
});

export default function UmkmPage() {
  return (
    <>
      <PageHeader
        eyebrow="Potensi Dusun"
        title="UMKM Dusun"
        description="Kenali usaha warga di sekitar Anda. Temukan lokasi, jam buka, dan kontaknya."
      />
      <Breadcrumb items={[{ label: "UMKM" }]} />
      <section className="py-16 sm:py-20">
        <Container>
          <UmkmDirectory />
        </Container>
      </section>
    </>
  );
}
