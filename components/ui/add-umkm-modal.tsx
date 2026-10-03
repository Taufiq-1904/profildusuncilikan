"use client";

import { useState } from "react";
import { X, Store } from "lucide-react";
import type { UMKM } from "@/lib/data/umkmData";

const JENIS_OPTIONS = [
  "Kuliner", "Perdagangan", "Pengolahan Pangan", "Kerajinan",
  "Otomotif", "Peternakan", "Pertanian", "Jasa", "Lainnya",
];

type Props = {
  onAdd: (umkm: Omit<UMKM, "id" | "rtId">) => void;
  onClose: () => void;
};

export function AddUMKMModal({ onAdd, onClose }: Props) {
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState(JENIS_OPTIONS[0]);
  const [jenisCustom, setJenisCustom] = useState("");
  const [pemilik, setPemilik] = useState("");
  const [kontak, setKontak] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [produk, setProduk] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) { setError("Nama UMKM wajib diisi."); return; }
    if (!pemilik.trim()) { setError("Nama pemilik wajib diisi."); return; }
    onAdd({
      nama: nama.trim(),
      jenis: jenis === "Lainnya" ? jenisCustom.trim() || "Lainnya" : jenis,
      pemilik: pemilik.trim(),
      kontak: kontak.trim() || undefined,
      deskripsi: deskripsi.trim() || undefined,
      produk: produk.trim() || undefined,
    });
    onClose();
  }

  const inputCls = "w-full rounded-xl border border-line bg-cream-100 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-amber-500 focus:outline-none";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-4"
          style={{ background: "linear-gradient(135deg, #b45309 0%, #d97706 100%)" }}>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-amber-100" />
            <h2 className="font-display text-base font-semibold text-white">Tambah Data UMKM</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-white/70 hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className={labelCls}>Nama UMKM *</label>
            <input type="text" value={nama} onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Warung Bu Siti" required className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Jenis Usaha</label>
              <select value={jenis} onChange={(e) => setJenis(e.target.value)} className={inputCls}>
                {JENIS_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            {jenis === "Lainnya" && (
              <div>
                <label className={labelCls}>Jenis (isi manual)</label>
                <input type="text" value={jenisCustom} onChange={(e) => setJenisCustom(e.target.value)}
                  placeholder="Sebutkan jenis..." className={inputCls} />
              </div>
            )}
            <div>
              <label className={labelCls}>Nama Pemilik *</label>
              <input type="text" value={pemilik} onChange={(e) => setPemilik(e.target.value)}
                placeholder="Nama pemilik usaha" required className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Nomor Kontak</label>
            <input type="text" value={kontak} onChange={(e) => setKontak(e.target.value)}
              placeholder="0812-3456-7890" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Produk / Layanan</label>
            <input type="text" value={produk} onChange={(e) => setProduk(e.target.value)}
              placeholder="Contoh: Sembako, Jajanan, Servis Motor" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Deskripsi Singkat</label>
            <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
              rows={2} placeholder="Ceritakan singkat tentang usaha ini..."
              className={`${inputCls} resize-none`} />
          </div>

          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-cream-100 transition-colors">
              Batal
            </button>
            <button type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors">
              <Store className="h-4 w-4" />
              Simpan UMKM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
