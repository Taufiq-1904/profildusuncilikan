import { getSession, canManageWilayah, type SessionUser } from "./auth";
import { type NewsArticle, type NewsStatus } from "./data/newsData";
import { rowToNews } from "./db/mappers";
import { toUserError } from "./db/errors";
import { saveWithUniqueSlug } from "./db/slug";
import { droppedMedia, removeMedia } from "./image-upload";
import { createRemoteStore } from "./remoteStore";
import { getSupabase } from "./supabase/client";
import { slugify } from "./utils";

// Semua data berita disimpan di tabel `news` di Supabase. Setiap mutasi di
// bawah ini tetap memeriksa sesi dan kebijakan akses sendiri agar pesan
// errornya jelas; yang benar-benar mengikat adalah Row Level Security.

export class NewsAccessError extends Error {
  constructor(message = "Anda tidak memiliki akses untuk tindakan ini.") {
    super(message);
    this.name = "NewsAccessError";
  }
}

export type NewsInput = Pick<
  NewsArticle,
  | "title"
  | "slug"
  | "excerpt"
  | "content"
  | "coverImage"
  | "categoryId"
  | "status"
  | "publishedAt"
  | "wilayahId"
>;

// --- store -----------------------------------------------------------------

async function loadNews(): Promise<NewsArticle[]> {
  const { data, error } = await getSupabase()
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw toUserError(error, "Berita gagal dimuat.");
  return (data ?? []).map(rowToNews);
}

export const newsStore = createRemoteStore<NewsArticle>({ load: loadNews });

// --- policy ----------------------------------------------------------------

export function canManageArticle(session: SessionUser | null, article: NewsArticle): boolean {
  return canManageWilayah(session, article.wilayahId);
}

function requireSession(): SessionUser {
  const session = getSession();
  if (!session) throw new NewsAccessError("Sesi login tidak ditemukan. Silakan masuk kembali.");
  return session;
}

// --- selectors (pure, take the list so hooks can reuse them) ---------------

function byNewest(a: NewsArticle, b: NewsArticle): number {
  if (a.publishedAt !== b.publishedAt) return a.publishedAt < b.publishedAt ? 1 : -1;
  return a.createdAt < b.createdAt ? 1 : -1;
}

export function selectPublished(all: NewsArticle[]): NewsArticle[] {
  return all.filter((a) => a.status === "published").sort(byNewest);
}

export function selectManageable(all: NewsArticle[], session: SessionUser | null): NewsArticle[] {
  return all.filter((a) => canManageArticle(session, a)).sort(byNewest);
}

export function findBySlug(all: NewsArticle[], slug: string): NewsArticle | undefined {
  return all.find((a) => a.slug === slug);
}

export function findById(all: NewsArticle[], id: string): NewsArticle | undefined {
  return all.find((a) => a.id === id);
}

// --- slugs -----------------------------------------------------------------

export { slugify };

function guessSlug(base: string, all: NewsArticle[], excludeId?: string): { guess: string; root: string } {
  const root = slugify(base) || "berita";
  const taken = new Set(all.filter((a) => a.id !== excludeId).map((a) => a.slug));
  let guess = root;
  for (let n = 2; taken.has(guess); n += 1) guess = `${root}-${n}`;
  return { guess, root };
}

// --- mutations -------------------------------------------------------------

function validate(input: NewsInput): void {
  if (!input.title.trim()) throw new Error("Judul berita wajib diisi.");
  if (!input.excerpt.trim()) throw new Error("Ringkasan berita wajib diisi.");
  if (input.content.filter((p) => p.trim()).length === 0) throw new Error("Isi berita wajib diisi.");
  if (!input.publishedAt) throw new Error("Tanggal publikasi wajib diisi.");
}

function toRow(input: NewsInput, slug: string) {
  return {
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    content: input.content.map((p) => p.trim()).filter(Boolean),
    cover_image: input.coverImage ?? null,
    category_id: input.categoryId,
    status: input.status,
    published_at: input.publishedAt,
    wilayah_id: input.wilayahId,
  };
}

export async function createNews(input: NewsInput): Promise<NewsArticle> {
  const session = requireSession();
  if (!canManageWilayah(session, input.wilayahId)) throw new NewsAccessError();
  validate(input);

  const supabase = getSupabase();
  const { guess, root } = guessSlug(input.slug || input.title, newsStore.getState().items);
  const { data, error } = await saveWithUniqueSlug(guess, root, (slug) =>
    supabase
      .from("news")
      .insert({
        ...toRow(input, slug),
        author_id: session.userId,
        author_username: session.username,
        author_name: session.displayName,
      })
      .select("*")
      .single()
  );
  if (error || !data) throw toUserError(error ?? { message: "no data" }, "Berita gagal disimpan.");

  await newsStore.refresh();
  return rowToNews(data);
}

export async function updateNews(id: string, input: NewsInput): Promise<NewsArticle> {
  const session = requireSession();
  const all = newsStore.getState().items;
  const existing = findById(all, id);
  if (!existing) throw new Error("Berita tidak ditemukan.");
  // Both ends are checked: the account must own the current article and the
  // wilayah it is being moved to.
  if (!canManageArticle(session, existing) || !canManageWilayah(session, input.wilayahId)) {
    throw new NewsAccessError();
  }
  validate(input);

  const supabase = getSupabase();
  const { guess, root } = guessSlug(input.slug || input.title, all, id);
  const { data, error } = await saveWithUniqueSlug(guess, root, (slug) =>
    supabase.from("news").update(toRow(input, slug)).eq("id", id).select("*").maybeSingle()
  );
  if (error) throw toUserError(error, "Berita gagal disimpan.");
  // RLS menolak update tanpa error: barisnya saja yang tidak ikut terkena.
  if (!data) throw new NewsAccessError();

  await removeMedia(droppedMedia([existing.coverImage], [input.coverImage]));
  await newsStore.refresh();
  return rowToNews(data);
}

export async function setNewsStatus(id: string, status: NewsStatus): Promise<NewsArticle> {
  const session = requireSession();
  const existing = findById(newsStore.getState().items, id);
  if (!existing) throw new Error("Berita tidak ditemukan.");
  if (!canManageArticle(session, existing)) throw new NewsAccessError();

  const { data, error } = await getSupabase()
    .from("news")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw toUserError(error, "Status berita gagal diubah.");
  if (!data) throw new NewsAccessError();

  await newsStore.refresh();
  return rowToNews(data);
}

export async function deleteNews(id: string): Promise<void> {
  const session = requireSession();
  const existing = findById(newsStore.getState().items, id);
  if (!existing) return;
  if (!canManageArticle(session, existing)) throw new NewsAccessError();

  const { data, error } = await getSupabase().from("news").delete().eq("id", id).select("id");
  if (error) throw toUserError(error, "Berita gagal dihapus.");
  if (!data || data.length === 0) throw new NewsAccessError();

  await removeMedia([existing.coverImage]);
  await newsStore.refresh();
}

export type { NewsArticle, NewsStatus };
