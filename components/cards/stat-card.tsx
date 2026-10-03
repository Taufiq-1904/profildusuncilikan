import { getIconElement } from "@/lib/icon-map";

export function StatCard({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  // null = datanya belum diisi atau belum selesai dimuat.
  value: number | null;
  suffix?: string;
  icon: string;
}) {
  const iconEl = getIconElement(icon, "h-6 w-6");
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        {iconEl}
      </div>
      <div>
        <p className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
          {value === null ? "–" : `${value.toLocaleString("id-ID")}${suffix ?? ""}`}
        </p>
        <p className="text-sm text-ink-500">{label}</p>
      </div>
    </div>
  );
}
