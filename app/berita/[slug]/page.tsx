import type { Metadata } from "next";
import { NewsDetail } from "@/components/sections/news-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { seedNews } from "@/lib/data/newsData";
import { siteConfig } from "@/lib/data/siteConfig";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Same limitation as UMKM and organizations: only seed articles are known to
// the server. One published from the dashboard sets its own tab title once it
// loads in the browser (see NewsDetail).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = seedNews.find((a) => a.slug === slug && a.status === "published");
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
  const article = seedNews.find((a) => a.slug === slug && a.status === "published");

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
