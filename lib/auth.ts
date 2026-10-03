import { accounts as seedAccounts, type AppUser, type Role } from "./data/authData";
import {
  dusun,
  getRTById,
  getRTsByRW,
  getRWById,
  getWilayahLabel,
  getWilayahLevel,
  rwList,
  type WilayahLevel,
} from "./data/wilayahData";

const SESSION_KEY = "cilikan_auth";
const CREDENTIALS_KEY = "cilikan_credentials";
const AUTH_EVENT = "cilikan:auth";

export type SessionUser = {
  // Stable id of the account (the username it was created with). It never
  // changes, even when the login username is changed later.
  accountId: string;
  username: string;
  displayName: string;
  role: Role;
  wilayahId: string;
};

// --- safe browser storage ---------------------------------------------------
// localStorage can throw (private mode, blocked cookies, quota full because
// of stored images). Login must not depend on it succeeding, so every access
// is guarded and the session falls back to sessionStorage and then memory.

let memorySession: string | null = null;

function storage(kind: "local" | "session"): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function readItem(key: string): string | null {
  for (const kind of ["local", "session"] as const) {
    try {
      const value = storage(kind)?.getItem(key);
      if (value) return value;
    } catch {
      // try the next storage
    }
  }
  return null;
}

function writeItem(key: string, value: string): boolean {
  for (const kind of ["local", "session"] as const) {
    try {
      const store = storage(kind);
      if (!store) continue;
      store.setItem(key, value);
      return true;
    } catch {
      // quota exceeded or blocked: try the next storage
    }
  }
  return false;
}

function removeItem(key: string): void {
  for (const kind of ["local", "session"] as const) {
    try {
      storage(kind)?.removeItem(key);
    } catch {
      // ignore
    }
  }
}

function notifyAuthChanged(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_EVENT));
}

export function subscribeAuth(onChange: () => void): () => void {
  window.addEventListener(AUTH_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUTH_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// --- accounts (seed + credential overrides) ---------------------------------
// Credentials changed from the dashboard are kept as overrides on top of the
// seed accounts. Overrides live in this browser only.

type CredentialOverride = { username?: string; password?: string };
type OverrideMap = Record<string, CredentialOverride>;

export type Account = AppUser & { id: string };

function readOverrides(): OverrideMap {
  const raw = readItem(CREDENTIALS_KEY);
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const clean: OverrideMap = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (!value || typeof value !== "object") continue;
      const v = value as CredentialOverride;
      clean[id] = {
        username: typeof v.username === "string" && v.username ? v.username : undefined,
        password: typeof v.password === "string" && v.password ? v.password : undefined,
      };
    }
    return clean;
  } catch {
    return {};
  }
}

function saveOverride(id: string, patch: CredentialOverride): void {
  const all = readOverrides();
  all[id] = { ...all[id], ...patch };
  // Credentials must really persist, otherwise the user would believe the
  // password changed when it did not.
  let stored = false;
  try {
    storage("local")?.setItem(CREDENTIALS_KEY, JSON.stringify(all));
    stored = storage("local") !== null;
  } catch {
    stored = false;
  }
  if (!stored) {
    throw new Error(
      "Perubahan tidak dapat disimpan karena penyimpanan browser penuh atau diblokir. Hapus data lama lalu coba lagi."
    );
  }
  notifyAuthChanged();
}

export function getAccounts(): Account[] {
  const overrides = readOverrides();
  return seedAccounts.map((seed) => {
    const o = overrides[seed.username];
    return {
      ...seed,
      id: seed.username,
      username: o?.username ?? seed.username,
      password: o?.password ?? seed.password,
    };
  });
}

function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

// Phones often add a trailing space (autocomplete/suggestions). Passwords set
// from the dashboard never have surrounding spaces, so tolerating them on
// input is safe.
function passwordMatches(stored: string, input: string): boolean {
  if (input === stored) return true;
  return stored === stored.trim() && input.trim() === stored;
}

function toSession(account: Account): SessionUser {
  return {
    accountId: account.id,
    username: account.username,
    displayName: account.displayName,
    role: account.role,
    wilayahId: account.wilayahId,
  };
}

export function login(username: string, password: string): SessionUser | null {
  const wanted = normalizeUsername(username);
  const account = getAccounts().find((a) => normalizeUsername(a.username) === wanted);
  if (!account || !passwordMatches(account.password, password)) return null;

  const payload = JSON.stringify({ accountId: account.id, username: account.username });
  memorySession = payload;
  writeItem(SESSION_KEY, payload);
  return toSession(account);
}

export function logout(): void {
  memorySession = null;
  removeItem(SESSION_KEY);
}

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = readItem(SESSION_KEY) ?? memorySession;
  if (!raw) return null;
  try {
    const stored = JSON.parse(raw) as { accountId?: string; username?: string };
    // Only the account id is trusted from storage. Role and wilayah are
    // looked up again from the account list, so editing storage by hand
    // cannot turn an RT account into a dusun account. Sessions saved by an
    // older version only have the username, which equalled the id then.
    const key = stored.accountId ?? stored.username;
    const account = getAccounts().find((a) => a.id === key);
    return account ? toSession(account) : null;
  } catch {
    return null;
  }
}

// --- changing credentials ---------------------------------------------------

