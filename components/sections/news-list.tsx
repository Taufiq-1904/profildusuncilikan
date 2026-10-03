"use client";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { NewsCard } from "@/components/cards/news-card";
import { NewsExplorer } from "@/components/sections/news-explorer";
import { PageHeader } from "@/components/sections/page-header";
import { useNews } from "@/lib/hooks/use-news";
import { selectPublished } from "@/lib/newsService";

// Client body of /berita: reads from localStorage, so it stays separate from
// the server page.tsx that carries the route's metadata.
export function NewsList() {
  const articles = selectPublished(useNews());
  const latest = articles.slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Berita Dusun"
        title="Kabar Terbaru Dusun Cilikan"
        description="Informasi kegiatan, pengumuman, dan perkembangan dari dusun, RW, dan RT."
      />
      <Breadcrumb items={[{ label: "Berita" }]} />

      {latest.length > 0 && (
        <section className="pt-16 sm:pt-20" aria-labelledby="berita-terbaru">
          <Container>
            <h2 id="berita-terbaru" className="font-display text-2xl font-semibold text-ink-900">
              Berita Terbaru
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-16 sm:py-20" aria-labelledby="semua-berita">
        <Container>
          <h2 id="semua-berita" className="mb-8 font-display text-2xl font-semibold text-ink-900">
            Semua Berita
          </h2>
          <NewsExplorer articles={articles} />
        </Container>
      </section>
    </>
  );
}
