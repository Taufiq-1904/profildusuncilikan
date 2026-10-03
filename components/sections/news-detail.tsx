"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ManageBar } from "@/components/ui/manage-bar";
import { Container } from "@/components/layout/container";
import { ArticleView } from "@/components/news/article-view";
import { NewsCard } from "@/components/cards/news-card";
import { useAuth } from "@/components/providers/auth-provider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNews, useNewsReady } from "@/lib/hooks/use-news";
import { canManageArticle, findBySlug, selectPublished } from "@/lib/newsService";

export function NewsDetail({ slug }: { slug: string }) {
  const { user } = useAuth();
  const isClient = useNewsReady();
  const all = useNews();

  const article = findBySlug(all, slug);
  const title = article?.title;
  useEffect(() => {
    if (title) document.title = `${title} — Berita`;
  }, [title]);

  // Wait until the articles have been loaded from Supabase before deciding
  // that this slug is missing.
  if (!isClient) return <LoadingSpinner />;

  const canPreview = article ? canManageArticle(user, article) : false;

  // Drafts are only visible to accounts that could edit them.
  if (!article || (article.status === "draft" && !canPreview)) {
    notFound();
  }

  const related = selectPublished(all)
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.categoryId === article.categoryId || a.wilayahId === article.wilayahId)
    )
    .slice(0, 3);

  return (
    <>
      <Breadcrumb items={[{ label: "Berita", href: "/berita" }, { label: article.title }]} />
      <ManageBar href={`/dashboard/berita/${article.id}`} label="Edit berita ini" show={canPreview} />

      {article.status === "draft" && (
        <div className="border-b border-amber-100 bg-amber-50">
          <Container>
            <p className="py-3 text-sm text-amber-700">
              Ini masih draft dan hanya terlihat oleh pengelola. Pengunjung belum bisa membukanya.
            </p>
          </Container>
        </div>
      )}

      <article className="py-14 sm:py-20">
        <Container>
          <ArticleView article={article} />
          {canPreview && (
            <div className="mx-auto mt-10 max-w-3xl border-t border-line pt-6">
              <Link
                href={`/dashboard/berita/${article.id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit berita ini
              </Link>
            </div>
          )}
        </Container>
      </article>

      {related.length > 0 && (
        <section className="bg-cream-100 py-16 sm:py-20" aria-labelledby="berita-terkait">
          <Container>
            <h2 id="berita-terkait" className="mb-8 font-display text-2xl font-semibold text-ink-900">
              Berita Terkait
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
