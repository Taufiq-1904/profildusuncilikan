import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";

// Used by the dusun organization chart and by an organization's optional
// management list, so people look the same everywhere.
export function PersonCard({
  name,
  position,
  photo,
  period,
  className,
}: {
  name: string;
  position: string;
  photo?: string;
  period?: string;
  className?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center rounded-2xl border border-line bg-paper p-5 text-center shadow-[0_1px_2px_rgba(28,36,32,0.04)]",
        className
      )}
    >
      {photo ? (
        <MediaImage src={photo} alt={`Foto ${name}`} sizes="80px" className="h-20 w-20 rounded-full" />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 font-display text-2xl font-semibold text-brand-700"
        >
          {initial}
        </div>
      )}
      <p className="mt-4 font-display text-base font-semibold leading-snug text-ink-900">{name}</p>
      <p className="mt-1 text-sm font-medium text-brand-700">{position}</p>
      {period && <p className="mt-1 text-xs text-ink-500">{period}</p>}
    </div>
  );
}
