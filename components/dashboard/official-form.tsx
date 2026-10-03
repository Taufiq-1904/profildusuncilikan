"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { createOfficial, updateOfficial, type DusunOfficial } from "@/lib/dusunOfficialService";
import { cn } from "@/lib/utils";
import { errorClass, fieldClass, hintClass, labelClass, panelClass, primaryButtonClass, secondaryButtonClass } from "./form-styles";
import { ImageField } from "./image-field";

// Add/edit form for one person on the dusun chart. The parent gives it a
// `key`, so switching between people always starts from a clean state.
export function OfficialForm({
  official,
  defaultTier,
  defaultOrder,
  onDone,
}: {
  official?: DusunOfficial;
  defaultTier: number;
  defaultOrder: number;
  onDone: () => void;
}) {
  const { user } = useAuth();
  const [name, setName] = useState(official?.name ?? "");
  const [position, setPosition] = useState(official?.position ?? "");
  const [period, setPeriod] = useState(official?.period ?? "");
  const [tier, setTier] = useState(String(official?.tier ?? defaultTier));
  const [order, setOrder] = useState(String(official?.order ?? defaultOrder));
  const [photo, setPhoto] = useState(official?.photo);
  const [error, setError] = useState("");

  function save() {
    setError("");
    const input = { name, position, period, photo, tier: Number(tier), order: Number(order) };
    try {
      if (official) updateOfficial(official.id, input);
      else createOfficial(input);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Data gagal disimpan.");
    }
  }

  return (
    <div className={cn(panelClass, "mb-6 p-6")}>
      <h2 className="font-display text-lg font-semibold text-ink-900">
        {official ? "Edit Jabatan" : "Tambah Jabatan"}
      </h2>
      <p className="mt-1 text-sm text-ink-500">Disimpan oleh {user?.displayName}.</p>

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
            <input id="off-position" type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Contoh: Sekretaris Dusun" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="off-period" className={labelClass}>Periode <span className="font-normal text-ink-500">(opsional)</span></label>
            <input id="off-period" type="text" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="2021 – 2027" className={fieldClass} />
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
        <button type="button" onClick={onDone} className={secondaryButtonClass}>Batal</button>
        <button type="button" onClick={save} className={primaryButtonClass}>Simpan</button>
      </div>
    </div>
  );
}
