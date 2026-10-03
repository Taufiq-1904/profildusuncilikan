import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.villageName} — Website Resmi`,
    short_name: siteConfig.villageName,
    description: siteConfig.shortDescription,
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
