import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsEditButton } from "@/components/cards/edit-links";
import { NewsCover } from "@/components/news/news-cover";
import { getCategoryName, type NewsArticle } from "@/lib/data/newsData";
import { getWilayahLabel } from "@/lib/data/wilayahData";
import { formatDate } from "@/lib/utils";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="group relative flex flex-col overflow-hidden hover:shadow-md">
      <Link href={`/berita/${article.slug}`} className="flex h-full flex-col">
        <NewsCover article={article} className="aspect-[16/10] w-full" />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-3 text-xs text-ink-500">
            <Badge variant="brand">{getCategoryName(article.categoryId)}</Badge>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
          <h3 className="mt-3 text-balance font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">
            {article.excerpt}
          </p>
          <p className="mt-4 text-xs text-ink-500">
            Dipublikasikan oleh {getWilayahLabel(article.wilayahId)}
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
            Baca selengkapnya
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </Link>
      <NewsEditButton article={article} />
    </Card>
  );
}
