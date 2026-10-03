import { Container } from "@/components/layout/container";
import { StatCard } from "@/components/cards/stat-card";
import { villageStats } from "@/lib/data/villageData";

export function StatsSection() {
  return (
    <section className="relative z-10 -mt-14 pb-4">
      <Container>
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-line bg-paper/95 p-4 shadow-lg shadow-brand-950/5 backdrop-blur sm:gap-4 sm:p-6 lg:grid-cols-4">
          {villageStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
