import { SITE_URL } from "@/lib/site-url";
import type { MetadataRoute } from "next";
import { potentials } from "@/lib/data/potentialsData";
import { getActiveUmkm, getAllOrganizations, getPublishedNews } from "@/lib/server/public-content";

const baseUrl = SITE_URL;

// Daftar berita/UMKM/organisasi dibaca dari Supabase; dihitung ulang tiap jam.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, organizations, umkm] = await Promise.all([
    getPublishedNews(),
    getAllOrganizations(),
    getActiveUmkm(),
  ]);

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

  const beritaRoutes = news.map((a) => ({
    url: `${baseUrl}/berita/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const organisasiRoutes = organizations.map((o) => ({
    url: `${baseUrl}/organisasi/${o.slug}`,
    lastModified: new Date(o.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const umkmRoutes = umkm.map((u) => ({
    url: `${baseUrl}/umkm/${u.slug}`,
    lastModified: new Date(u.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...potensiRoutes, ...organisasiRoutes, ...umkmRoutes, ...beritaRoutes];
}
