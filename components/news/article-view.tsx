import { CalendarDays, Building2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewsCover } from "@/components/news/news-cover";
import { getCategoryName, type NewsArticle } from "@/lib/data/newsData";
import { getWilayahLabel } from "@/lib/data/wilayahData";
import { formatDate } from "@/lib/utils";

export type ArticleViewData = Pick<
  NewsArticle,
  "title" | "content" | "coverImage" | "categoryId" | "publishedAt" | "authorName" | "wilayahId"
>;

// Used by the public detail page and by the dashboard preview, so what an
// editor previews is exactly what readers get.
export function ArticleView({ article }: { article: ArticleViewData }) {
  return (
    <div className="mx-auto max-w-3xl">
      <Badge variant="brand">{getCategoryName(article.categoryId)}</Badge>

      <h1 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl">
        {article.title || "Judul berita"}
      </h1>

      <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Tanggal publikasi</dt>
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          <dd>{formatDate(article.publishedAt)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Penulis</dt>
          <User className="h-4 w-4" aria-hidden="true" />
          <dd>{article.authorName}</dd>
        </div>
        <div className="flex items-center gap-1.5 text-brand-700">
          <dt className="sr-only">Penerbit</dt>
          <Building2 className="h-4 w-4" aria-hidden="true" />
          <dd>Dipublikasikan oleh {getWilayahLabel(article.wilayahId)}</dd>
        </div>
      </dl>

      <NewsCover article={article} className="mt-8 aspect-[16/9] w-full rounded-3xl" />

      <div className="mt-10 space-y-5">
        {article.content.map((paragraph, i) => (
          <p key={i} className="text-base leading-relaxed text-ink-700">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
