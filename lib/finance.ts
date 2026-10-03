import { type Transaction, initialTransactions, type TransactionCategory, type TransactionType } from "./data/financeData";

const STORAGE_KEY = "cilikan_transactions";

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return initialTransactions;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTransactions));
    return initialTransactions;
  }
  try {
    return JSON.parse(raw) as Transaction[];
  } catch {
    return initialTransactions;
  }
}

export function saveTransactions(txs: Transaction[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
  }
}

export function addTransaction(
  tx: Omit<Transaction, "id">
): Transaction {
  const all = getTransactions();
  const newTx: Transaction = {
    ...tx,
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  saveTransactions([...all, newTx]);
  return newTx;
}

export function deleteTransaction(id: string): void {
  const all = getTransactions();
  saveTransactions(all.filter((t) => t.id !== id));
}

export function getTransactionsByScope(scope: Transaction["scope"]): Transaction[] {
  return getTransactions().filter((t) => t.scope === scope);
}

export function calcBalance(txs: Transaction[]): {
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
} {
  const pemasukan = txs
    .filter((t) => t.jenis === "pemasukan")
    .reduce((s, t) => s + t.jumlah, 0);
  const pengeluaran = txs
    .filter((t) => t.jenis === "pengeluaran")
    .reduce((s, t) => s + t.jumlah, 0);
  return { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export { type Transaction, type TransactionCategory, type TransactionType };
