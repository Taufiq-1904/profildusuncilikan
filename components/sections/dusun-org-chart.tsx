"use client";

import { PersonCard } from "@/components/cards/person-card";
import { groupOfficialsByTier } from "@/lib/data/dusunOfficialsData";
import { useDusunOfficials } from "@/lib/hooks/use-directory";

// Rows are tiers (top row first). Inside a row people wrap, so the chart
// collapses to one or two columns on a phone without a separate layout.
export function DusunOrgChart() {
  const tiers = groupOfficialsByTier(useDusunOfficials());

  if (tiers.length === 0) {
    return <p className="text-center text-sm text-ink-500">Struktur organisasi belum diisi.</p>;
  }

  return (
    <ol className="mx-auto flex max-w-4xl flex-col items-center" aria-label="Bagan struktur organisasi dusun">
      {tiers.map(({ tier, people }, i) => (
        <li key={tier} className="flex w-full flex-col items-center">
          {i > 0 && <div className="h-8 w-px bg-line" aria-hidden="true" />}
          <ul className="flex w-full flex-wrap justify-center gap-4">
            {people.map((p) => (
              <li key={p.id} className="w-full min-[440px]:w-[calc(50%-0.5rem)] md:w-56">
                <PersonCard name={p.name} position={p.position} photo={p.photo} period={p.period} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
