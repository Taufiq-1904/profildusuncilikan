"use client";

import { useEffect, useState } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  calcBalance,
  formatRupiah,
  type Transaction,
} from "@/lib/finance";
import { FinanceTable } from "@/components/ui/finance-table";
import { AddTransactionModal } from "@/components/ui/add-transaction-modal";
import { useAuth } from "@/components/providers/auth-provider";
import type { TransactionCategory, TransactionType } from "@/lib/data/financeData";

export default function KeuanganDusunPage() {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTxs(getTransactions().filter((t) => t.scope === "dusun"));
    setMounted(true);
  }, []);

  function handleAdd(data: {
    tanggal: string;
    keterangan: string;
    jenis: TransactionType;
    kategori: TransactionCategory;
    jumlah: number;
    scope: Transaction["scope"];
  }) {
    const newTx = addTransaction(data);
    setTxs((prev) => [...prev, newTx]);
  }

  function handleDelete(id: string) {
    if (!confirm("Hapus transaksi ini?")) return;
    deleteTransaction(id);
    setTxs((prev) => prev.filter((t) => t.id !== id));
  }

  const balance = calcBalance(txs);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Keuangan</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Kas Dusun Cilikan</h1>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" />
            Tambah Transaksi
          </button>
        )}
      </div>

      {/* Balance cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <div className="mb-3 flex items-center gap-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">Total Pemasukan</span>
          </div>
          <p className="font-display text-2xl font-semibold text-green-700">
            {mounted ? formatRupiah(balance.pemasukan) : "–"}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-5">
          <div className="mb-3 flex items-center gap-2 text-red-500">
            <TrendingDown className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">Total Pengeluaran</span>
          </div>
          <p className="font-display text-2xl font-semibold text-red-600">
            {mounted ? formatRupiah(balance.pengeluaran) : "–"}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-brand-50 p-5">
          <div className="mb-3 flex items-center gap-2 text-brand-600">
            <Wallet className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">Saldo</span>
          </div>
          <p className={`font-display text-2xl font-semibold ${balance.saldo >= 0 ? "text-brand-700" : "text-red-600"}`}>
            {mounted ? formatRupiah(balance.saldo) : "–"}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-line bg-paper p-6 shadow-sm">
        <h2 className="mb-5 font-display text-base font-semibold text-ink-900">Riwayat Transaksi</h2>
        {mounted ? (
          <FinanceTable
            transactions={txs}
            canDelete={user?.role === "admin"}
            onDelete={handleDelete}
          />
        ) : (
          <p className="text-sm text-ink-500">Memuat data...</p>
        )}
      </div>

      {showModal && (
        <AddTransactionModal
          scope="dusun"
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
