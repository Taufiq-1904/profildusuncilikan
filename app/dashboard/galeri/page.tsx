"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Images, Pencil, Plus, Trash2 } from "lucide-react";
import { Notice } from "@/components/dashboard/notice";
import {
  errorClass,
  fieldClass,
  hintClass,
  labelClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/dashboard/form-styles";
import { ImageField } from "@/components/dashboard/image-field";
import { useAuth } from "@/components/providers/auth-provider";
import { MediaImage } from "@/components/ui/media-image";
import { isDusun } from "@/lib/auth";
import { GALLERY_CATEGORIES, GALLERY_SPANS, type GalleryItem, type GallerySpan } from "@/lib/data/galleryData";
import { createPhoto, deletePhoto, updatePhoto } from "@/lib/galleryService";
import { useGallery, useGalleryReady } from "@/lib/hooks/use-directory";
import { cn } from "@/lib/utils";

type FormState = null | "new" | GalleryItem;

function PhotoForm({
  photo,
  defaultOrder,
  categories,
  onDone,
}: {
  photo?: GalleryItem;
  defaultOrder: number;
  categories: string[];
  onDone: () => void;
}) {
  const [title, setTitle] = useState(photo?.title ?? "");
  const [category, setCategory] = useState(photo?.category ?? GALLERY_CATEGORIES[0]);
  const [image, setImage] = useState<string | undefined>(photo?.image);
  const [span, setSpan] = useState<GallerySpan>(photo?.span ?? "normal");
  const [order, setOrder] = useState(String(photo?.order ?? defaultOrder));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save() {
    if (busy) return;
    setError("");
    setBusy(true);
    const input = { title, category, image: image ?? "", span, order: Number(order) };
    try {
      if (photo) await updatePhoto(photo.id, input);
      else await createPhoto(input);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Foto gagal disimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn(panelClass, "mb-6 p-6")}>
      <h2 className="font-display text-lg font-semibold text-ink-900">{photo ? "Edit Foto" : "Tambah Foto"}</h2>
      {error && <p role="alert" className={cn(errorClass, "mt-4")}>{error}</p>}

      <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="photo-title" className={labelClass}>Judul</label>
            <input id="photo-title" type="text" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="photo-category" className={labelClass}>Kategori</label>
            <input
              id="photo-category"
              type="text"
              list="photo-categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={fieldClass}
            />
            <datalist id="photo-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <p className={hintClass}>Pilih yang ada atau ketik kategori baru.</p>
          </div>
          <div>
            <label htmlFor="photo-span" className={labelClass}>Ukuran di galeri</label>
            <select id="photo-span" value={span} onChange={(e) => setSpan(e.target.value as GallerySpan)} className={fieldClass}>
              {GALLERY_SPANS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="photo-order" className={labelClass}>Urutan</label>
            <input id="photo-order" type="number" value={order} onChange={(e) => setOrder(e.target.value)} className={fieldClass} />
            <p className={hintClass}>Angka kecil tampil lebih dulu.</p>
          </div>
        </div>

        <ImageField
          label="Foto"
          value={image}
          onChange={setImage}
          onError={setError}
          folder="situs"
          maxWidth={1400}
          aspectClass="aspect-[4/3]"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onDone} disabled={busy} className={secondaryButtonClass}>Batal</button>
        <button type="button" onClick={save} disabled={busy} className={primaryButtonClass}>
          {busy ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}

export default function DashboardGaleriPage() {
  const { user } = useAuth();
  const items = useGallery();
  const ready = useGalleryReady();
  const [form, setForm] = useState<FormState>(null);
  const [error, setError] = useState("");

  if (!isDusun(user)) {
    return (
      <Notice
        message="Hanya akun Dusun yang dapat mengelola galeri."
        backHref="/dashboard"
        backLabel="Kembali ke ringkasan"
      />
    );
  }

  const categories = Array.from(new Set([...GALLERY_CATEGORIES, ...items.map((i) => i.category)]));
  const nextOrder = items.length === 0 ? 1 : Math.max(...items.map((i) => i.order)) + 1;

  async function handleDelete(item: GalleryItem) {
    if (!confirm(`Hapus foto "${item.title}"?`)) return;
    setError("");
    try {
      await deletePhoto(item.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Foto gagal dihapus.");
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Galeri Dusun</h1>
          <p className="mt-1 max-w-xl text-sm text-ink-500">
            Foto yang tampil di beranda (8 pertama) dan di halaman Galeri. Hanya akun Dusun yang dapat mengubahnya.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/galeri"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-cream-100"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Lihat halaman
          </Link>
          <button type="button" onClick={() => setForm("new")} className={primaryButtonClass}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah Foto
          </button>
        </div>
      </div>

      {error && <p role="alert" className={cn(errorClass, "mb-4")}>{error}</p>}

      {form && (
        <PhotoForm
          key={form === "new" ? "new" : form.id}
          photo={form === "new" ? undefined : form}
          defaultOrder={nextOrder}
          categories={categories}
          onDone={() => setForm(null)}
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
        <div className="border-b border-line bg-cream-100 px-6 py-3">
          <p className="text-sm font-semibold text-ink-700">{ready ? `${items.length} foto` : "Memuat…"}</p>
        </div>
        {ready && items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Images className="h-8 w-8 text-ink-300" aria-hidden="true" />
            <p className="text-sm text-ink-500">Belum ada foto. Tambahkan yang pertama.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {items.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-6 py-3">
                <MediaImage src={p.image} alt={p.title} sizes="80px" className="h-14 w-20 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{p.title}</p>
                  <p className="truncate text-xs text-ink-500">
                    {p.category} · urutan {p.order}
                    {p.span !== "normal" ? ` · ${p.span === "tall" ? "tinggi" : "lebar"}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => setForm(p)} aria-label={`Edit ${p.title}`} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => handleDelete(p)} aria-label={`Hapus ${p.title}`} className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-red-50 hover:text-red-500">
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
