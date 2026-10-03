import { MediaImage } from "@/components/ui/media-image";

export function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  if (images.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((src, i) => (
        <li key={i}>
          <MediaImage
            src={src}
            alt={`${title}, foto ${i + 1}`}
            sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
            className="aspect-[4/3] w-full rounded-xl"
          />
        </li>
      ))}
    </ul>
  );
}
