"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSession, login, logout, subscribeAuth, type SessionUser } from "@/lib/auth";

type AuthContextType = {
  user: SessionUser | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setIsLoading(false);
    // Keeps the header/sidebar in sync when the username changes or when
    // another tab signs in or out.
    return subscribeAuth(() => setUser(getSession()));
  }, []);

  function signIn(username: string, password: string): boolean {
    const session = login(username, password);
    if (!session) return false;
    setUser(session);
    return true;
  }

  function signOut() {
    logout();
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
