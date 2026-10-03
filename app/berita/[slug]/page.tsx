import type { Metadata } from "next";
import { NewsDetail } from "@/components/sections/news-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/data/siteConfig";
import { buildMetadata } from "@/lib/seo";
import { getPublishedNewsBySlug } from "@/lib/server/public-content";

type Props = { params: Promise<{ slug: string }> };

// Metadata dan JSON-LD dibaca dari Supabase di server, jadi berita yang
// diterbitkan dari dashboard langsung punya judul/preview yang benar.
// Berita draft tidak terlihat di sini (hanya pengelola yang bisa membukanya,
// lewat NewsDetail di browser).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedNewsBySlug(slug);
  if (!article) return { title: "Berita" };
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/berita/${article.slug}`,
    image: article.coverImage,
  });
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedNewsBySlug(slug);

  return (
    <>
      {article && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            description: article.excerpt,
            image: article.coverImage,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            author: { "@type": "Person", name: article.authorName },
            publisher: { "@type": "Organization", name: siteConfig.villageName },
          }}
        />
      )}
      <NewsDetail slug={slug} />
    </>
  );
}
