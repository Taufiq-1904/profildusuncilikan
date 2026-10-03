import { createPublicClient } from "@/lib/supabase/public";
import { rowToNews, rowToOrganization, rowToUmkm } from "@/lib/db/mappers";
import type { NewsArticle } from "@/lib/data/newsData";
import type { Organization } from "@/lib/data/organizationData";
import type { UMKM } from "@/lib/data/umkmData";

// Pembacaan konten PUBLIK di server (metadata SEO, JSON-LD, sitemap).
// Memakai klien tanpa sesi, jadi hasilnya persis apa yang boleh dilihat
// pengunjung. Bila Supabase belum dikonfigurasi atau sedang bermasalah,
// halaman tetap tampil (hanya tanpa metadata spesifik) dan tidak error.

export async function getPublishedNews(): Promise<NewsArticle[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("Gagal memuat berita (server):", error);
    return [];
  }
  return (data ?? []).map(rowToNews);
}

export async function getPublishedNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
  const supabase = createPublicClient();
  if (!supabase) return undefined;
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    console.error("Gagal memuat berita (server):", error);
    return undefined;
  }
  return data ? rowToNews(data) : undefined;
}

export async function getActiveUmkm(): Promise<UMKM[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("umkm").select("*").eq("aktif", true);
  if (error) {
    console.error("Gagal memuat UMKM (server):", error);
    return [];
  }
  return (data ?? []).map(rowToUmkm);
}

export async function getActiveUmkmBySlug(slug: string): Promise<UMKM | undefined> {
  const supabase = createPublicClient();
  if (!supabase) return undefined;
  const { data, error } = await supabase
    .from("umkm")
    .select("*")
    .eq("slug", slug)
    .eq("aktif", true)
    .maybeSingle();
  if (error) {
    console.error("Gagal memuat UMKM (server):", error);
    return undefined;
  }
  return data ? rowToUmkm(data) : undefined;
}

export async function getAllOrganizations(): Promise<Organization[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("organizations").select("*");
  if (error) {
    console.error("Gagal memuat organisasi (server):", error);
    return [];
  }
  return (data ?? []).map(rowToOrganization);
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | undefined> {
  const supabase = createPublicClient();
  if (!supabase) return undefined;
  const { data, error } = await supabase.from("organizations").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("Gagal memuat organisasi (server):", error);
    return undefined;
  }
  return data ? rowToOrganization(data) : undefined;
}
