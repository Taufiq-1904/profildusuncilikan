import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ContactContent } from "@/components/sections/contact-content";
import { MapSection } from "@/components/sections/map-section";
import { siteConfig } from "@/lib/data/siteConfig";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Informasi kontak dan lokasi kantor ${siteConfig.villageName}.`,
};

export default function KontakPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title="Hubungi Kami"
        description="Kami siap membantu dan mendengar masukan dari seluruh warga dan masyarakat."
      />
      <Breadcrumb items={[{ label: "Kontak" }]} />

      {/* Alamat, telepon, WhatsApp, email, jam pelayanan, dan media sosial dikelola Dukuh di dashboard. */}
      <ContactContent />

      <MapSection />
    </>
  );
}
