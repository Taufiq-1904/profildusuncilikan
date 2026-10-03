"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const ok = await signIn(username, password);
      if (!ok) {
        setError("Username atau password salah. Periksa huruf besar/kecil pada password lalu coba lagi.");
        return;
      }
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan saat masuk. Muat ulang halaman lalu coba lagi.");
    } finally {
      // Always release the button, so a failure can never leave it stuck on
      // "Memverifikasi...".
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700">
          <Lock className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Masuk ke Panel</h1>
        <p className="mt-2 text-sm text-ink-500">
          Khusus pengelola Dusun Cilikan (Dusun, RW, atau RT)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink-700">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username atau email"
              className="w-full rounded-xl border border-line bg-cream py-3 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="password"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-line bg-cream py-3 pl-10 pr-12 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
              aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
        >
          {loading ? "Memverifikasi..." : "Masuk"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-ink-500 hover:text-brand-700 transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
