"use client";

import { Search } from "lucide-react";
import { getRTById, getWilayahLabel, type WilayahFilterOption } from "@/lib/data/wilayahData";
import { cn } from "@/lib/utils";

const ALL = "semua";

export type FilterChip = { id: string; name: string };

// Search box + wilayah select + category chips, shared by the UMKM and
// organization directories so both filter the same way.
export function FilterBar({
  searchLabel,
  query,
  onQuery,
  wilayahOptions,
  wilayahId,
  onWilayah,
  chips,
  chipId,
  onChip,
}: {
  searchLabel: string;
  query: string;
  onQuery: (value: string) => void;
  wilayahOptions: WilayahFilterOption[];
  wilayahId: string;
  onWilayah: (id: string) => void;
  chips: FilterChip[];
  chipId: string;
  onChip: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={searchLabel}
            aria-label={searchLabel}
            className="h-11 w-full rounded-full border border-line bg-paper pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {wilayahOptions.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-ink-500">
            <span className="shrink-0">Wilayah</span>
            <select
              value={wilayahId}
              onChange={(e) => onWilayah(e.target.value)}
              className="h-11 w-full rounded-full border border-line bg-paper px-4 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value={ALL}>Semua wilayah</option>
              {wilayahOptions.map((w) => {
                const rwId = w.level === "rt" ? getRTById(w.id)?.rwId : undefined;
                return (
                  <option key={w.id} value={w.id}>
                    {rwId ? `${w.label} · ${getWilayahLabel(rwId)}` : w.label}
                  </option>
                );
              })}
            </select>
          </label>
        )}
      </div>

      {chips.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
          {[{ id: ALL, name: "Semua" }, ...chips].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChip(c.id)}
              aria-pressed={chipId === c.id}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                chipId === c.id
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-line text-ink-500 hover:border-brand-300 hover:text-brand-700"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { ALL as FILTER_ALL };
