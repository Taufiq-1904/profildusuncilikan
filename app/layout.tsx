import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HideOnDashboard } from "@/components/layout/hide-on-dashboard";
import { AuthProvider } from "@/components/providers/auth-provider";
import { siteConfig } from "@/lib/data/siteConfig";
import { SITE_URL } from "@/lib/site-url";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

// Note: next/font/google requires network access to fonts.googleapis.com at
// build time. If that's available in your deployment (e.g. on Vercel), you
// can swap these for `Fraunces` / `Plus_Jakarta_Sans` from "next/font/google"
// for optimized, self-hosted font loading. Here we fall back to curated
// system stacks so the project builds anywhere without network access.
const fontVars = "font-vars";

const villageSchema = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  name: siteConfig.villageName,
  url: SITE_URL,
  description: siteConfig.shortDescription,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address,
    addressRegion: siteConfig.province,
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.coordinates.lat,
    longitude: siteConfig.coordinates.lng,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.villageName} — Website Resmi`,
    template: `%s — ${siteConfig.villageName}`,
  },
  description: siteConfig.shortDescription,
  keywords: ["Dusun Cilikan", "Umbulmartani", "Ngemplak", "Sleman", "website dusun", "profil dusun"],
  openGraph: {
    title: `${siteConfig.villageName} — Website Resmi`,
    description: siteConfig.shortDescription,
    siteName: siteConfig.villageName,
    locale: "id_ID",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={fontVars}>
      <body className="flex min-h-screen flex-col antialiased">
        <JsonLd data={villageSchema} />
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
      </body>
    </html>
  );
}
