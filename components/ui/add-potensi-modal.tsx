"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import type { RTPotensi as Potensi } from "@/lib/data/potensiData";

const KATEGORI_OPTIONS: Potensi["kategori"][] = [
  "Pertanian", "Peternakan", "Kerajinan", "Pariwisata", "Perdagangan", "Lainnya",
];

const KATEGORI_COLORS: Record<Potensi["kategori"], string> = {
  Pertanian:   "#16a34a",
  Peternakan:  "#0891b2",
  Kerajinan:   "#d97706",
  Pariwisata:  "#7c3aed",
  Perdagangan: "#dc2626",
  Lainnya:     "#64748b",
};

type Props = {
  // Boleh async; bila melempar error, dialog tetap terbuka dan menampilkan pesannya.
  onAdd: (potensi: Omit<Potensi, "id" | "rtId">) => void | Promise<void>;
  onClose: () => void;
  // When given, the dialog edits this entry instead of adding a new one.
  initial?: Potensi;
};

export function AddPotensiModal({ onAdd, onClose, initial }: Props) {
  const [judul, setJudul] = useState(initial?.judul ?? "");
  const [deskripsi, setDeskripsi] = useState(initial?.deskripsi ?? "");
  const [kategori, setKategori] = useState<Potensi["kategori"]>(initial?.kategori ?? "Pertanian");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!judul.trim()) { setError("Judul potensi wajib diisi."); return; }
    if (!deskripsi.trim()) { setError("Deskripsi wajib diisi."); return; }
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await onAdd({ judul: judul.trim(), deskripsi: deskripsi.trim(), kategori });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Potensi gagal disimpan.");
      setBusy(false);
    }
  }

  const inputCls = "w-full rounded-xl border border-line bg-cream-100 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-teal-500 focus:outline-none";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-4"
          style={{ background: "linear-gradient(135deg, #0e7490 0%, #0891b2 100%)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-100" />
            <h2 className="font-display text-base font-semibold text-white">{initial ? "Edit Potensi RT" : "Tambah Potensi RT"}</h2>
          </div>
          <button onClick={onClose} aria-label="Tutup dialog" className="rounded-full p-1.5 text-white/70 hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="potensi-judul" className={labelCls}>Judul Potensi *</label>
            <input id="potensi-judul" type="text" value={judul} onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Lahan Pertanian Padi Organik" required className={inputCls} />
          </div>

          <fieldset>
            <legend className={labelCls}>Kategori</legend>
            <div className="flex flex-wrap gap-2">
              {KATEGORI_OPTIONS.map((k) => (
                <button
                  key={k} type="button" onClick={() => setKategori(k)} aria-pressed={kategori === k}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    kategori === k
                      ? "border-transparent text-white shadow-sm"
                      : "border-line bg-cream-100 text-ink-600 hover:bg-cream"
                  }`}
                  style={kategori === k ? { backgroundColor: KATEGORI_COLORS[k] } : {}}
                >
                  {k}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="potensi-deskripsi" className={labelCls}>Deskripsi *</label>
            <textarea id="potensi-deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
              rows={4} required
              placeholder="Jelaskan potensi yang ada di RT ini, termasuk peluang pengembangan..."
              className={`${inputCls} resize-none`} />
          </div>

          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-cream-100 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={busy}
              className="flex flex-1 disabled:opacity-60 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: KATEGORI_COLORS[kategori] }}>
              <Sparkles className="h-4 w-4" />
              {busy ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Simpan Potensi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
