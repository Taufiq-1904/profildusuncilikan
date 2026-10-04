import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data/siteConfig";
import { getSiteSettings } from "@/lib/server/site-settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { settings } = await getSiteSettings();
  return {
    name: `${siteConfig.villageName} — Website Resmi`,
    short_name: siteConfig.villageName,
    description: settings.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#0e4f5c",
    lang: "id",
    icons: [
      // favicon.ico already covers the basic case; add PNG icons here once
      // they exist (e.g. /icon-192.png, /icon-512.png) for a full PWA install prompt.
    ],
  };
}
