"use client";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { BarStat } from "@/components/sections/bar-stat";
import { Card } from "@/components/ui/card";
import { AGE_GROUPS, sumDemografi, sumUmur, totalWarga } from "@/lib/data/demografiData";
import { getRWById, rtList, rwList } from "@/lib/data/wilayahData";
import { useDemografi, useWilayahHeads } from "@/lib/hooks/use-directory";

// Dua bagian halaman Profil yang angkanya berasal dari Supabase (rt_demografi).

export function DemografiSection() {
  const rows = useDemografi();
  const total = sumDemografi(rows);
  const filled = rows.length > 0;
  const umurTotal = sumUmur(total.umur);

  const summary = [
    { label: "Total Penduduk", value: total.warga },
    { label: "Laki-laki", value: total.laki },
    { label: "Perempuan", value: total.perempuan },
    { label: "Kepala Keluarga", value: total.kk },
  ];

  return (
    <section className="bg-cream py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Kependudukan" title="Demografi Dusun" className="mb-10" />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
            {summary.map((item) => (
              <Card key={item.label} className="p-5">
                <p className="font-display text-2xl font-semibold text-ink-900">
                  {filled ? item.value.toLocaleString("id-ID") : "–"}
                </p>
                <p className="mt-1 text-sm text-ink-500">{item.label}</p>
              </Card>
            ))}
          </div>
          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-ink-900">
              Berdasarkan Kelompok Usia
            </h3>
            {umurTotal > 0 ? (
              <BarStat
                data={AGE_GROUPS.map((g, i) => ({ group: `${g} tahun`, value: total.umur[i] }))}
                total={umurTotal}
              />
            ) : (
              <p className="text-sm text-ink-500">Data kelompok usia belum diisi.</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function WilayahSection() {
  const rows = useDemografi();
  const { headOf, ready } = useWilayahHeads();
  const total = sumDemografi(rows);
  const filled = rows.length > 0;

  const description =
    `Dusun Cilikan berada di Kalurahan Umbulmartani dan terbagi ke dalam ${rtList.length} RT dalam ${rwList.length} RW` +
    (filled ? `, dengan total ${total.kk.toLocaleString("id-ID")} kepala keluarga.` : ".");

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Wilayah Administratif"
          title="RT dan RW Dusun Cilikan"
          description={description}
          className="mb-10"
        />
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-brand-50 text-xs font-semibold uppercase tracking-wide text-brand-800">
              <tr>
                <th className="px-5 py-3.5">Wilayah RT</th>
                <th className="px-5 py-3.5">Ketua RT</th>
                <th className="px-5 py-3.5">RW</th>
                <th className="px-5 py-3.5">Penduduk</th>
                <th className="px-5 py-3.5">Kepala Keluarga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rtList.map((rt) => {
                const d = rows.find((r) => r.rtId === rt.id);
                return (
                  <tr key={rt.id} className="hover:bg-cream-100/60">
                    <td className="px-5 py-4 font-medium text-ink-900">{rt.label}</td>
                    <td className="px-5 py-4 text-ink-700">{headOf(rt.id)?.name ?? (ready ? "–" : "")}</td>
                    <td className="px-5 py-4 text-ink-700">{getRWById(rt.rwId)?.label}</td>
                    <td className="px-5 py-4 text-ink-700">{d ? `${totalWarga(d)} jiwa` : "–"}</td>
                    <td className="px-5 py-4 text-ink-700">{d ? d.jumlahKK : "–"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
