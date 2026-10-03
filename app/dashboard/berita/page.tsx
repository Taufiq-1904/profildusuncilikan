"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ExternalLink, Newspaper, Pencil, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { NewsCover } from "@/components/news/news-cover";
import { getManageableWilayah } from "@/lib/auth";
import { getCategoryName } from "@/lib/data/newsData";
import { getWilayahLabel } from "@/lib/data/wilayahData";
import { useNews } from "@/lib/hooks/use-news";
import { deleteNews, selectManageable, setNewsStatus } from "@/lib/newsService";
import { cn, formatDate } from "@/lib/utils";

type StatusFilter = "semua" | "published" | "draft";

const statusTabs: { key: StatusFilter; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "published", label: "Terbit" },
  { key: "draft", label: "Draft" },
];

function BeritaList() {
  const { user } = useAuth();
  const all = useNews();
  const params = useSearchParams();
  const [status, setStatus] = useState<StatusFilter>("semua");
  const [wilayah, setWilayah] = useState(params.get("wilayah") ?? "semua");
  const [error, setError] = useState("");

  const destinations = useMemo(() => getManageableWilayah(user), [user]);
  const manageable = useMemo(() => selectManageable(all, user), [all, user]);

  const visible = manageable.filter(
    (a) => (status === "semua" || a.status === status) && (wilayah === "semua" || a.wilayahId === wilayah)
  );

  function run(action: () => void) {
    setError("");
    try {
      action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tindakan gagal.");
    }
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus berita "${title}"?`)) return;
    run(() => deleteNews(id));
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Kelola Berita</h1>
          <p className="mt-1 text-sm text-ink-500">
            {user?.role === "dusun"
              ? "Semua berita dusun, RW, dan RT."
              : user?.role === "rw"
                ? "Berita RW Anda dan RT di bawahnya."
                : "Berita untuk RT Anda."}
          </p>
        </div>
        <Link
          href="/dashboard/berita/baru"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Berita Baru
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
                status === t.key
                  ? "bg-brand-600 text-white"
                  : "border border-line bg-paper text-ink-600 hover:bg-cream-100"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {destinations.length > 1 && (
          <label className="flex items-center gap-2 text-sm text-ink-500">
            <span className="shrink-0">Penerbit</span>
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
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
        <div className="border-b border-line bg-cream-100 px-6 py-3">
          <p className="text-sm font-semibold text-ink-700">{visible.length} berita</p>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Newspaper className="h-8 w-8 text-ink-300" aria-hidden="true" />
            <p className="text-sm text-ink-500">Belum ada berita untuk filter ini.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((a) => (
              <li key={a.id} className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center">
                <NewsCover
                  article={a}
                  className="aspect-[16/10] w-full shrink-0 rounded-lg sm:w-28"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 font-semibold",
                        a.status === "published" ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {a.status === "published" ? "Terbit" : "Draft"}
                    </span>
                    <span className="rounded-full bg-cream-100 px-2.5 py-0.5 font-semibold text-ink-700">
                      {getWilayahLabel(a.wilayahId)}
                    </span>
                    <span className="text-ink-500">{getCategoryName(a.categoryId)}</span>
                    <span className="text-ink-500">{formatDate(a.publishedAt)}</span>
                  </div>
                  <p className="truncate text-sm font-semibold text-ink-900">{a.title}</p>
                  <p className="text-xs text-ink-500">Penulis: {a.authorName}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      run(() => setNewsStatus(a.id, a.status === "published" ? "draft" : "published"))
                    }
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    {a.status === "published" ? "Tarik ke draft" : "Terbitkan"}
                  </button>
                  <Link
                    href={`/berita/${a.slug}`}
                    target="_blank"
                    aria-label={`Lihat ${a.title}`}
                    className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={`/dashboard/berita/${a.id}`}
                    aria-label={`Edit ${a.title}`}
                    className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(a.id, a.title)}
                    aria-label={`Hapus ${a.title}`}
                    className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-500"
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

export default function DashboardBeritaPage() {
  return (
    <Suspense fallback={null}>
      <BeritaList />
    </Suspense>
  );
}
