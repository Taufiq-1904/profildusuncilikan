"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { uploadImage } from "@/lib/image-upload";
import { cn } from "@/lib/utils";
import { hintClass, labelClass } from "./form-styles";

const addTileClass =
  "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 text-sm text-ink-500 transition-colors hover:border-brand-500 hover:text-brand-700";

// Gambar dikecilkan lalu diunggah ke Supabase Storage; yang dikembalikan
// adalah URL publiknya (bukan data URL), jadi database tetap ringan.
async function readImage(file: File, maxWidth: number): Promise<string> {
  return uploadImage(file, "umum", maxWidth, 0.78);
}

export function ImageField({
  label,
  value,
  onChange,
  onError,
  maxWidth = 800,
  aspectClass = "aspect-square",
  hint,
}: {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  onError: (message: string) => void;
  maxWidth?: number;
  aspectClass?: string;
  hint?: string;
}) {
  const input = useRef<HTMLInputElement>(null);

  async function handle(file: File | undefined) {
    if (!file) return;
    try {
      onChange(await readImage(file, maxWidth));
    } catch (e) {
      onError(e instanceof Error ? e.message : "Gagal memproses gambar.");
    }
    if (input.current) input.current.value = "";
  }

  return (
    <div>
      <p className={labelClass}>{label}</p>
      {value ? (
        <div className="relative">
          <MediaImage src={value} alt={label} sizes="320px" className={cn(aspectClass, "w-full rounded-xl")} />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label={`Hapus ${label.toLowerCase()}`}
            className="absolute right-2 top-2 rounded-full bg-paper/90 p-1.5 text-ink-700 shadow-sm hover:text-red-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => input.current?.click()} className={cn(addTileClass, aspectClass, "w-full")}>
          <ImagePlus className="h-6 w-6" aria-hidden="true" />
          Unggah gambar
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={`Pilih file untuk ${label.toLowerCase()}`}
        onChange={(e) => handle(e.target.files?.[0])}
      />
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  );
}

export function GalleryField({
  label,
  values,
  onChange,
  onError,
  max,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  onError: (message: string) => void;
  max: number;
}) {
  const input = useRef<HTMLInputElement>(null);

  async function handle(files: FileList | null) {
    if (!files || files.length === 0) return;
    const next = [...values];
    for (const file of Array.from(files)) {
      if (next.length >= max) {
        onError(`Galeri maksimal ${max} foto.`);
        break;
      }
      try {
        next.push(await readImage(file, 900));
      } catch (e) {
        onError(e instanceof Error ? e.message : "Gagal memproses gambar.");
      }
    }
    onChange(next);
    if (input.current) input.current.value = "";
  }

  return (
    <div>
      <p className={labelClass}>
        {label} <span className="font-normal text-ink-500">({values.length}/{max})</span>
      </p>
      <ul className="grid grid-cols-3 gap-2">
        {values.map((src, i) => (
          <li key={i} className="relative">
            <MediaImage src={src} alt={`${label} ${i + 1}`} sizes="120px" className="aspect-square w-full rounded-lg" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              aria-label={`Hapus foto ${i + 1}`}
              className="absolute right-1 top-1 rounded-full bg-paper/90 p-1 text-ink-700 shadow-sm hover:text-red-600"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
        {values.length < max && (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              className={cn(addTileClass, "aspect-square w-full text-xs")}
            >
              <ImagePlus className="h-5 w-5" aria-hidden="true" />
              Tambah
            </button>
          </li>
        )}
      </ul>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-label={`Pilih file untuk ${label.toLowerCase()}`}
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  );
}
