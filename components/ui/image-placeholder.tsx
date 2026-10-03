import { cn } from "@/lib/utils";
import { getIconElement } from "@/lib/icon-map";

type Tone = "green" | "gold" | "sky" | "clay";

const toneStyles: Record<Tone, { bg: string; line: string; icon: string }> = {
  green: {
    bg: "bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800",
    line: "stroke-brand-400/40",
    icon: "text-brand-100/70",
  },
  gold: {
    bg: "bg-gradient-to-br from-gold-500 via-gold-400 to-gold-600",
    line: "stroke-gold-100/50",
    icon: "text-gold-100/80",
  },
  sky: {
    bg: "bg-gradient-to-br from-slate-500 via-slate-400 to-brand-700",
    line: "stroke-white/30",
    icon: "text-white/70",
  },
  clay: {
    bg: "bg-gradient-to-br from-stone-500 via-stone-400 to-brand-800",
    line: "stroke-stone-100/40",
    icon: "text-stone-100/75",
  },
};

/**
 * Placeholder visual for photography that will later be swapped with real
 * assets served from Supabase Storage / a CDN / local `/public`.
 * Keep the `data-image-slot` attribute — it marks where a real <Image> goes.
 */
export function ImagePlaceholder({
  tone = "green",
  icon,
  label,
  className,
  slot,
}: {
  tone?: Tone;
  icon?: string;
  label?: string;
  className?: string;
  slot?: string;
}) {
  const iconEl = icon
    ? getIconElement(icon, cn("relative h-10 w-10", toneStyles[tone].icon), {
        strokeWidth: 1.5,
        "aria-hidden": true,
      })
    : null;
  const style = toneStyles[tone];

  return (
    <div
      data-image-slot={slot ?? label ?? "placeholder"}
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        style.bg,
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[70, 120, 170, 220, 270].map((y, i) => (
          <path
            key={y}
            d={`M0 ${y} Q 100 ${y - 22 - i * 4} 200 ${y} T 400 ${y}`}
            fill="none"
            className={style.line}
            strokeWidth="1.5"
          />
        ))}
      </svg>
      {iconEl}
      <span className="sr-only">{label ?? "Gambar placeholder"}</span>
    </div>
  );
}
