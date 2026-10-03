"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSession, initAuth, login, logout, subscribeAuth, type SessionUser } from "@/lib/auth";

type AuthContextType = {
  user: SessionUser | null;
  isLoading: boolean;
  // true bila berhasil; false bila username/password salah. Kesalahan lain dilempar.
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

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
    setUser(session);
    return true;
  }

  async function signOut(): Promise<void> {
    await logout();
    setUser(null);
  }

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
