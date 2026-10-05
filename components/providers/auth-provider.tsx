"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSession, initAuth, login, logout, subscribeAuth, type SessionUser } from "@/lib/auth";
import { IDLE_NOTICE_KEY, clearActivity, markActive, useIdleTimeout } from "@/lib/hooks/use-idle-timeout";

type AuthContextType = {
  user: SessionUser | null;
  isLoading: boolean;
  // true bila berhasil; false bila username/password salah. Kesalahan lain dilempar.
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function setIdleNotice(on: boolean): void {
  try {
    if (on) sessionStorage.setItem(IDLE_NOTICE_KEY, "1");
    else sessionStorage.removeItem(IDLE_NOTICE_KEY);
  } catch {
    // Hanya pesan di halaman login yang hilang; logout tetap berjalan.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    // Memulihkan sesi Supabase dari cookie, lalu mengikuti perubahannya
    // (login/logout di tab lain, ganti username, token diperbarui).
    const unsubscribe = subscribeAuth(() => {
      if (alive) setUser(getSession());
    });
    void initAuth().finally(() => {
      if (!alive) return;
      setUser(getSession());
      setIsLoading(false);
    });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  async function signIn(username: string, password: string): Promise<boolean> {
    const session = await login(username, password);
    if (!session) return false;
    markActive();
    setIdleNotice(false);
    setUser(session);
    return true;
  }

  async function endSession(): Promise<void> {
    clearActivity();
    await logout();
    setUser(null);
  }

  async function signOut(): Promise<void> {
    setIdleNotice(false);
    await endSession();
  }

  // Keluar otomatis bila 10 menit tanpa aktivitas. Penandanya dipasang sebelum
  // logout karena guard dashboard langsung mengalihkan ke halaman login.
  useIdleTimeout(user !== null, () => {
    setIdleNotice(true);
    void endSession();
  });

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
