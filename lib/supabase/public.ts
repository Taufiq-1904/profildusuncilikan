import { createClient } from "@supabase/supabase-js";

// Klien tanpa cookie/sesi untuk membaca konten PUBLIK dari Server Component
// (metadata SEO, sitemap, JSON-LD). Hanya melihat apa yang boleh dilihat
// pengunjung biasa: RLS tetap berlaku (berita published, UMKM aktif, dst).
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
