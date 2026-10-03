// Alamat publik situs. Di Vercel isi NEXT_PUBLIC_SITE_URL dengan domain final
// (mis. https://dusuncilikan.web.id). Selama domain belum aktif, default-nya
// tetap domain tujuan supaya sitemap dan metadata sudah benar saat go-live.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dusuncilikan.web.id").replace(/\/+$/, "");
