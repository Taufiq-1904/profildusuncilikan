"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { createOfficial, updateOfficial, type DusunOfficial } from "@/lib/dusunOfficialService";
import { getHeadTitle, getWilayahLabel } from "@/lib/data/wilayahData";
import { cn } from "@/lib/utils";
import { errorClass, fieldClass, hintClass, labelClass, panelClass, primaryButtonClass, secondaryButtonClass } from "./form-styles";
import { ImageField } from "./image-field";

// Jabatan yang dipakai situs untuk mengisi kolom pengurus di halaman RT.
// Pencocokannya dari awal teks jabatan, jadi tulisan "Sekretaris RT 01" terbaca.
const QUICK_POSITIONS = ["Sekretaris", "Bendahara"];

function positionFor(wanted: string | undefined, ownerId: string, isHead: boolean): string {
  if (isHead) return getHeadTitle(ownerId);
  if (!wanted) return "";
  return `${wanted} ${getWilayahLabel(ownerId)}`;
}

// Add/edit form for one person on the dusun chart. The parent gives it a
// `key`, so switching between people always starts from a clean state.
export function OfficialForm({
  ownerId,
  official,
  defaultPosition,
  defaultHead = false,
  defaultTier,
  defaultOrder,
  onDone,
}: {
  // Wilayah pemilik struktur yang sedang diisi ("dusun", "rw09", "rt01").
  ownerId: string;
  official?: DusunOfficial;
  defaultPosition?: string;
  defaultHead?: boolean;
  defaultTier: number;
  defaultOrder: number;
  onDone: () => void;
}) {
  const { user } = useAuth();
  const [name, setName] = useState(official?.name ?? "");
  const [position, setPosition] = useState(official?.position ?? positionFor(defaultPosition, ownerId, defaultHead));
  const [period, setPeriod] = useState(official?.period ?? "");
  const [isHead, setIsHead] = useState(official ? Boolean(official.wilayahId) : defaultHead);
  const [tier, setTier] = useState(String(official?.tier ?? defaultTier));
  const [order, setOrder] = useState(String(official?.order ?? defaultOrder));
  const [photo, setPhoto] = useState(official?.photo);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save() {
    if (busy) return;
    setError("");
    setBusy(true);
    const input = { name, position, period, photo, ownerId, wilayahId: isHead ? ownerId : undefined, tier: Number(tier), order: Number(order) };
    try {
      if (official) await updateOfficial(official.id, input);
      else await createOfficial(input);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Data gagal disimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn(panelClass, "mb-6 p-6")}>
      <h2 className="font-display text-lg font-semibold text-ink-900">
        {official ? "Edit Jabatan" : "Tambah Jabatan"}
      </h2>
      <p className="mt-1 text-sm text-ink-500">Struktur {getWilayahLabel(ownerId)} · disimpan oleh {user?.displayName}.</p>

      {error && (
        <p role="alert" className={cn(errorClass, "mt-4")}>
          {error}
        </p>
      )}

      <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_200px]">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="off-name" className={labelClass}>Nama</label>
            <input id="off-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="off-position" className={labelClass}>Jabatan</label>
            <input id="off-position" type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Contoh: Sekretaris RT 01" className={fieldClass} />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink-500">Isi cepat:</span>
              {QUICK_POSITIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setPosition(positionFor(q, ownerId, false))}
                  className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {q}
                </button>
              ))}
            </div>
            <p className={hintClass}>
              Awali jabatan dengan kata Sekretaris atau Bendahara agar namanya tampil di kolom pengurus halaman RT.
            </p>
          </div>
          <div>
            <label htmlFor="off-period" className={labelClass}>Periode <span className="font-normal text-ink-500">(opsional)</span></label>
            <input id="off-period" type="text" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="2021 – 2027" className={fieldClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-start gap-3 text-sm text-ink-800">
              <input
                type="checkbox"
                checked={isHead}
                onChange={(e) => {
                  setIsHead(e.target.checked);
                  if (e.target.checked && !position.trim()) setPosition(getHeadTitle(ownerId));
                }}
                className="mt-0.5 h-4 w-4 rounded border-line"
              />
              <span>
                <span className="font-semibold">Ini {getHeadTitle(ownerId)}</span>
                <span className="block text-xs text-ink-500">
                  Nama dan periodenya tampil otomatis di beranda, halaman Pemerintahan, tabel RT, dan dashboard.
                  Saat pergantian periode, cukup ganti nama dan periode pada baris ini.
                </span>
              </span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="off-tier" className={labelClass}>Baris</label>
              <input id="off-tier" type="number" min={1} value={tier} onChange={(e) => setTier(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="off-order" className={labelClass}>Urutan</label>
              <input id="off-order" type="number" min={1} value={order} onChange={(e) => setOrder(e.target.value)} className={fieldClass} />
            </div>
          </div>
          <p className={cn(hintClass, "sm:col-span-2")}>
            Baris 1 tampil paling atas pada bagan. Urutan mengatur posisi dari kiri ke kanan dalam satu baris.
          </p>
        </div>

        <ImageField label="Foto" value={photo} onChange={setPhoto} onError={setError} maxWidth={400} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onDone} disabled={busy} className={secondaryButtonClass}>Batal</button>
        <button type="button" onClick={save} disabled={busy} className={primaryButtonClass}>{busy ? "Menyimpan..." : "Simpan"}</button>
      </div>
    </div>
  );
}
