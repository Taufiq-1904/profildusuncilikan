import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, AtSign, Users2, PlaySquare, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/sections/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { MapSection } from "@/components/sections/map-section";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/data/siteConfig";
import { googleMapsUrl, safeExternalUrl, whatsappUrl } from "@/lib/links";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Informasi kontak dan lokasi kantor ${siteConfig.villageName}.`,
};

const contactCards = [
  { icon: MapPin, label: "Alamat Dusun", value: siteConfig.address, href: googleMapsUrl(siteConfig.coordinates), external: true },
  { icon: Phone, label: "Telepon", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`, external: false },
  { icon: MessageCircle, label: "WhatsApp", value: siteConfig.whatsapp, href: whatsappUrl(siteConfig.whatsapp), external: true },
  { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, external: false },
  { icon: Clock, label: "Jam Pelayanan", value: siteConfig.serviceHours, href: undefined, external: false },
];

const socials = [
  { icon: AtSign, label: "Instagram", ...siteConfig.social.instagram },
  { icon: Users2, label: "Facebook", ...siteConfig.social.facebook },
  { icon: PlaySquare, label: "YouTube", ...siteConfig.social.youtube },
]
  .map((x) => ({ ...x, href: safeExternalUrl(x.url) }))
  .filter((x) => x.href);

export default function KontakPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title="Hubungi Kami"
        description="Kami siap membantu dan mendengar masukan dari seluruh warga dan masyarakat."
      />
      <Breadcrumb items={[{ label: "Kontak" }]} />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {contactCards.map(({ icon: Icon, label, value, href, external }) => {
              const inner = (
                <Card className={`h-full p-5 ${href ? "transition-shadow hover:shadow-md" : ""}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
                  <p className="mt-1.5 break-words text-sm font-medium leading-relaxed text-ink-900">{value}</p>
                </Card>
              );
              return href ? (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                  {inner}
                </a>
              ) : (
                <div key={label}>{inner}</div>
              );
            })}
          </div>

          {socials.length > 0 && (
            <Card className="mt-8 p-6">
              <h2 className="font-display text-base font-semibold text-ink-900">Media Sosial</h2>
              <div className="mt-4 flex flex-wrap gap-4">
                {socials.map(({ icon: Icon, label, handle, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-full border border-line px-4 py-2 transition-colors hover:bg-brand-50"
                  >
                    <Icon className="h-4 w-4 text-brand-700" />
                    <span className="text-sm text-ink-700">
                      <span className="font-semibold">{label}</span>
                      {handle ? `: ${handle}` : ""}
                    </span>
                  </a>
                ))}
              </div>
            </Card>
          )}
        </Container>
      </section>

      <MapSection />
    </>
  );
}
