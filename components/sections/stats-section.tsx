"use client";

import { Container } from "@/components/layout/container";
import { StatCard } from "@/components/cards/stat-card";
import { sumDemografi } from "@/lib/data/demografiData";
import { rtList, rwList } from "@/lib/data/wilayahData";
import { useDemografi } from "@/lib/hooks/use-directory";

export function StatsSection() {
  const rows = useDemografi();
  const total = sumDemografi(rows);
  // Penduduk dan KK tampil "–" sampai ada RT yang mengisi datanya.
  const filled = rows.length > 0;

  const stats = [
    { label: "Jumlah Penduduk", value: filled ? total.warga : null, suffix: " jiwa", icon: "users" },
    { label: "Jumlah RT", value: rtList.length, suffix: "", icon: "grid" },
    { label: "Jumlah KK", value: filled ? total.kk : null, suffix: " KK", icon: "home" },
    { label: "Jumlah RW", value: rwList.length, suffix: "", icon: "map" },
  ];

  return (
    <section className="relative z-10 -mt-14 pb-4">
      <Container>
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-line bg-paper/95 p-4 shadow-lg shadow-brand-950/5 backdrop-blur sm:gap-4 sm:p-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
