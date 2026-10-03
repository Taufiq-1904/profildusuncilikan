"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Users, Home, Store, Sparkles, ArrowRight } from "lucide-react";
import { rtList as allRT, getRTsByRW, type RT } from "@/lib/data/wilayahData";
import { getUMKMByRT } from "@/lib/umkmService";
import { getPotensiByRT } from "@/lib/potensiService";
import { DonutChart } from "@/components/ui/donut-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { useAuth } from "@/components/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scope the RTs shown by role: dusun sees everything, an RW account sees
  // its own RTs, an RT account sees only itself.
  const scopedRT: RT[] = useMemo(() => {
    if (!user) return [];
    if (user.role === "dusun") return allRT;
    if (user.role === "rw") return getRTsByRW(user.wilayahId);
    return allRT.filter((rt) => rt.id === user.wilayahId);
  }, [user]);

  const totalWarga = scopedRT.reduce((acc, rt) => acc + rt.jumlahWarga, 0);
  const totalKK = scopedRT.reduce((acc, rt) => acc + rt.jumlahKK, 0);
  const totalLaki = scopedRT.reduce((acc, rt) => acc + rt.jumlahLaki, 0);
  const totalPerempuan = scopedRT.reduce((acc, rt) => acc + rt.jumlahPerempuan, 0);
  const totalUMKM = mounted ? scopedRT.reduce((acc, rt) => acc + getUMKMByRT(rt.id).length, 0) : 0;
  const totalPotensi = mounted ? scopedRT.reduce((acc, rt) => acc + getPotensiByRT(rt.id).length, 0) : 0;

  const ageMap: Record<string, number> = { "0–4": 0, "5–14": 0, "15–24": 0, "25–44": 0, "45–59": 0, "60+": 0 };
  scopedRT.forEach((rt) => {
    rt.kelompokUmur.forEach((k) => {
      ageMap[k.label] = (ageMap[k.label] ?? 0) + k.jumlah;
    });
  });

  const statCards = [
    { label: "Total Penduduk", value: `${totalWarga} jiwa`, icon: Users, color: "text-brand-700 bg-brand-50" },
    { label: "Jumlah KK", value: `${totalKK} KK`, icon: Home, color: "text-amber-700 bg-amber-50" },
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
            centerValue={totalWarga}
            segments={[
              { label: "Laki-laki", value: totalLaki, color: "#0891b2" },
              { label: "Perempuan", value: totalPerempuan, color: "#ec4899" },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
          <h2 className="mb-5 font-display text-base font-semibold text-ink-900">Sebaran Usia Penduduk</h2>
          <BarChart
            bars={Object.entries(ageMap).map(([label, value]) => ({ label, value }))}
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
        {scopedRT.map((rt) => (
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
            <p className="text-sm font-semibold text-ink-900">{rt.ketua}</p>
            <p className="text-xs text-ink-500 mb-3">Ketua RT</p>

            <div className="space-y-1.5 border-t border-line pt-3 text-xs text-ink-600">
              <div className="flex justify-between">
                <span>Penduduk:</span>
                <span className="font-semibold text-ink-900">{rt.jumlahWarga} jiwa</span>
              </div>
              <div className="flex justify-between">
                <span>Kepala Keluarga:</span>
                <span className="font-semibold text-ink-900">{rt.jumlahKK} KK</span>
              </div>
              <div className="flex justify-between">
                <span>UMKM Terdaftar:</span>
                <span className="font-semibold text-amber-700">{mounted ? getUMKMByRT(rt.id).length : "–"} Usaha</span>
              </div>
              <div className="flex justify-between">
                <span>Potensi RT:</span>
                <span className="font-semibold text-purple-700">{mounted ? getPotensiByRT(rt.id).length : "–"} Data</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
