import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HideOnDashboard } from "@/components/layout/hide-on-dashboard";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SiteSettingsProvider } from "@/components/providers/site-settings-provider";
import { siteConfig } from "@/lib/data/siteConfig";
import type { SiteSettings } from "@/lib/data/siteSettingsData";
import { getSiteSettings } from "@/lib/server/site-settings";
import { SITE_URL } from "@/lib/site-url";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

// Note: next/font/google requires network access to fonts.googleapis.com at
// build time. If that's available in your deployment (e.g. on Vercel), you
// can swap these for `Fraunces` / `Plus_Jakarta_Sans` from "next/font/google"
// for optimized, self-hosted font loading. Here we fall back to curated
// system stacks so the project builds anywhere without network access.
const fontVars = "font-vars";

// Telepon dan email hanya dimasukkan bila Dukuh sudah mengisinya, supaya mesin
// pencari tidak membaca nomor contoh.
function buildVillageSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: siteConfig.villageName,
    url: SITE_URL,
    description: settings.shortDescription,
    ...(settings.phone && { telephone: settings.phone }),
    ...(settings.email && { email: settings.email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressRegion: siteConfig.province,
      addressCountry: "ID",
    },
    ...(Number.isFinite(settings.lat) &&
      Number.isFinite(settings.lng) && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: settings.lat,
          longitude: settings.lng,
        },
      }),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${siteConfig.villageName} — Website Resmi`,
      template: `%s — ${siteConfig.villageName}`,
    },
    description: settings.shortDescription,
    keywords: ["Dusun Cilikan", "Umbulmartani", "Ngemplak", "Sleman", "website dusun", "profil dusun"],
    openGraph: {
      title: `${siteConfig.villageName} — Website Resmi`,
      description: settings.shortDescription,
      siteName: siteConfig.villageName,
      locale: "id_ID",
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Konten situs dibaca di server sekali, lalu dipakai sebagai isi awal seluruh
  // halaman (SiteSettingsProvider) dan untuk JSON-LD.
  const initial = await getSiteSettings();

  return (
    <html lang="id" className={fontVars}>
      <body className="flex min-h-screen flex-col antialiased">
        <JsonLd data={buildVillageSchema(initial.settings)} />
        <SiteSettingsProvider initial={initial}>
          <AuthProvider>
            <a
              href="#konten-utama"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
            >
              Lompat ke konten utama
            </a>
            <HideOnDashboard>
              <Navbar />
            </HideOnDashboard>
            <main id="konten-utama" className="flex-1">
              {children}
            </main>
            <HideOnDashboard>
              <Footer />
            </HideOnDashboard>
          </AuthProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
