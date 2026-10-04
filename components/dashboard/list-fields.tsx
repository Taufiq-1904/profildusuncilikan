"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { TimelineEntry } from "@/lib/data/siteSettingsData";
import { cn } from "@/lib/utils";
import { fieldClass, hintClass, labelClass, secondaryButtonClass } from "./form-styles";

const iconButtonClass =
  "rounded-lg p-2 text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-30";

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function RowControls({
  index,
  count,
  noun,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  noun: string;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <button
        type="button"
        onClick={() => onMove(index - 1)}
        disabled={index === 0}
        aria-label={`Naikkan ${noun} ${index + 1}`}
        className={iconButtonClass}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onMove(index + 1)}
        disabled={index === count - 1}
        aria-label={`Turunkan ${noun} ${index + 1}`}
        className={iconButtonClass}
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Hapus ${noun} ${index + 1}`}
        className={cn(iconButtonClass, "hover:bg-red-50 hover:text-red-500")}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// Daftar butir teks (misi, keunggulan): tambah, hapus, dan ubah urutan.
// Butir yang dibiarkan kosong dibuang otomatis saat disimpan.
export function TextListField({
  idPrefix,
  label,
  noun,
  values,
  onChange,
  max,
  placeholder,
  hint,
}: {
  idPrefix: string;
  label: string;
  // Sebutan satu butir untuk label aksesibilitas, mis. "misi".
  noun: string;
  values: string[];
  onChange: (values: string[]) => void;
  max: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>
        {label} <span className="font-normal text-ink-500">({values.length}/{max})</span>
      </legend>
      <ul className="space-y-2">
        {values.map((value, i) => (
          <li key={i} className="flex items-start gap-1">
            <textarea
              id={`${idPrefix}-${i}`}
              aria-label={`${noun} ${i + 1}`}
              rows={2}
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(values.map((v, idx) => (idx === i ? e.target.value : v)))}
              className={cn(fieldClass, "min-w-0 flex-1")}
            />
            <RowControls
              index={i}
              count={values.length}
              noun={noun}
              onMove={(to) => onChange(move(values, i, to))}
              onRemove={() => onChange(values.filter((_, idx) => idx !== i))}
            />
          </li>
        ))}
      </ul>
      {values.length < max && (
        <button type="button" onClick={() => onChange([...values, ""])} className={cn(secondaryButtonClass, "mt-3")}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah {noun}
        </button>
      )}
      {hint && <p className={hintClass}>{hint}</p>}
    </fieldset>
  );
}

// Linimasa sejarah: tiap peristiwa punya Tahun/Masa, Judul, dan Uraian.
export function TimelineField({
  idPrefix,
  values,
  onChange,
  max,
}: {
  idPrefix: string;
  values: TimelineEntry[];
  onChange: (values: TimelineEntry[]) => void;
  max: number;
}) {
  function patch(i: number, change: Partial<TimelineEntry>) {
    onChange(values.map((v, idx) => (idx === i ? { ...v, ...change } : v)));
  }

  return (
    <fieldset>
      <legend className={labelClass}>
        Linimasa sejarah <span className="font-normal text-ink-500">({values.length}/{max})</span>
      </legend>
      <ol className="space-y-3">
        {values.map((entry, i) => (
          <li key={i} className="rounded-xl border border-line bg-cream-100/60 p-4">
            <div className="flex items-start gap-1">
              <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[160px_minmax(0,1fr)]">
                <div>
                  <label htmlFor={`${idPrefix}-${i}-year`} className={labelClass}>Tahun / masa</label>
                  <input
                    id={`${idPrefix}-${i}-year`}
                    type="text"
                    value={entry.year}
                    placeholder="1985"
                    onChange={(e) => patch(i, { year: e.target.value })}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor={`${idPrefix}-${i}-title`} className={labelClass}>Judul</label>
                  <input
                    id={`${idPrefix}-${i}-title`}
                    type="text"
                    value={entry.title}
                    onChange={(e) => patch(i, { title: e.target.value })}
                    className={fieldClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`${idPrefix}-${i}-desc`} className={labelClass}>Uraian</label>
                  <textarea
                    id={`${idPrefix}-${i}-desc`}
                    rows={3}
                    value={entry.description}
                    onChange={(e) => patch(i, { description: e.target.value })}
                    className={fieldClass}
                  />
                </div>
              </div>
              <RowControls
                index={i}
                count={values.length}
                noun="peristiwa"
                onMove={(to) => onChange(move(values, i, to))}
                onRemove={() => onChange(values.filter((_, idx) => idx !== i))}
              />
            </div>
          </li>
        ))}
      </ol>
      {values.length < max && (
        <button
          type="button"
          onClick={() => onChange([...values, { year: "", title: "", description: "" }])}
          className={cn(secondaryButtonClass, "mt-3")}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah peristiwa
        </button>
      )}
      <p className={hintClass}>Urutkan dari yang paling lama ke yang paling baru. Peristiwa yang kosong dibuang saat disimpan.</p>
    </fieldset>
  );
}
