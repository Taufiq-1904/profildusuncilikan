"use client";

import { MapPin, Phone, Mail, Clock, AtSign, Users2, PlaySquare, MessageCircle, Building2 } from "lucide-react";
import type { ElementType } from "react";
import { Container } from "@/components/layout/container";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { Card } from "@/components/ui/card";
import { buildContact } from "@/lib/siteContact";

const socialIcons = { instagram: AtSign, facebook: Users2, youtube: PlaySquare } as const;

type ContactCard = {
  icon: ElementType;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

// Kartu kontak halaman /kontak. Kartu yang datanya belum diisi Dukuh tidak
// ditampilkan, jadi tidak pernah ada kartu kosong atau tombol mati.
export function ContactContent() {
  const { settings } = useSiteSettings();
  const contact = buildContact(settings);

  const cards: ContactCard[] = [
    { icon: MapPin, label: "Alamat Dusun", value: settings.address, href: contact.mapsHref, external: true },
    { icon: Phone, label: "Telepon", value: settings.phone, href: contact.phoneHref },
    { icon: MessageCircle, label: "WhatsApp", value: settings.whatsapp, href: contact.whatsappHref, external: true },
    { icon: Mail, label: "Email", value: settings.email, href: contact.emailHref },
    { icon: Clock, label: "Jam Pelayanan", value: settings.serviceHours },
    {
      icon: Building2,
      label: "Kantor Kalurahan",
      value: [settings.kalurahanAddress, settings.kalurahanPhone && `Telp. ${settings.kalurahanPhone}`]
        .filter(Boolean)
        .join(" · "),
      href: contact.kalurahanPhoneHref,
    },
  ].filter((c) => c.value);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        {cards.length === 0 ? (
          <p className="text-sm text-ink-500">Informasi kontak belum tersedia.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ icon: Icon, label, value, href, external }) => {
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
        )}

        {contact.socials.length > 0 && (
          <Card className="mt-8 p-6">
            <h2 className="font-display text-base font-semibold text-ink-900">Media Sosial</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              {contact.socials.map(({ key, label, handle, href }) => {
                const Icon = socialIcons[key];
                return (
                  <a
                    key={key}
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
                );
              })}
            </div>
          </Card>
        )}
      </Container>
    </section>
  );
}
