"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { PotentialCard } from "@/components/cards/potential-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { POTENSI_KATEGORI } from "@/lib/data/potensiData";
import { usePotensi, usePotensiReady } from "@/lib/hooks/use-directory";

// Daftar potensi dikelompokkan per kategori. Seluruh isinya berasal dari data
// yang diinput pengelola di Dashboard (Potensi RT), tidak ada yang ditulis di kode.
export function PotensiDirectory() {
  const potensi = usePotensi();
  const ready = usePotensiReady();

  const groups = useMemo(() => {
    const known = POTENSI_KATEGORI.map((kategori) => ({
      kategori,
      items: potensi.filter((p) => p.kategori === kategori),
    }));
    return known.filter((g) => g.items.length > 0);
  }, [potensi]);

  if (!ready) return <LoadingSpinner />;

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-paper py-20 text-center">
        <Sparkles className="h-8 w-8 text-ink-300" aria-hidden="true" />
        <p className="text-sm text-ink-500">Potensi dusun belum ditambahkan.</p>
      </div>
    );
  }

  return (
    <>
      {groups.map(({ kategori, items }) => (
        <div key={kategori} className="mb-16 last:mb-0">
          <h2 className="mb-6 font-display text-2xl font-semibold text-ink-900">{kategori}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((potential) => (
              <PotentialCard key={potential.id} potential={potential} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
