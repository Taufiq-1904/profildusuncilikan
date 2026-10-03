import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  onChange,
  label,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  label: string;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label={label} className="mt-12 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            p === page ? "bg-brand-700 text-white" : "text-ink-700 hover:bg-brand-50"
          )}
        >
          {p}
        </button>
      ))}
    </nav>
  );
}
