"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Plus, Store, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { errorClass, primaryButtonClass } from "@/components/dashboard/form-styles";
import { MediaImage } from "@/components/ui/media-image";
import { getManageableWilayah } from "@/lib/auth";
import { getRTWithRWLabel } from "@/lib/data/wilayahData";
import { useUmkm } from "@/lib/hooks/use-directory";
import { deleteUmkm, selectManageableUmkm, setUmkmActive } from "@/lib/umkmService";
import { cn } from "@/lib/utils";

type StatusFilter = "semua" | "aktif" | "nonaktif";

const statusTabs: { key: StatusFilter; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "aktif", label: "Aktif" },
  { key: "nonaktif", label: "Nonaktif" },
];

export default function DashboardUmkmPage() {
  const { user } = useAuth();
  const all = useUmkm();
  const [status, setStatus] = useState<StatusFilter>("semua");
  const [rt, setRt] = useState("semua");
  const [error, setError] = useState("");

  const rtOptions = useMemo(() => getManageableWilayah(user).filter((w) => w.level === "rt"), [user]);
  const manageable = useMemo(() => selectManageableUmkm(all, user), [all, user]);
  const visible = manageable.filter(
    (u) =>
      (status === "semua" || (status === "aktif" ? u.aktif : !u.aktif)) && (rt === "semua" || u.rtId === rt)
  );

  async function run(action: () => Promise<unknown>) {
    setError("");
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tindakan gagal.");
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Kelola UMKM</h1>
          <p className="mt-1 text-sm text-ink-500">
            {user?.role === "dusun"
              ? "Semua UMKM di seluruh RT."
              : user?.role === "rw"
                ? "UMKM di RT dalam RW Anda."
                : "UMKM di RT Anda."}
          </p>
        </div>
        <Link href="/dashboard/umkm/baru" className={primaryButtonClass}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          UMKM Baru
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2" role="group" aria-label="Filter status">
          {statusTabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setStatus(t.key)}
              aria-pressed={status === t.key}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                status === t.key ? "bg-brand-600 text-white" : "border border-line bg-paper text-ink-700 hover:bg-cream-100"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {rtOptions.length > 1 && (
          <label className="flex items-center gap-2 text-sm text-ink-500">
            <span className="shrink-0">RT</span>
            <select
              value={rt}
              onChange={(e) => setRt(e.target.value)}
              className="rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none"
            >
              <option value="semua">Semua</option>
              {rtOptions.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {error && (
        <p role="alert" className={cn(errorClass, "mb-4")}>
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
        <div className="border-b border-line bg-cream-100 px-6 py-3">
          <p className="text-sm font-semibold text-ink-700">{visible.length} UMKM</p>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Store className="h-8 w-8 text-ink-300" aria-hidden="true" />
            <p className="text-sm text-ink-500">Belum ada UMKM untuk filter ini.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((u) => (
              <li key={u.id} className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center">
                <MediaImage src={u.galeri[0] ?? u.logo} alt={u.nama} icon="package" tone="gold" sizes="56px" className="h-14 w-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className={cn("rounded-full px-2.5 py-0.5 font-semibold", u.aktif ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700")}>
                      {u.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                    <span className="rounded-full bg-cream-100 px-2.5 py-0.5 font-semibold text-ink-700">
                      {getRTWithRWLabel(u.rtId)}
                    </span>
                    <span className="text-ink-500">{u.jenis}</span>
                  </div>
                  <p className="truncate text-sm font-semibold text-ink-900">{u.nama}</p>
                  {u.pemilik && <p className="text-xs text-ink-500">Pemilik: {u.pemilik}</p>}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => run(() => setUmkmActive(u.id, !u.aktif))}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    {u.aktif ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <Link href={`/umkm/${u.slug}`} target="_blank" aria-label={`Lihat ${u.nama}`} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600">
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link href={`/dashboard/umkm/${u.id}`} aria-label={`Edit ${u.nama}`} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => confirm(`Hapus UMKM "${u.nama}"?`) && run(() => deleteUmkm(u.id))}
                    aria-label={`Hapus ${u.nama}`}
                    className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
