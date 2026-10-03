import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { DusunOrgChart } from "@/components/sections/dusun-org-chart";
import { PageHeader } from "@/components/sections/page-header";
import { RoleManageBar } from "@/components/ui/manage-bar";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Struktur Organisasi",
  description: "Bagan kepengurusan Dusun Cilikan: pengurus dusun, tiap RW, dan tiap RT.",
  path: "/profil/struktur",
});

export default function StrukturOrganisasiPage() {
  return (
    <>
      <PageHeader
        eyebrow="Profil"
        title="Struktur Organisasi Dusun"
        description="Susunan pengurus yang melayani warga, dari kepala dusun hingga ketua RT."
      />
      <Breadcrumb items={[{ label: "Profil", href: "/profil" }, { label: "Struktur Organisasi" }]} />
      <RoleManageBar roles={["dusun", "rw", "rt"]} href="/dashboard/struktur" label="Edit struktur" />

      <section className="py-16 sm:py-20" aria-label="Bagan struktur organisasi">
        <Container>
          <DusunOrgChart />
          <p className="mt-14 text-center">
            <Link
              href="/pemerintahan"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Lihat data RW & RT
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
