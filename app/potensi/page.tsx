import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { PotensiDirectory } from "@/components/sections/potensi-directory";
import { siteConfig } from "@/lib/data/siteConfig";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Potensi Dusun",
  description: `Potensi pertanian, peternakan, kerajinan, pariwisata, dan perdagangan ${siteConfig.villageName}.`,
  path: "/potensi",
});

export default function PotensiPage() {
  return (
    <>
      <PageHeader
        eyebrow="Potensi Dusun"
        title="Kekayaan dan Peluang Cilikan"
        description="Pertanian, peternakan, kerajinan, pariwisata, hingga perdagangan yang menjadi kekuatan ekonomi dusun."
      />
      <Breadcrumb items={[{ label: "Potensi Dusun" }]} />

      <section className="py-20 sm:py-24">
        <Container>
          <PotensiDirectory />
        </Container>
      </section>
    </>
  );
}
