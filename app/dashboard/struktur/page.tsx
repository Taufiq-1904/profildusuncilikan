"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Network, Pencil, Plus, Trash2 } from "lucide-react";
import { Notice } from "@/components/dashboard/notice";
import { OfficialForm } from "@/components/dashboard/official-form";
import { errorClass, primaryButtonClass } from "@/components/dashboard/form-styles";
import { useAuth } from "@/components/providers/auth-provider";
import { getManageableWilayah } from "@/lib/auth";
import { groupOfficialsByTier, officialsOf, type DusunOfficial } from "@/lib/data/dusunOfficialsData";
import { getHeadTitle, getWilayahLabel } from "@/lib/data/wilayahData";
import { canManageStructure, deleteOfficial } from "@/lib/dusunOfficialService";
import { useDusunOfficials } from "@/lib/hooks/use-directory";
import { cn } from "@/lib/utils";

// null = form closed, "new" = adding, otherwise the person being edited.
type FormState = null | "new" | DusunOfficial;

export default function DashboardStrukturPage() {
  const { user } = useAuth();
  const all = useDusunOfficials();
  const [picked, setPicked] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(null);
  const [error, setError] = useState("");

  // Wilayah yang boleh diisi akun ini: Dusun = semuanya, RW = RW-nya + RT di
  // bawahnya, RT = RT-nya saja. Yang pertama adalah wilayah akun itu sendiri.
  const scopes = getManageableWilayah(user);
  if (scopes.length === 0) {
    return (
      <Notice
        message="Akun ini tidak memiliki wilayah yang dapat dikelola."
        backHref="/dashboard"
        backLabel="Kembali ke ringkasan"
      />
    );
  }

  const scope = scopes.find((s) => s.id === picked)?.id ?? scopes[0].id;
  const tiers = groupOfficialsByTier(officialsOf(all, scope));
  const lastTier = tiers[tiers.length - 1];
  const nextTier = lastTier ? lastTier.tier : 1;
  const nextOrder = (lastTier ? Math.max(...lastTier.people.map((p) => p.order)) : 0) + 1;

  function choose(id: string) {
    setPicked(id);
    setForm(null);
    setError("");
  }

  async function handleDelete(person: DusunOfficial) {
    if (!confirm(`Hapus ${person.name} dari struktur ${getWilayahLabel(person.ownerId)}?`)) return;
    setError("");
    try {
      await deleteOfficial(person.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Data gagal dihapus.");
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Struktur Organisasi</h1>
          <p className="mt-1 max-w-xl text-sm text-ink-500">
            Setiap wilayah punya bagan sendiri: akun Dusun mengisi struktur dusun, akun RW mengisi struktur RW-nya,
            akun RT mengisi struktur RT-nya. Pergantian periode: klik Edit pada jabatannya lalu ganti nama dan periode.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/profil/struktur"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-cream-100"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Lihat halaman
          </Link>
          <button type="button" onClick={() => setForm("new")} className={primaryButtonClass}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah Jabatan
          </button>
        </div>
      </div>

      {scopes.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Pilih wilayah">
          {scopes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => choose(s.id)}
              aria-pressed={s.id === scope}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                s.id === scope
                  ? "bg-brand-700 text-white shadow-sm"
                  : "border border-line bg-paper text-ink-600 hover:bg-brand-50 hover:text-brand-700"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <p className="mb-4 text-sm font-semibold text-ink-700">Struktur {getWilayahLabel(scope)}</p>

      {error && (
        <p role="alert" className={cn(errorClass, "mb-4")}>
          {error}
        </p>
      )}

      {form && (
        <OfficialForm
          key={`${scope}-${form === "new" ? "new" : form.id}`}
          ownerId={scope}
          official={form === "new" ? undefined : form}
          defaultTier={nextTier}
          defaultOrder={nextOrder}
          onDone={() => setForm(null)}
        />
      )}

      {tiers.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-paper py-16 text-center shadow-sm">
          <Network className="h-8 w-8 text-ink-300" aria-hidden="true" />
          <p className="text-sm text-ink-500">Belum ada jabatan di {getWilayahLabel(scope)}. Tambahkan yang pertama.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tiers.map(({ tier, people }) => (
            <section key={tier} className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm" aria-label={`Baris ${tier}`}>
              <div className="border-b border-line bg-cream-100 px-6 py-3">
                <p className="text-sm font-semibold text-ink-700">Baris {tier}</p>
              </div>
              <ul className="divide-y divide-line">
                {people.map((p) => (
                  <li key={p.id} className="flex items-center gap-4 px-6 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700" aria-label={`Urutan ${p.order}`}>
                      {p.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {p.name}
                        {p.wilayahId && (
                          <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 align-middle text-[11px] font-semibold text-brand-700">
                            {getHeadTitle(p.wilayahId)}
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-ink-500">
                        {p.position}
                        {p.period ? ` · ${p.period}` : ""}
                      </p>
                    </div>
                    {canManageStructure(user, p.ownerId) && (
                      <div className="flex shrink-0 items-center gap-1">
                        <button type="button" onClick={() => setForm(p)} aria-label={`Edit ${p.name}`} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600">
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => handleDelete(p)} aria-label={`Hapus ${p.name}`} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
