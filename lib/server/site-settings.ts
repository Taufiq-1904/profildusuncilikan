import { createClient } from "@supabase/supabase-js";
import { defaultSiteSettingsResult, type SiteSettingsResult } from "@/lib/data/siteSettingsData";
import { rowToSiteSettings } from "@/lib/db/mappers";

// Tag cache yang dibersihkan /api/revalidate-site setelah Dukuh menyimpan.
export const SITE_SETTINGS_TAG = "site-settings";

// Dibaca di server untuk hal yang harus ada di HTML pertama: isi awal seluruh
// situs (lewat SiteSettingsProvider), metadata SEO, JSON-LD, dan manifest.
// Memakai klien tanpa sesi, jadi hanya melihat yang boleh dilihat pengunjung
// (RLS: site_settings dapat dibaca siapa saja). Hasilnya di-cache 5 menit dan
// dibersihkan seketika oleh /api/revalidate-site; browser tetap memuat versi
// terbaru sendiri begitu halaman terbuka.
//
// Bila Supabase belum dikonfigurasi, tabelnya belum dibuat, atau sedang error,
// situs tetap tampil dengan isi bawaan dan tidak error.
export async function getSiteSettings(): Promise<SiteSettingsResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return defaultSiteSettingsResult;

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, next: { revalidate: 300, tags: [SITE_SETTINGS_TAG] } }),
      },
    });
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", "main").maybeSingle();
    if (error) {
      console.error("Gagal memuat pengaturan situs (server):", error);
      return defaultSiteSettingsResult;
    }
    return rowToSiteSettings(data);
  } catch (e) {
    console.error("Gagal memuat pengaturan situs (server):", e);
    return defaultSiteSettingsResult;
  }
}
