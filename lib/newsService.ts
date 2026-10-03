import { getSession, canManageWilayah, type SessionUser } from "./auth";
import { seedNews, type NewsArticle, type NewsStatus } from "./data/newsData";
import { slugify } from "./utils";

// Persistence is localStorage for now. Every mutation below re-reads the
// session and checks the policy itself instead of trusting what the UI
// passes in, which is the shape a real API route would have. Swapping the
// storage calls for database queries later should not change the callers.

const STORAGE_KEY = "cilikan_news_v2";
const CHANGE_EVENT = "cilikan:news-change";

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

let cachedRaw: string | null | undefined;
let cachedArticles: NewsArticle[] = seedNews;

function readAll(): NewsArticle[] {
  if (typeof window === "undefined") return seedNews;
  const raw = localStorage.getItem(STORAGE_KEY);
  // Same string as last time means the same array reference, which is what
  // useSyncExternalStore needs to avoid re-rendering in a loop.
  if (raw === cachedRaw) return cachedArticles;
  cachedRaw = raw;
  if (!raw) {
    cachedArticles = seedNews;
  } else {
    try {
      cachedArticles = JSON.parse(raw) as NewsArticle[];
    } catch {
      cachedArticles = seedNews;
    }
  }
  return cachedArticles;
}

function writeAll(articles: NewsArticle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {
    throw new Error(
      "Penyimpanan browser penuh. Hapus berita lama atau gunakan gambar sampul yang lebih kecil."
    );
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeNews(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export const getNewsSnapshot = readAll;
export const getServerNewsSnapshot = (): NewsArticle[] => seedNews;

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

function uniqueSlug(base: string, all: NewsArticle[], excludeId?: string): string {
  const root = slugify(base) || "berita";
  const taken = new Set(all.filter((a) => a.id !== excludeId).map((a) => a.slug));
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

// --- mutations -------------------------------------------------------------

function validate(input: NewsInput): void {
  if (!input.title.trim()) throw new Error("Judul berita wajib diisi.");
  if (!input.excerpt.trim()) throw new Error("Ringkasan berita wajib diisi.");
  if (input.content.filter((p) => p.trim()).length === 0) throw new Error("Isi berita wajib diisi.");
  if (!input.publishedAt) throw new Error("Tanggal publikasi wajib diisi.");
}

function normalize(input: NewsInput, all: NewsArticle[], excludeId?: string): NewsInput {
  return {
    ...input,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    content: input.content.map((p) => p.trim()).filter(Boolean),
    slug: uniqueSlug(input.slug || input.title, all, excludeId),
  };
}

export function createNews(input: NewsInput): NewsArticle {
  const session = requireSession();
  if (!canManageWilayah(session, input.wilayahId)) throw new NewsAccessError();
  validate(input);

  const all = readAll();
  const now = new Date().toISOString();
  const article: NewsArticle = {
    ...normalize(input, all),
    id: `news-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    authorUsername: session.username,
    authorName: session.displayName,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([article, ...all]);
  return article;
}

export function updateNews(id: string, input: NewsInput): NewsArticle {
  const session = requireSession();
  const all = readAll();
  const existing = findById(all, id);
  if (!existing) throw new Error("Berita tidak ditemukan.");
  // Both ends are checked: the account must own the current article and the
  // wilayah it is being moved to.
  if (!canManageArticle(session, existing) || !canManageWilayah(session, input.wilayahId)) {
    throw new NewsAccessError();
  }
  validate(input);

  const updated: NewsArticle = {
    ...existing,
    ...normalize(input, all, id),
    updatedAt: new Date().toISOString(),
  };
  writeAll(all.map((a) => (a.id === id ? updated : a)));
  return updated;
}

export function setNewsStatus(id: string, status: NewsStatus): NewsArticle {
  const session = requireSession();
  const all = readAll();
  const existing = findById(all, id);
  if (!existing) throw new Error("Berita tidak ditemukan.");
  if (!canManageArticle(session, existing)) throw new NewsAccessError();

  const updated = { ...existing, status, updatedAt: new Date().toISOString() };
  writeAll(all.map((a) => (a.id === id ? updated : a)));
  return updated;
}

export function deleteNews(id: string): void {
  const session = requireSession();
  const all = readAll();
  const existing = findById(all, id);
  if (!existing) return;
  if (!canManageArticle(session, existing)) throw new NewsAccessError();
  writeAll(all.filter((a) => a.id !== id));
}

export type { NewsArticle, NewsStatus };
