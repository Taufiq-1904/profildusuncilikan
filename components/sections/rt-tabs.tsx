"use client";

import { useState } from "react";
import { totalWarga } from "@/lib/data/demografiData";
import { rtList } from "@/lib/data/wilayahData";
import { useDemografi, useWilayahHeads } from "@/lib/hooks/use-directory";
import { Users, Home, User } from "lucide-react";
import Link from "next/link";

export function RTTabs() {
  const [active, setActive] = useState(0);
  const demografi = useDemografi();
  const { headOf, roleOf, ready } = useWilayahHeads();

  const tabs = rtList.map((rt) => ({ rt }));

  const current = tabs[active];
  const stat = demografi.find((d) => d.rtId === current.rt.id);

  return (
    <div>
      {/* Tab buttons */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.rt.id}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              active === i
                ? "bg-brand-700 text-white shadow-sm"
                : "border border-line bg-paper text-ink-600 hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            {tab.rt.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-2xl border border-line bg-paper shadow-sm">
        {/* Top bar */}
        <div className="border-b border-line bg-brand-50/50 px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-ink-900">{current.rt.label}</h3>
        </div>

        <div className="grid gap-8 p-6 sm:grid-cols-2">
          {/* Pengurus */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-500">Pengurus</p>
            <div className="space-y-3">
              {[
                { label: "Ketua RT", name: headOf(current.rt.id)?.name ?? (ready ? "Belum diisi" : "…") },
                { label: "Sekretaris", name: roleOf(current.rt.id, "sekretaris")?.name ?? "–" },
                { label: "Bendahara", name: roleOf(current.rt.id, "bendahara")?.name ?? "–" },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100">
                    <User className="h-4 w-4 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-xs text-ink-500">{p.label}</p>
                    <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistik */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-500">Statistik Warga</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100">
                  <Users className="h-4 w-4 text-brand-700" />
                </div>
                <div>
                  <p className="text-xs text-ink-500">Jumlah Warga</p>
                  <p className="text-sm font-semibold text-ink-900">
                    {stat ? `${totalWarga(stat)} jiwa` : "Belum diisi"}
                    {stat && (
                      <span className="ml-2 text-xs font-normal text-ink-500">
                        ({stat.laki} L · {stat.perempuan} P)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                  <Home className="h-4 w-4 text-gold-600" />
                </div>
                <div>
                  <p className="text-xs text-ink-500">Jumlah KK</p>
                  <p className="text-sm font-semibold text-ink-900">{stat ? `${stat.jumlahKK} Kepala Keluarga` : "Belum diisi"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="border-t border-line px-6 py-3">
          <p className="text-xs text-ink-400">
            Data lengkap UMKM dan potensi RT tersedia di{" "}
            <Link href="/login" className="font-medium text-brand-600 hover:underline">
              panel pengelola
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