export const MIN_PASSWORD_LENGTH = 8;

function validateNewPassword(next: string, account: Account, seedPassword: string): void {
  if (next.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password baru minimal ${MIN_PASSWORD_LENGTH} karakter.`);
  }
  if (next !== next.trim()) {
    throw new Error("Password tidak boleh diawali atau diakhiri spasi.");
  }
  if (normalizeUsername(next) === normalizeUsername(account.username)) {
    throw new Error("Password tidak boleh sama dengan username.");
  }
  if (next === seedPassword) {
    throw new Error("Pilih password yang berbeda dari password bawaan.");
  }
}

function seedPasswordOf(id: string): string {
  return seedAccounts.find((a) => a.username === id)?.password ?? "";
}

function requireCurrentAccount(): { session: SessionUser; account: Account } {
  const session = getSession();
  if (!session) throw new Error("Sesi login tidak ditemukan. Silakan masuk kembali.");
  const account = getAccounts().find((a) => a.id === session.accountId);
  if (!account) throw new Error("Akun tidak ditemukan.");
  return { session, account };
}

export function changeOwnPassword(current: string, next: string, confirm: string): void {
  const { account } = requireCurrentAccount();
  if (!passwordMatches(account.password, current)) throw new Error("Password saat ini salah.");
  if (next !== confirm) throw new Error("Konfirmasi password tidak sama dengan password baru.");
  if (next === account.password) throw new Error("Password baru harus berbeda dari yang sekarang.");
  validateNewPassword(next, account, seedPasswordOf(account.id));
  saveOverride(account.id, { password: next });
}

export function changeOwnUsername(newUsername: string, currentPassword: string): void {
  const { account } = requireCurrentAccount();
  if (!passwordMatches(account.password, currentPassword)) throw new Error("Password saat ini salah.");
  const next = normalizeUsername(newUsername);
  if (!/^[a-z0-9._-]{3,30}$/.test(next)) {
    throw new Error("Username 3–30 karakter, hanya huruf kecil, angka, titik, garis bawah, atau tanda hubung.");
  }
  if (next === normalizeUsername(account.username)) throw new Error("Username baru sama dengan yang sekarang.");
  const taken = getAccounts().some((a) => a.id !== account.id && normalizeUsername(a.username) === next);
  if (taken) throw new Error("Username sudah dipakai akun lain.");
  saveOverride(account.id, { username: next });
}

export type ManagedAccount = {
  id: string;
  username: string;
  displayName: string;
  role: Role;
  wilayahId: string;
  passwordChanged: boolean;
};

// Only the dusun account can see and reset the others.
export function listManagedAccounts(session: SessionUser | null): ManagedAccount[] {
  if (session?.role !== "dusun") return [];
  const overrides = readOverrides();
  return getAccounts().map((a) => ({
    id: a.id,
    username: a.username,
    displayName: a.displayName,
    role: a.role,
    wilayahId: a.wilayahId,
    passwordChanged: Boolean(overrides[a.id]?.password),
  }));
}

export function resetAccountPassword(targetId: string, next: string): void {
  const { session } = requireCurrentAccount();
  if (session.role !== "dusun") throw new Error("Hanya akun Dusun yang dapat mengatur ulang password akun lain.");
  const target = getAccounts().find((a) => a.id === targetId);
  if (!target) throw new Error("Akun tujuan tidak ditemukan.");
  validateNewPassword(next, target, seedPasswordOf(target.id));
  saveOverride(target.id, { password: next });
}

export function isDusun(session: SessionUser | null): boolean {
  return session?.role === "dusun";
}

// Authorization is resolved relationally through the wilayah hierarchy
// (dusun > rw > rt) rather than hardcoded id comparisons, so adding more
// RW/RT later needs no logic changes here.
export function canManageWilayah(session: SessionUser | null, targetWilayahId: string): boolean {
  if (!session) return false;
  if (session.role === "dusun") return true;
  if (session.role === "rw") {
    if (session.wilayahId === targetWilayahId) return true;
    const rt = getRTById(targetWilayahId);
    return rt?.rwId === session.wilayahId;
  }
  if (session.role === "rt") {
    return session.wilayahId === targetWilayahId;
  }
  return false;
}

export type ManageableWilayah = {
  id: string;
  label: string;
  level: WilayahLevel;
};

function toManageable(id: string): ManageableWilayah | null {
  const level = getWilayahLevel(id);
  return level ? { id, label: getWilayahLabel(id), level } : null;
}

// Every wilayah this session may publish or manage content for, in
// hierarchy order (dusun, then each RW followed by its RTs).
export function getManageableWilayah(session: SessionUser | null): ManageableWilayah[] {
  if (!session) return [];
  let ids: string[] = [];
  if (session.role === "dusun") {
    ids = [dusun.id, ...rwList.flatMap((rw) => [rw.id, ...getRTsByRW(rw.id).map((rt) => rt.id)])];
  } else if (session.role === "rw" && getRWById(session.wilayahId)) {
    ids = [session.wilayahId, ...getRTsByRW(session.wilayahId).map((rt) => rt.id)];
  } else if (session.role === "rt") {
    ids = [session.wilayahId];
  }
  return ids.map(toManageable).filter((w): w is ManageableWilayah => w !== null);
}

export { type AppUser };
