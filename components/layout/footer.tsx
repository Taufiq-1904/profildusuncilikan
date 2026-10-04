"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, AtSign, Users2, PlaySquare, MessageCircle } from "lucide-react";
import { Container } from "./container";
import { VillageMark } from "./village-mark";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { getFlatNavigation, siteConfig } from "@/lib/data/siteConfig";
import { buildContact, type SocialKey } from "@/lib/siteContact";

const socialIcons = { instagram: AtSign, facebook: Users2, youtube: PlaySquare } as const;

export function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const contact = buildContact(settings);

  return (
    <footer className="bg-brand-950 text-brand-100">
      <Container className="py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <VillageMark />
              <span className="font-display text-lg font-semibold text-white">
                {siteConfig.villageName}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-100/75">
              {settings.shortDescription}
            </p>
            {contact.socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {contact.socials.map(({ key, label, href }) => {
                  const Icon = socialIcons[key as SocialKey];
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-700 text-brand-100 transition-colors hover:border-gold-400 hover:text-gold-400"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Tautan Cepat
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[...getFlatNavigation(), { label: "Kontak", href: "/kontak" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-brand-100/75 hover:text-gold-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Layanan
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-100/75">
              {[
                { label: "Surat Menyurat", href: "/kontak" },
                { label: "Layanan Kependudukan", href: "/kontak" },
                { label: "Pengaduan Masyarakat", href: "/kontak" },
                { label: "Informasi Publik", href: "/berita" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-gold-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Kontak
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-brand-100/75">
              {settings.address && (
                <li className="flex gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  {contact.mapsHref ? (
                    <a href={contact.mapsHref} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">
                      {settings.address}
                    </a>
                  ) : (
                    <span>{settings.address}</span>
                  )}
                </li>
              )}
              {settings.phone && contact.phoneHref && (
                <li className="flex gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <a href={contact.phoneHref} className="hover:text-gold-400">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.whatsapp && contact.whatsappHref && (
                <li className="flex gap-2.5">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">
                    {settings.whatsapp}
                  </a>
                </li>
              )}
              {settings.email && contact.emailHref && (
                <li className="flex gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  <a href={contact.emailHref} className="break-all hover:text-gold-400">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-brand-800 pt-6 text-xs text-brand-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Pemerintah {siteConfig.villageName}, {siteConfig.regency}. Seluruh hak cipta dilindungi.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Dikembangkan untuk pelayanan publik yang lebih terbuka.</span>
            <Link href="/login" className="font-medium text-brand-100/80 underline-offset-4 hover:text-gold-400 hover:underline">
              Masuk Pengelola
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
