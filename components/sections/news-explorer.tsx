"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { NewsCard } from "@/components/cards/news-card";
import { cn } from "@/lib/utils";
import { newsCategories, type NewsArticle } from "@/lib/data/newsData";
import { getWilayahLabel, getWilayahLevel } from "@/lib/data/wilayahData";

const PAGE_SIZE = 6;
const ALL = "semua";
const LEVEL_ORDER = { dusun: 0, rw: 1, rt: 2 } as const;

export function NewsExplorer({ articles }: { articles: NewsArticle[] }) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(ALL);
  const [wilayahId, setWilayahId] = useState(ALL);
  const [page, setPage] = useState(1);

  // Filter options come from what is actually published, so a new RW/RT
  // shows up here on its own after its first article.
  const categories = useMemo(() => {
    const used = new Set(articles.map((a) => a.categoryId));
    return newsCategories.filter((c) => used.has(c.id));
  }, [articles]);

  const publishers = useMemo(() => {
    const ids = Array.from(new Set(articles.map((a) => a.wilayahId)));
    return ids
      .map((id) => ({ id, label: getWilayahLabel(id), level: getWilayahLevel(id) ?? "rt" }))
      .sort(
        (a, b) =>
          LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.label.localeCompare(b.label, "id")
      );
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (categoryId !== ALL && a.categoryId !== categoryId) return false;
      if (wilayahId !== ALL && a.wilayahId !== wilayahId) return false;
      if (!q) return true;
      return a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
    });
  }, [articles, categoryId, wilayahId, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari berita"
            aria-label="Cari berita"
            className="h-11 w-full rounded-full border border-line bg-paper pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-sm text-ink-500">
            <span className="shrink-0">Penerbit</span>
            <select
              value={wilayahId}
              onChange={(e) => {
                setWilayahId(e.target.value);
                setPage(1);
              }}
              className="h-11 w-full rounded-full border border-line bg-paper px-4 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value={ALL}>Semua penerbit</option>
              {publishers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[{ id: ALL, name: "Semua" }, ...categories].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setCategoryId(c.id);
              setPage(1);
            }}
            aria-pressed={categoryId === c.id}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
              categoryId === c.id
                ? "border-brand-700 bg-brand-700 text-white"
                : "border-line text-ink-500 hover:border-brand-300 hover:text-brand-700"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {paged.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-ink-500">
          Tidak ada berita yang cocok dengan filter yang dipilih.
        </p>
      )}

      {totalPages > 1 && (
        <nav aria-label="Halaman berita" className="mt-12 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                p === currentPage ? "bg-brand-700 text-white" : "text-ink-700 hover:bg-brand-50"
              )}
            >
              {p}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
