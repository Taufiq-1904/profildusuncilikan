import type { Metadata } from "next";
import { siteConfig } from "./data/siteConfig";

// One place that builds page metadata, so titles, descriptions and Open Graph
// tags stay in step. Note that Next replaces (not merges) the whole
// `openGraph` object from the layout, hence siteName/locale are repeated.
export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  // A data URL is skipped (Open Graph needs a fetchable image URL); pages
  // whose only picture is one uploaded from the dashboard fall back to the
  // site default rather than sending a broken preview image.
  image?: string;
}): Metadata {
  const fullTitle = `${title} — ${siteConfig.villageName}`;
  const ogImage = image?.startsWith("http") ? [{ url: image }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: siteConfig.villageName,
      locale: "id_ID",
      type: "website",
      ...(ogImage && { images: ogImage }),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      ...(ogImage && { images: ogImage }),
    },
  };
}
