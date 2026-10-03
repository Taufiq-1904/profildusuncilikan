import Link from "next/link";
import { MapPin, Phone, Mail, AtSign, Users2, PlaySquare } from "lucide-react";
import { Container } from "./container";
import { VillageMark } from "./village-mark";
import { getFlatNavigation, siteConfig } from "@/lib/data/siteConfig";
import { googleMapsUrl, safeExternalUrl } from "@/lib/links";

export function Footer() {
  const year = new Date().getFullYear();

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
              {siteConfig.shortDescription}
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: AtSign, label: "Instagram", href: safeExternalUrl(siteConfig.social.instagram.url) },
                { icon: Users2, label: "Facebook", href: safeExternalUrl(siteConfig.social.facebook.url) },
                { icon: PlaySquare, label: "YouTube", href: safeExternalUrl(siteConfig.social.youtube.url) },
              ]
                .filter((x) => x.href)
                .map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-700 text-brand-100 transition-colors hover:border-gold-400 hover:text-gold-400"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
            </div>
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
              <li className="flex gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-gold-400" />
                <a href={googleMapsUrl(siteConfig.coordinates)} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">
                  {siteConfig.address}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-gold-400" />
                <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`} className="hover:text-gold-400">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="h-4 w-4 shrink-0 mt-0.5 text-gold-400" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-gold-400">
                  {siteConfig.email}
                </a>
              </li>
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
