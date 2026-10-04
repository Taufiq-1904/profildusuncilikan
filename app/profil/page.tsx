import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProfileContent } from "@/components/sections/profile-content";
import { DemografiSection, WilayahSection } from "@/components/sections/kependudukan";
import { siteConfig } from "@/lib/data/siteConfig";

export const metadata: Metadata = {
  title: "Profil Dusun",
  description: `Sejarah, visi misi, kondisi geografis, dan demografi ${siteConfig.villageName}.`,
};

export default function ProfilPage() {
  return (
    <>
      <PageHeader
        eyebrow="Profil Dusun"
        title="Mengenal Dusun Cilikan"
        description="Sejarah, arah pembangunan, dan data wilayah Dusun Cilikan, Umbulmartani, Sleman."
      />
      <Breadcrumb items={[{ label: "Profil Dusun" }]} />

      {/* Sejarah, visi misi, dan kondisi geografis: dikelola Dukuh di dashboard. */}
      <ProfileContent />

      <DemografiSection />
      <WilayahSection />
    </>
  );
}
