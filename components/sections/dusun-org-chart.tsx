"use client";

import { PersonCard } from "@/components/cards/person-card";
import { groupOfficialsByTier, officialsOf, type DusunOfficial } from "@/lib/data/dusunOfficialsData";
import { dusun, getRTsByRW, rwList } from "@/lib/data/wilayahData";
import { useDusunOfficials } from "@/lib/hooks/use-directory";

// Rows are tiers (top row first). Inside a row people wrap, so the chart
// collapses to one or two columns on a phone without a separate layout.
function OrgChart({ officials, label }: { officials: DusunOfficial[]; label: string }) {
  const tiers = groupOfficialsByTier(officials);
  return (
    <ol className="mx-auto flex max-w-4xl flex-col items-center" aria-label={label}>
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

// Satu bagan per wilayah: dusun, lalu tiap RW diikuti RT-nya. Wilayah yang
// belum punya pengurus dilewati.
export function DusunOrgChart() {
  const all = useDusunOfficials();

  const dusunPeople = officialsOf(all, dusun.id);
  const rwSections = rwList
    .map((rw) => ({
      rw,
      people: officialsOf(all, rw.id),
      rts: getRTsByRW(rw.id)
        .map((rt) => ({ rt, people: officialsOf(all, rt.id) }))
        .filter((x) => x.people.length > 0),
    }))
    .filter((x) => x.people.length > 0 || x.rts.length > 0);

  if (dusunPeople.length === 0 && rwSections.length === 0) {
    return <p className="text-center text-sm text-ink-500">Struktur organisasi belum diisi.</p>;
  }

  return (
    <div className="space-y-16">
      {dusunPeople.length > 0 && (
        <section aria-labelledby="struktur-dusun">
          <h2 id="struktur-dusun" className="mb-8 text-center font-display text-xl font-semibold text-ink-900">
            Pengurus {dusun.name}
          </h2>
          <OrgChart officials={dusunPeople} label={`Bagan pengurus ${dusun.name}`} />
        </section>
      )}

      {rwSections.map(({ rw, people, rts }) => (
        <section key={rw.id} aria-labelledby={`struktur-${rw.id}`}>
          <h2 id={`struktur-${rw.id}`} className="mb-8 text-center font-display text-xl font-semibold text-ink-900">
            Pengurus {rw.label}
          </h2>
          {people.length > 0 && <OrgChart officials={people} label={`Bagan pengurus ${rw.label}`} />}
          {rts.length > 0 && (
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {rts.map(({ rt, people: rtPeople }) => (
                <div key={rt.id} className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
                  <h3 className="mb-6 text-center font-display text-base font-semibold text-ink-900">
                    Pengurus {rt.label}
                  </h3>
                  <OrgChart officials={rtPeople} label={`Bagan pengurus ${rt.label}`} />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
