import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { OrganizationDirectory } from "@/components/sections/organization-directory";
import { PageHeader } from "@/components/sections/page-header";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Organisasi & Komunitas",
  description:
    "Kelompok, organisasi, dan komunitas warga yang aktif di dusun: kepemudaan, pengelolaan sampah, sosial kemasyarakatan, dan lainnya.",
  path: "/organisasi",
});

export default function OrganisasiPage() {
  return (
    <>
      <PageHeader
        eyebrow="Potensi Dusun"
        title="Organisasi & Komunitas"
        description="Kelompok dan komunitas warga yang menggerakkan kegiatan di dusun, dari tingkat RT hingga dusun."
      />
      <Breadcrumb items={[{ label: "Organisasi & Komunitas" }]} />
      <section className="py-16 sm:py-20">
        <Container>
          <OrganizationDirectory />
        </Container>
      </section>
    </>
  );
}
