import { SITE_URL } from "@/lib/site-url";
import type { MetadataRoute } from "next";
import { potentials } from "@/lib/data/potentialsData";
import { seedNews } from "@/lib/data/newsData";
import { organizationSeed } from "@/lib/data/organizationData";
import { umkmSeed } from "@/lib/data/umkmData";

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/profil",
    "/profil/struktur",
    "/pemerintahan",
    "/potensi",
    "/umkm",
    "/organisasi",
    "/berita",
    "/peta",
    "/galeri",
    "/kontak",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const potensiRoutes = potentials.map((p) => ({
    url: `${baseUrl}/potensi/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Only the sample articles can be listed here; posts saved from the
  // dashboard live in the browser until there is a database to query.
  const beritaRoutes = seedNews
    .filter((a) => a.status === "published")
    .map((a) => ({
      url: `${baseUrl}/berita/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }));

  // Same limitation as news: only seed records are known at build time.
  const organisasiRoutes = organizationSeed.map((o) => ({
    url: `${baseUrl}/organisasi/${o.slug}`,
    lastModified: new Date(o.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const umkmRoutes = umkmSeed
    .filter((u) => u.aktif)
    .map((u) => ({
      url: `${baseUrl}/umkm/${u.slug}`,
      lastModified: new Date(u.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...potensiRoutes, ...organisasiRoutes, ...umkmRoutes, ...beritaRoutes];
}
