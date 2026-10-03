"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { ArticleView } from "@/components/news/article-view";
import { NewsCover } from "@/components/news/news-cover";
import { getManageableWilayah } from "@/lib/auth";
import { newsCategories, type NewsArticle, type NewsStatus } from "@/lib/data/newsData";
import { fileToCompressedDataUrl } from "@/lib/image-upload";
import { createNews, slugify, updateNews } from "@/lib/newsService";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";
const labelClass = "mb-1.5 block text-sm font-medium text-ink-700";

function today(): string {
  return new Date().toLocaleDateString("en-CA");
}

export function NewsEditor({ article }: { article?: NewsArticle }) {
  const router = useRouter();
  const { user } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const destinations = useMemo(() => getManageableWilayah(user), [user]);

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [body, setBody] = useState(article?.content.join("\n\n") ?? "");
  const [categoryId, setCategoryId] = useState(article?.categoryId ?? newsCategories[0].id);
  const [wilayahId, setWilayahId] = useState(article?.wilayahId ?? destinations[0]?.id ?? "");
  const [publishedAt, setPublishedAt] = useState(article?.publishedAt ?? today());
  const [coverImage, setCoverImage] = useState(article?.coverImage);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const effectiveSlug = slugTouched ? slug : slugify(title);
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  async function handleCover(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      setCoverImage(await fileToCompressedDataUrl(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memproses gambar.");
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  function save(status: NewsStatus) {
    setError("");
    setBusy(true);
    const input = {
      title,
      slug: effectiveSlug,
      excerpt,
      content: paragraphs,
      coverImage,
      categoryId,
      status,
      publishedAt,
      wilayahId,
    };
    try {
      if (article) updateNews(article.id, input);
      else createNews(input);
      router.push("/dashboard/berita");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Berita gagal disimpan.");
      setBusy(false);
    }
  }

  const isPublished = article?.status === "published";

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            {article ? "Edit Berita" : "Berita Baru"}
          </h1>
        </div>

        <div className="inline-flex rounded-xl border border-line bg-paper p-1" role="group" aria-label="Mode tampilan">
          {(["edit", "preview"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              aria-pressed={view === mode}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors",
                view === mode ? "bg-brand-600 text-white" : "text-ink-500 hover:text-ink-900"
              )}
            >
              {mode === "edit" ? "Edit" : "Preview"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {view === "preview" ? (
        <div className="rounded-2xl border border-line bg-paper px-6 py-10 shadow-sm sm:px-10">
          <ArticleView
            article={{
              title,
              content: paragraphs.length > 0 ? paragraphs : ["Isi berita belum diisi."],
              coverImage,
              categoryId,
              publishedAt,
              authorName: article?.authorName ?? user?.displayName ?? "",
              wilayahId,
            }}
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5 rounded-2xl border border-line bg-paper p-6 shadow-sm">
            <div>
              <label htmlFor="news-title" className={labelClass}>Judul</label>
              <input
                id="news-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul berita"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="news-slug" className={labelClass}>Slug</label>
              <input
                id="news-slug"
                type="text"
                value={effectiveSlug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugTouched(true);
                }}
                className={cn(fieldClass, "font-mono text-xs")}
              />
              <p className="mt-1 text-xs text-ink-500">Alamat halaman: /berita/{effectiveSlug || "..."}</p>
            </div>

            <div>
              <label htmlFor="news-excerpt" className={labelClass}>Ringkasan</label>
              <textarea
                id="news-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="Dua kalimat singkat yang tampil di daftar berita"
                className={cn(fieldClass, "resize-none")}
              />
            </div>

            <div>
              <label htmlFor="news-body" className={labelClass}>Isi berita</label>
              <textarea
                id="news-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={14}
                placeholder="Pisahkan paragraf dengan satu baris kosong."
                className={cn(fieldClass, "resize-y leading-relaxed")}
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-line bg-paper p-5 shadow-sm">
              <p className={labelClass}>Gambar sampul</p>
              {coverImage ? (
                <div className="relative">
                  <NewsCover
                    article={{ title: title || "Gambar sampul", coverImage, categoryId }}
                    className="aspect-[16/10] w-full rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage(undefined)}
                    aria-label="Hapus gambar sampul"
                    className="absolute right-2 top-2 rounded-full bg-paper/90 p-1.5 text-ink-700 shadow-sm hover:text-red-600"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 text-sm text-ink-500 transition-colors hover:border-brand-500 hover:text-brand-700"
                >
                  <ImagePlus className="h-6 w-6" aria-hidden="true" />
                  Unggah gambar
                </button>
              )}
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-label="Pilih file gambar sampul"
                onChange={(e) => handleCover(e.target.files?.[0])}
              />
              <p className="mt-2 text-xs text-ink-500">
                Gambar diperkecil otomatis agar muat di penyimpanan browser.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-line bg-paper p-5 shadow-sm">
              <div>
                <label htmlFor="news-category" className={labelClass}>Kategori</label>
                <select
                  id="news-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={fieldClass}
                >
                  {newsCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="news-publisher" className={labelClass}>Penerbit</label>
                <select
                  id="news-publisher"
                  value={wilayahId}
                  onChange={(e) => setWilayahId(e.target.value)}
                  className={fieldClass}
                  disabled={destinations.length <= 1}
                >
                  {destinations.map((w) => (
                    <option key={w.id} value={w.id}>{w.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="news-date" className={labelClass}>Tanggal publikasi</label>
                <input
                  id="news-date"
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/berita")}
          disabled={busy}
          className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-cream-100 disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={() => save("draft")}
          disabled={busy}
          className="rounded-xl border border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-50"
        >
          {isPublished ? "Jadikan Draft" : "Simpan Draft"}
        </button>
        <button
          type="button"
          onClick={() => save("published")}
          disabled={busy}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {isPublished ? "Simpan Perubahan" : "Terbitkan"}
        </button>
      </div>
    </div>
  );
}
