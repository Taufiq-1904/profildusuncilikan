import Image from "next/image";
import { newsCategories, type NewsArticle } from "@/lib/data/newsData";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { cn } from "@/lib/utils";

const tones = ["green", "gold", "sky", "clay"] as const;

type CoverSource = Pick<NewsArticle, "title" | "coverImage" | "categoryId">;

// Shows the uploaded cover, or a neutral placeholder tinted by category when
// the article has none.
export function NewsCover({ article, className }: { article: CoverSource; className?: string }) {
  if (article.coverImage) {
    return (
      <div className={cn("relative overflow-hidden bg-cream-100", className)}>
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  const index = Math.max(0, newsCategories.findIndex((c) => c.id === article.categoryId));
  return (
    <ImagePlaceholder
      tone={tones[index % tones.length]}
      icon="package"
      label={article.title}
      className={className}
    />
  );
}
