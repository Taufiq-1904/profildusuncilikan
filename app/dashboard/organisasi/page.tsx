"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { errorClass, primaryButtonClass } from "@/components/dashboard/form-styles";
import { MediaImage } from "@/components/ui/media-image";
import { getManageableWilayah } from "@/lib/auth";
import { getOrganizationFieldName } from "@/lib/data/organizationData";
import { getWilayahLabel } from "@/lib/data/wilayahData";
import { useOrganizations } from "@/lib/hooks/use-directory";
import { deleteOrganization, selectManageableOrganizations } from "@/lib/organizationService";
import { cn } from "@/lib/utils";

export default function DashboardOrganisasiPage() {
  const { user } = useAuth();
  const all = useOrganizations();
  const [wilayah, setWilayah] = useState("semua");
  const [error, setError] = useState("");

  const destinations = useMemo(() => getManageableWilayah(user), [user]);
  const manageable = useMemo(() => selectManageableOrganizations(all, user), [all, user]);
  const visible = manageable.filter((o) => wilayah === "semua" || o.wilayahId === wilayah);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus organisasi "${name}"?`)) return;
    setError("");
    try {
      await deleteOrganization(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Organisasi gagal dihapus.");
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Kelola Organisasi & Komunitas</h1>
          <p className="mt-1 text-sm text-ink-500">
            {user?.role === "dusun"
              ? "Semua organisasi di dusun, RW, dan RT."
              : user?.role === "rw"
                ? "Organisasi RW Anda dan RT di bawahnya."
                : "Organisasi di RT Anda."}
          </p>
        </div>
        <Link href="/dashboard/organisasi/baru" className={primaryButtonClass}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Organisasi Baru
        </Link>
      </div>

      {destinations.length > 1 && (
        <label className="mb-4 flex items-center gap-2 text-sm text-ink-500">
          <span className="shrink-0">Wilayah</span>
          <select
            value={wilayah}
            onChange={(e) => setWilayah(e.target.value)}
            className="rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none"
          >
            <option value="semua">Semua</option>
            {destinations.map((w) => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
        </label>
      )}

      {error && (
        <p role="alert" className={cn(errorClass, "mb-4")}>
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
        <div className="border-b border-line bg-cream-100 px-6 py-3">
          <p className="text-sm font-semibold text-ink-700">{visible.length} organisasi</p>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Users className="h-8 w-8 text-ink-300" aria-hidden="true" />
            <p className="text-sm text-ink-500">Belum ada organisasi untuk filter ini.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((o) => (
              <li key={o.id} className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center">
                <MediaImage src={o.logo} alt={`Logo ${o.name}`} icon="users" fit="contain" sizes="56px" className="h-14 w-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-700">
                      {getOrganizationFieldName(o.fieldId)}
                    </span>
                    <span className="rounded-full bg-cream-100 px-2.5 py-0.5 font-semibold text-ink-700">
                      {getWilayahLabel(o.wilayahId)}
                    </span>
                    {o.members?.length ? (
                      <span className="text-ink-500">{o.members.length} pengurus</span>
                    ) : (
                      <span className="text-ink-500">Profil saja</span>
                    )}
                  </div>
                  <p className="truncate text-sm font-semibold text-ink-900">{o.name}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Link href={`/organisasi/${o.slug}`} target="_blank" aria-label={`Lihat ${o.name}`} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600">
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link href={`/dashboard/organisasi/${o.id}`} aria-label={`Edit ${o.name}`} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <button type="button" onClick={() => handleDelete(o.id, o.name)} aria-label={`Hapus ${o.name}`} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-red-50 hover:text-red-500">
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
