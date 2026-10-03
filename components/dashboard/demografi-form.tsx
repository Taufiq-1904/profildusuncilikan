"use client";

import { useState } from "react";
import { AGE_GROUPS, sumUmur, type Demografi } from "@/lib/data/demografiData";
import { saveDemografi } from "@/lib/demografiService";
import {
  errorClass,
  fieldClass,
  hintClass,
  labelClass,
  panelClass,
  primaryButtonClass,
} from "./form-styles";

type Props = {
  rtId: string;
  rtLabel: string;
  // Data yang sudah tersimpan; undefined bila RT ini belum pernah mengisi.
  initial?: Demografi;
};

// Angka dipegang sebagai teks selama diketik, supaya kolom boleh kosong
// sementara dan "0" di depan tidak mengganggu.
const toText = (n?: number) => (n === undefined ? "" : String(n));
const toNumber = (text: string) => (text.trim() === "" ? 0 : Number(text));

export function DemografiForm({ rtId, rtLabel, initial }: Props) {
  const [laki, setLaki] = useState(toText(initial?.laki));
  const [perempuan, setPerempuan] = useState(toText(initial?.perempuan));
  const [kk, setKk] = useState(toText(initial?.jumlahKK));
  const [umur, setUmur] = useState(AGE_GROUPS.map((_, i) => toText(initial?.kelompokUmur[i])));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const warga = toNumber(laki) + toNumber(perempuan);
  const umurTotal = sumUmur(umur.map(toNumber));

  function touch() {
    setSaved(false);
    setError("");
  }

  function setUmurAt(index: number, value: string) {
    touch();
    setUmur((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    touch();
    setSaving(true);
    try {
      await saveDemografi(rtId, {
        jumlahKK: toNumber(kk),
        laki: toNumber(laki),
        perempuan: toNumber(perempuan),
        kelompokUmur: umur.map(toNumber),
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Data kependudukan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  const numberProps = { type: "number", min: 0, step: 1, inputMode: "numeric" as const, className: fieldClass };

  return (
    <form onSubmit={handleSubmit} className={panelClass}>
      <h2 className="font-display text-base font-semibold text-ink-900">Data Kependudukan {rtLabel}</h2>
      <p className={hintClass}>
        Isi dengan angka jumlah saja, bukan data per orang. Kelompok usia boleh dikosongkan, tetapi kalau diisi
        jumlahnya harus sama dengan total penduduk.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="demografi-laki" className={labelClass}>Laki-laki</label>
          <input id="demografi-laki" {...numberProps} value={laki} onChange={(e) => { touch(); setLaki(e.target.value); }} />
        </div>
        <div>
          <label htmlFor="demografi-perempuan" className={labelClass}>Perempuan</label>
          <input id="demografi-perempuan" {...numberProps} value={perempuan} onChange={(e) => { touch(); setPerempuan(e.target.value); }} />
        </div>
        <div>
          <label htmlFor="demografi-kk" className={labelClass}>Kepala keluarga</label>
          <input id="demografi-kk" {...numberProps} value={kk} onChange={(e) => { touch(); setKk(e.target.value); }} />
        </div>
      </div>
      <p className={hintClass}>Total penduduk: {warga} jiwa</p>

      <p className={`${labelClass} mt-6`}>Kelompok usia (tahun)</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {AGE_GROUPS.map((group, i) => (
          <div key={group}>
            <label htmlFor={`demografi-umur-${i}`} className="mb-1 block text-xs text-ink-500">{group}</label>
            <input
              id={`demografi-umur-${i}`}
              {...numberProps}
              value={umur[i]}
              onChange={(e) => setUmurAt(i, e.target.value)}
            />
          </div>
        ))}
      </div>
      <p className={hintClass}>Jumlah kelompok usia: {umurTotal} jiwa</p>

      {error && (
        <p role="alert" className={`${errorClass} mt-4`}>
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          Data kependudukan tersimpan.
        </p>
      )}

      <div className="mt-5">
        <button type="submit" disabled={saving} className={primaryButtonClass}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
