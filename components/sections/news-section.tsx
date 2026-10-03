"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "./section-heading";
import { NewsCard } from "@/components/cards/news-card";
import { useNews } from "@/lib/hooks/use-news";
import { selectPublished } from "@/lib/newsService";

export function NewsSection() {
  const all = useNews();
  const latest = selectPublished(all).slice(0, 3);

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Berita Dusun"
            title="Kabar Terbaru dari Dusun Cilikan"
            description="Kegiatan warga, pengumuman, dan informasi dari dusun, RW, dan RT."
          />
          <Link
            href="/berita"
            className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex"
          >
            Lihat Semua Berita
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-ink-500">Belum ada berita yang dipublikasikan.</p>
        )}

        <Link
          href="/berita"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 sm:hidden"
        >
          Lihat Semua Berita
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Container>
    </section>
  );
}
