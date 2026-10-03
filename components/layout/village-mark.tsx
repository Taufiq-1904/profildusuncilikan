import { cn } from "@/lib/utils";

export function VillageMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="23" fill="var(--brand-800)" stroke="var(--gold-500)" strokeWidth="1.5" />
      <path
        d="M9 30 Q16.5 24 24 30 T39 30"
        fill="none"
        stroke="var(--gold-400)"
        strokeWidth="1.6"
      />
      <path
        d="M9 34.5 Q16.5 28.5 24 34.5 T39 34.5"
        fill="none"
        stroke="var(--brand-100)"
        strokeWidth="1.2"
        opacity="0.7"
      />
      <path d="M24 10L31 20H17L24 10Z" fill="var(--gold-500)" />
      <path d="M15 22H33L31 26H17L15 22Z" fill="var(--brand-100)" />
      <rect x="21" y="26" width="6" height="8" fill="var(--gold-400)" />
    </svg>
  );
}
