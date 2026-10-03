export type NewsStatus = "draft" | "published";

export type NewsCategory = {
  id: string;
  name: string;
};

export const newsCategories: NewsCategory[] = [
  { id: "pemerintahan", name: "Pemerintahan" },
  { id: "pembangunan", name: "Pembangunan" },
  { id: "kegiatan-warga", name: "Kegiatan Warga" },
  { id: "ekonomi", name: "Ekonomi" },
  { id: "pengumuman", name: "Pengumuman" },
];

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  // One string per paragraph.
  content: string[];
  // Public URL in Supabase Storage (bucket "media").
  coverImage?: string;
  categoryId: string;
  status: NewsStatus;
  // Calendar date (YYYY-MM-DD) shown as the publication date.
  publishedAt: string;
  authorUsername: string;
  authorName: string;
  // Publisher scope: "dusun", an RW id, or an RT id (see wilayahData).
  wilayahId: string;
  createdAt: string;
  updatedAt: string;
};

export function getCategoryName(categoryId: string): string {
  return newsCategories.find((c) => c.id === categoryId)?.name ?? "Lainnya";
}
