import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { cn } from "@/lib/utils";

type Tone = "green" | "gold" | "sky" | "clay";

// One place for "uploaded image, or a neutral placeholder when there is none".
// Uploaded images are data URLs today, hence `unoptimized`.
export function MediaImage({
  src,
  alt,
  icon = "package",
  tone = "green",
  fit = "cover",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className,
}: {
  src?: string;
  alt: string;
  icon?: string;
  tone?: Tone;
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-cream-100", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes={sizes}
          className={fit === "contain" ? "object-contain p-1" : "object-cover"}
        />
      </div>
    );
  }
  return <ImagePlaceholder tone={tone} icon={icon} label={alt} className={className} />;
}
