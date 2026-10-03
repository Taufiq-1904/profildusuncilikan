"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Users, Home, Store, Sparkles, ArrowRight } from "lucide-react";
import { AGE_GROUPS, sumDemografi, totalWarga } from "@/lib/data/demografiData";
import { rtList as allRT, getRTsByRW, type RT } from "@/lib/data/wilayahData";
import { selectUmkmByRT } from "@/lib/umkmService";
import { selectPotensiByRT } from "@/lib/potensiService";
import {
  useDemografi,
  useDemografiReady,
  useWilayahHeads,
  usePotensi,
  usePotensiReady,
  useUmkm,
  useUmkmReady,
} from "@/lib/hooks/use-directory";
import { DonutChart } from "@/components/ui/donut-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { useAuth } from "@/components/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();
  const allUmkm = useUmkm();
  const allPotensi = usePotensi();
  // Angka UMKM/potensi tampil "–" sampai datanya selesai dimuat dari Supabase.
  const umkmReady = useUmkmReady();
  const potensiReady = usePotensiReady();
  const demografi = useDemografi();
  const demografiReady = useDemografiReady();
  const { headOf } = useWilayahHeads();
  const mounted = umkmReady && potensiReady && demografiReady;

  // Scope the RTs shown by role: dusun sees everything, an RW account sees
  // its own RTs, an RT account sees only itself.
  const scopedRT: RT[] = useMemo(() => {
    if (!user) return [];
    if (user.role === "dusun") return allRT;
    if (user.role === "rw") return getRTsByRW(user.wilayahId);
    return allRT.filter((rt) => rt.id === user.wilayahId);
  }, [user]);

  const scopedDemografi = demografi.filter((d) => scopedRT.some((rt) => rt.id === d.rtId));
  const total = sumDemografi(scopedDemografi);
  const totalUMKM = scopedRT.reduce((acc, rt) => acc + selectUmkmByRT(allUmkm, rt.id).length, 0);
  const totalPotensi = scopedRT.reduce((acc, rt) => acc + selectPotensiByRT(allPotensi, rt.id).length, 0);

  const statCards = [
    { label: "Total Penduduk", value: `${total.warga} jiwa`, icon: Users, color: "text-brand-700 bg-brand-50" },
    { label: "Jumlah KK", value: `${total.kk} KK`, icon: Home, color: "text-amber-700 bg-amber-50" },
    { label: "Total UMKM", value: `${totalUMKM} Usaha`, icon: Store, color: "text-teal-700 bg-teal-50" },
    { label: "Total Potensi", value: `${totalPotensi} Data`, icon: Sparkles, color: "text-purple-700 bg-purple-50" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="font-display text-2xl font-bold text-ink-900">
            Selamat datang, {user?.displayName}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            Ringkasan data kependudukan, UMKM, dan potensi{" "}
            {user?.role === "dusun" ? "Dusun Cilikan" : "wilayah Anda"}.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-paper p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{s.label}</p>
            <p className="mt-1 font-display text-xl font-bold text-ink-900">{mounted ? s.value : "–"}</p>
          </div>
        ))}
      </div>

      {/* Demographics overview */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
          <h2 className="mb-4 font-display text-base font-semibold text-ink-900">Komposisi Gender</h2>
          <DonutChart
            size={170}
            strokeWidth={32}
            centerLabel="penduduk"
            centerValue={total.warga}
            segments={[
              { label: "Laki-laki", value: total.laki, color: "#0891b2" },
              { label: "Perempuan", value: total.perempuan, color: "#ec4899" },
            ]}
          />
          {mounted && total.warga === 0 && (
            <p className="text-sm text-ink-500">Data kependudukan belum diisi.</p>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
          <h2 className="mb-5 font-display text-base font-semibold text-ink-900">Sebaran Usia Penduduk</h2>
          <BarChart
            bars={AGE_GROUPS.map((label, i) => ({ label, value: total.umur[i] }))}
            height={170}
            barColor="#16a34a"
            unit=" jiwa"
          />
        </div>
      </div>

      {/* RT Cards */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          {user?.role === "rt" ? "RT Saya" : "Ringkasan per RT"}
        </h2>
        <p className="text-xs text-ink-500">Klik RT untuk mengelola berita, peta, UMKM, dan potensi</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {scopedRT.map((rt) => {
          const d = demografi.find((x) => x.rtId === rt.id);
          return (
          <Link
            key={rt.id}
            href={`/dashboard/rt/${rt.id}`}
            className="group rounded-2xl border border-line bg-paper p-5 shadow-sm transition-all hover:border-brand-500 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                {rt.label}
              </span>
              <ArrowRight className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
            </div>
            <p className="text-sm font-semibold text-ink-900">{headOf(rt.id)?.name ?? "Belum diisi"}</p>
            <p className="text-xs text-ink-500 mb-3">Ketua RT</p>

            <div className="space-y-1.5 border-t border-line pt-3 text-xs text-ink-600">
              <div className="flex justify-between">
                <span>Penduduk:</span>
                <span className="font-semibold text-ink-900">{mounted && d ? `${totalWarga(d)} jiwa` : "–"}</span>
              </div>
              <div className="flex justify-between">
                <span>Kepala Keluarga:</span>
                <span className="font-semibold text-ink-900">{mounted && d ? `${d.jumlahKK} KK` : "–"}</span>
              </div>
              <div className="flex justify-between">
                <span>UMKM Terdaftar:</span>
                <span className="font-semibold text-amber-700">{mounted ? selectUmkmByRT(allUmkm, rt.id).length : "–"} Usaha</span>
              </div>
              <div className="flex justify-between">
                <span>Potensi RT:</span>
                <span className="font-semibold text-purple-700">{mounted ? selectPotensiByRT(allPotensi, rt.id).length : "–"} Data</span>
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
