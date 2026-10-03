"use client";

import { useState } from "react";
import { X, Plus, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { KATEGORI_OPTIONS, type TransactionCategory, type TransactionType } from "@/lib/data/financeData";

type Scope = "dusun" | "rt01" | "rt02" | "rt03" | "rt04";

type Props = {
  scope: Scope;
  onAdd: (data: {
    tanggal: string;
    keterangan: string;
    jenis: TransactionType;
    kategori: TransactionCategory;
    jumlah: number;
    scope: Scope;
  }) => void;
  onClose: () => void;
};

export function AddTransactionModal({ scope, onAdd, onClose }: Props) {
  const [jenis, setJenis] = useState<TransactionType>("pemasukan");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [keterangan, setKeterangan] = useState("");
  const [kategori, setKategori] = useState<TransactionCategory>("Iuran Warga");
  const [jumlah, setJumlah] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseInt(jumlah.replace(/\D/g, ""), 10);
    if (!keterangan.trim()) { setError("Keterangan wajib diisi."); return; }
    if (!amount || amount <= 0) { setError("Jumlah harus lebih dari 0."); return; }
    onAdd({ tanggal, keterangan: keterangan.trim(), jenis, kategori, jumlah: amount, scope });
    onClose();
  }

  function formatInput(val: string) {
    const num = val.replace(/\D/g, "");
    setJumlah(num ? Number(num).toLocaleString("id-ID") : "");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-paper shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-ink-900">Tambah Transaksi</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-ink-500 hover:bg-cream hover:text-ink-900 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Jenis */}
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-700">Jenis Transaksi</label>
            <div className="grid grid-cols-2 gap-2">
              {(["pemasukan", "pengeluaran"] as TransactionType[]).map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => setJenis(j)}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                    jenis === j
                      ? j === "pemasukan"
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-red-500 bg-red-50 text-red-600"
                      : "border-line bg-paper text-ink-500 hover:border-line hover:bg-cream"
                  }`}
                >
                  {j === "pemasukan" ? (
                    <ArrowDownCircle className="h-4 w-4" />
                  ) : (
                    <ArrowUpCircle className="h-4 w-4" />
                  )}
                  {j === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
                </button>
              ))}
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Keterangan</label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Iuran bulanan warga"
              className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value as TransactionCategory)}
              className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {KATEGORI_OPTIONS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Jumlah */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">Jumlah (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-500">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={jumlah}
                onChange={(e) => formatInput(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-line bg-cream py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 hover:bg-cream transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
