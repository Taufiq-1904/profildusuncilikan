"use client";

import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { formatRupiah } from "@/lib/finance";
import type { Transaction } from "@/lib/data/financeData";

type SortKey = "tanggal" | "jumlah" | "keterangan";

type Props = {
  transactions: Transaction[];
  canDelete?: boolean;
  onDelete?: (id: string) => void;
};

export function FinanceTable({ transactions, canDelete, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("tanggal");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState<"semua" | "pemasukan" | "pengeluaran">("semua");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = transactions
    .filter((t) => filter === "semua" || t.jenis === filter)
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "tanggal") cmp = a.tanggal.localeCompare(b.tanggal);
      if (sortKey === "jumlah") cmp = a.jumlah - b.jumlah;
      if (sortKey === "keterangan") cmp = a.keterangan.localeCompare(b.keterangan);
      return sortDir === "asc" ? cmp : -cmp;
    });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="h-3.5 w-3.5 text-ink-300" />;
    return sortDir === "asc"
      ? <ChevronUp className="h-3.5 w-3.5 text-brand-600" />
      : <ChevronDown className="h-3.5 w-3.5 text-brand-600" />;
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-4 flex gap-2">
        {(["semua", "pemasukan", "pengeluaran"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
              filter === f
                ? "bg-brand-700 text-white"
                : "border border-line bg-paper text-ink-500 hover:bg-cream"
            }`}
          >
            {f === "semua" ? "Semua" : f === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-line bg-cream px-6 py-12 text-center text-sm text-ink-500">
          Belum ada transaksi.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-cream">
                <th
                  className="cursor-pointer px-4 py-3 text-left font-semibold text-ink-700 hover:text-ink-900"
                  onClick={() => toggleSort("tanggal")}
                >
                  <span className="flex items-center gap-1">Tanggal <SortIcon col="tanggal" /></span>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left font-semibold text-ink-700 hover:text-ink-900"
                  onClick={() => toggleSort("keterangan")}
                >
                  <span className="flex items-center gap-1">Keterangan <SortIcon col="keterangan" /></span>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-ink-700">Kategori</th>
                <th className="px-4 py-3 text-left font-semibold text-ink-700">Jenis</th>
                <th
                  className="cursor-pointer px-4 py-3 text-right font-semibold text-ink-700 hover:text-ink-900"
                  onClick={() => toggleSort("jumlah")}
                >
                  <span className="flex items-center justify-end gap-1">Jumlah <SortIcon col="jumlah" /></span>
                </th>
                {canDelete && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((tx) => (
                <tr key={tx.id} className="bg-paper transition-colors hover:bg-cream/60">
                  <td className="whitespace-nowrap px-4 py-3 text-ink-500">
                    {new Date(tx.tanggal + "T00:00:00").toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-ink-900">{tx.keterangan}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                      {tx.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        tx.jenis === "pemasukan"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {tx.jenis === "pemasukan" ? (
                        <ArrowDownCircle className="h-3 w-3" />
                      ) : (
                        <ArrowUpCircle className="h-3 w-3" />
                      )}
                      {tx.jenis === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
                    </span>
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                      tx.jenis === "pemasukan" ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {tx.jenis === "pengeluaran" ? "– " : "+ "}
                    {formatRupiah(tx.jumlah)}
                  </td>
                  {canDelete && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDelete?.(tx.id)}
                        className="rounded-lg p-1.5 text-ink-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Hapus transaksi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
