"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, Newspaper, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getNews, addNews, deleteNews, type RTNewsArticle } from "@/lib/newsService";
import { getRTById } from "@/lib/data/wilayahData";
import { useAuth } from "@/components/providers/auth-provider";
import { canManageWilayah } from "@/lib/auth";

const CATEGORIES = ["Pemerintahan", "Pembangunan", "Kegiatan Warga", "Ekonomi", "Pengumuman"] as const;
const IMAGE_TONES = ["green", "gold", "sky", "clay"] as const;

export default function RTBeritaPage() {
  const params = useParams();
  const rtId = params.id as string;
  const rt = getRTById(rtId);
  const { user } = useAuth();

  const [articles, setArticles] = useState<RTNewsArticle[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("Kegiatan Warga");
  const [imageTone, setImageTone] = useState<typeof IMAGE_TONES[number]>("green");

  useEffect(() => {
    const all = getNews();
    setArticles(all.filter((a) => a.rtScope === rtId));
    setMounted(true);
  }, [rtId, user]);

  const canManage = canManageWilayah(user, rtId);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) return;
    const newArticle = addNews({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.split("\n\n").filter(Boolean),
      category,
      imageTone,
      date: new Date().toISOString().slice(0, 10),
      author: user?.displayName ?? rt?.ketua ?? "Ketua RT",
      rtScope: rtId,
      createdBy: user?.username ?? rtId,
    });
    setArticles((prev) => [newArticle, ...prev]);
    setTitle(""); setExcerpt(""); setContent("");
    setShowForm(false);
  }

  function handleDelete(id: string) {
    if (!confirm("Hapus berita ini?")) return;
    deleteNews(id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-ink-500">
            {rt?.label} — Berita
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Berita {rt?.label}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Kelola berita dan pengumuman khusus {rt?.label}
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Berita Baru
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && canManage && (
        <div className="mb-8 rounded-2xl border border-line bg-paper p-6 shadow-sm">
          <h2 className="mb-5 font-display text-base font-semibold text-ink-900">
            Tambah Berita {rt?.label}
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Judul Berita</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                  placeholder="Contoh: Kegiatan Gotong Royong RT 01"
                  className="w-full rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])}
                  className="w-full rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Warna Gambar</label>
                <select value={imageTone} onChange={(e) => setImageTone(e.target.value as typeof IMAGE_TONES[number])}
                  className="w-full rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none">
                  {IMAGE_TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Ringkasan</label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} required
                  className="w-full resize-none rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink-700">
                  Konten (pisahkan paragraf dengan baris kosong)
                </label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} required
                  className="w-full resize-none rounded-xl border border-line bg-cream-100 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-cream-100 transition-colors">
                Batal
              </button>
              <button type="submit"
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors">
                Simpan Berita
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl border border-line bg-paper shadow-sm overflow-hidden">
        <div className="border-b border-line bg-cream-100 px-6 py-3">
          <p className="text-sm font-semibold text-ink-700">{mounted ? articles.length : "–"} artikel untuk {rt?.label}</p>
        </div>
        {mounted && articles.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Newspaper className="h-8 w-8 text-ink-300" />
            <p className="text-sm text-ink-500">Belum ada berita untuk {rt?.label}.</p>
          </div>
        )}
        <div className="divide-y divide-line">
          {articles.map((a) => (
            <div key={a.id ?? a.slug} className="flex items-center gap-4 px-6 py-4 hover:bg-cream-100 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    {a.category}
                  </span>
                  <span className="text-xs text-ink-400">{a.date}</span>
                </div>
                <p className="truncate text-sm font-semibold text-ink-900">{a.title}</p>
                <p className="text-xs text-ink-500">Oleh: {a.author}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/berita/${a.slug}`} target="_blank"
                  className="rounded-lg p-2 text-ink-400 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </Link>
                {canManage && (
                  <button onClick={() => handleDelete(a.id!)}
                    className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
