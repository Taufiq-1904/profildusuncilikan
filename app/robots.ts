import { SITE_URL } from "@/lib/site-url";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The dashboard has its own client-side login guard, but it still has
      // no reason to show up in search results.
      disallow: ["/dashboard", "/login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
