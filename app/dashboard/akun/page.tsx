"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, UserCog } from "lucide-react";
import {
  errorClass,
  fieldClass,
  hintClass,
  labelClass,
  panelClass,
  primaryButtonClass,
} from "@/components/dashboard/form-styles";
import { useAuth } from "@/components/providers/auth-provider";
import {
  MIN_PASSWORD_LENGTH,
  changeOwnPassword,
  changeOwnUsername,
  getSession,
  listManagedAccounts,
  resetAccountPassword,
  type ManagedAccount,
} from "@/lib/auth";
import { getWilayahLabel } from "@/lib/data/wilayahData";

const successClass = "rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800";

function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder={placeholder}
        required
        className={`${fieldClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-700"
      >
        {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

function Feedback({ error, success }: { error: string; success: string }) {
  if (error) return <p role="alert" className={errorClass}>{error}</p>;
  if (success) return <p role="status" className={successClass}>{success}</p>;
  return null;
}

function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await changeOwnPassword(current, next, confirm);
      setCurrent("");
      setNext("");
      setConfirm("");
      setSuccess("Password berhasil diubah. Gunakan password baru saat masuk berikutnya.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password gagal diubah.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${panelClass} space-y-4`}>
      <div className="flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-brand-600" aria-hidden="true" />
        <h2 className="font-display text-lg font-semibold text-ink-900">Ganti password</h2>
      </div>
      <div>
        <label htmlFor="pw-current" className={labelClass}>Password saat ini</label>
        <PasswordInput id="pw-current" value={current} onChange={setCurrent} autoComplete="current-password" />
      </div>
      <div>
        <label htmlFor="pw-new" className={labelClass}>Password baru</label>
        <PasswordInput id="pw-new" value={next} onChange={setNext} autoComplete="new-password" />
        <p className={hintClass}>Minimal {MIN_PASSWORD_LENGTH} karakter, tanpa spasi di awal atau akhir.</p>
      </div>
      <div>
        <label htmlFor="pw-confirm" className={labelClass}>Ulangi password baru</label>
        <PasswordInput id="pw-confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />
      </div>
      <Feedback error={error} success={success} />
      <button type="submit" className={primaryButtonClass}>Simpan password</button>
    </form>
  );
}

function ChangeUsernameForm({ currentUsername }: { currentUsername: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await changeOwnUsername(username, password);
      setUsername("");
      setPassword("");
      setSuccess("Username berhasil diubah. Gunakan username baru saat masuk berikutnya.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Username gagal diubah.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${panelClass} space-y-4`}>
      <div className="flex items-center gap-2">
        <UserCog className="h-5 w-5 text-brand-600" aria-hidden="true" />
        <h2 className="font-display text-lg font-semibold text-ink-900">Ganti username</h2>
      </div>
      <p className="text-sm text-ink-500">
        Username sekarang: <span className="font-semibold text-ink-900">{currentUsername}</span>
      </p>
      <div>
        <label htmlFor="un-new" className={labelClass}>Username baru</label>
        <input
          id="un-new"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          className={fieldClass}
        />
        <p className={hintClass}>3–30 karakter: huruf kecil, angka, titik, garis bawah, atau tanda hubung.</p>
      </div>
      <div>
        <label htmlFor="un-password" className={labelClass}>Password saat ini</label>
        <PasswordInput id="un-password" value={password} onChange={setPassword} autoComplete="current-password" />
      </div>
      <Feedback error={error} success={success} />
      <button type="submit" className={primaryButtonClass}>Simpan username</button>
    </form>
  );
}

function ResetRow({ account }: { account: ManagedAccount }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await resetAccountPassword(account.id, password);
      setPassword("");
      setOpen(false);
      setSuccess("Password diatur ulang.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password gagal diatur ulang.");
    }
  }

  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-900">{account.displayName}</p>
          <p className="text-xs text-ink-500">
            Username <span className="font-semibold text-ink-700">{account.username}</span> ·{" "}
            {getWilayahLabel(account.wilayahId)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setSuccess("");
          }}
          aria-expanded={open}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          {open ? "Batal" : "Atur ulang password"}
        </button>
      </div>
      {open && (
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <label htmlFor={`reset-${account.id}`} className={labelClass}>Password baru untuk {account.username}</label>
          <PasswordInput id={`reset-${account.id}`} value={password} onChange={setPassword} autoComplete="new-password" />
          {error && <p role="alert" className={errorClass}>{error}</p>}
          <button type="submit" className={primaryButtonClass}>Simpan</button>
        </form>
      )}
      {success && <p role="status" className={`${successClass} mt-3`}>{success}</p>}
    </li>
  );
}

export default function AkunPage() {
  const { user } = useAuth();
  const role = user?.role;
  const [accounts, setAccounts] = useState<ManagedAccount[]>([]);
  const [accountsError, setAccountsError] = useState("");

  // Daftar akun RW/RT dibaca dari Supabase (hanya akun Dusun yang berhak).
  useEffect(() => {
    let alive = true;
    listManagedAccounts(getSession())
      .then((list) => {
        if (alive) setAccounts(list);
      })
      .catch((e) => {
        if (alive) setAccountsError(e instanceof Error ? e.message : "Daftar akun gagal dimuat.");
      });
    return () => {
      alive = false;
    };
  }, [role]);

  if (!user) return null;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Akun &amp; Password</h1>
        <p className="mt-1 text-sm text-ink-500">
          Masuk sebagai <span className="font-semibold text-ink-700">{user.displayName}</span>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChangePasswordForm />
        <ChangeUsernameForm currentUsername={user.username} />
      </div>

      {user.role === "dusun" && (
        <section className="mt-8" aria-labelledby="akun-pengelola">
          <h2 id="akun-pengelola" className="mb-3 font-display text-lg font-semibold text-ink-900">
            Akun pengelola RW &amp; RT
          </h2>
          {accountsError && <p role="alert" className={`${errorClass} mb-3`}>{accountsError}</p>}
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
            {accounts.map((a) => (
              <ResetRow key={a.id} account={a} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
