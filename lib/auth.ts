import { getSupabase } from "./supabase/client";
import { markAuthReady, refreshAllStores } from "./remoteStore";
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

export type Role = "dusun" | "rw" | "rt";

export type SessionUser = {
  // id akun di Supabase Auth (auth.users.id).
  userId: string;
  // Sama dengan userId. Dipertahankan agar kode lama yang memakai accountId tetap jalan.
  accountId: string;
  username: string;
  displayName: string;
  role: Role;
  wilayahId: string;
};

// --- keadaan sesi -----------------------------------------------------------
// Sesi sebenarnya dikelola Supabase Auth (cookie). Di sini hanya salinan di
// memori supaya komponen bisa membacanya secara sinkron. Hak akses yang
// mengikat tetap dijaga Row Level Security di database, bukan oleh kode ini.

const AUTH_EVENT = "cilikan:auth";

let current: SessionUser | null = null;
let started: Promise<void> | null = null;

function notify(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_EVENT));
}

export function subscribeAuth(onChange: () => void): () => void {
  window.addEventListener(AUTH_EVENT, onChange);
  return () => window.removeEventListener(AUTH_EVENT, onChange);
}

export function getSession(): SessionUser | null {
  return current;
}

async function fetchProfile(userId: string): Promise<SessionUser | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("id, username, display_name, role, wilayah_id")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error("Gagal memuat profil pengelola:", error);
    return null;
  }
  return {
    userId: data.id,
    accountId: data.id,
    username: data.username ?? "",
    displayName: data.display_name,
    role: data.role as Role,
    wilayahId: data.wilayah_id,
  };
}

async function syncSession(userId: string | null, force = false): Promise<void> {
  if (!userId) {
    if (current === null) return;
    current = null;
  } else {
    if (!force && current?.userId === userId) return;
    current = await fetchProfile(userId);
  }
  notify();
  // Isi tiap daftar berbeda untuk tiap sesi (draft, UMKM nonaktif).
  refreshAllStores();
}

// Dipanggil sekali oleh AuthProvider. Memulihkan sesi dari cookie, lalu
// mengikuti perubahan (login, logout, token diperbarui, tab lain).
export function initAuth(): Promise<void> {
  if (started) return started;
  started = (async () => {
    try {
      const supabase = getSupabase();
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id ?? null;
      if (userId) current = await fetchProfile(userId);
      notify();

      supabase.auth.onAuthStateChange((_event, session) => {
        // Jangan memanggil Supabase langsung di dalam callback ini (bisa
        // saling mengunci); tunda ke tick berikutnya.
        setTimeout(() => void syncSession(session?.user.id ?? null), 0);
      });
    } catch (e) {
      console.error("Gagal memulihkan sesi:", e);
    } finally {
      markAuthReady();
    }
  })();
  return started;
}

// --- login / logout ---------------------------------------------------------

function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

async function resolveEmail(identifier: string): Promise<string | null> {
  const value = identifier.trim();
  if (value.includes("@")) return value;
  const { data, error } = await getSupabase().rpc("login_email", { p_username: value });
  if (error) throw new Error("Login gagal diproses. Coba lagi sebentar lagi.");
  return typeof data === "string" && data ? data : null;
}

async function signInWith(email: string, password: string): Promise<boolean> {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (!error) return true;
  // Kredensial salah bukan kesalahan sistem; sisanya dilempar ke pemanggil.
  if (error.status === 400 || /invalid login credentials/i.test(error.message)) return false;
  throw new Error("Login gagal diproses. Coba lagi sebentar lagi.");
}

// Mengembalikan null bila username/password salah.
export async function login(identifier: string, password: string): Promise<SessionUser | null> {
  const email = await resolveEmail(identifier);
  if (!email) return null;

  let ok = await signInWith(email, password);
  // HP sering menambahkan spasi di akhir lewat autocomplete. Password yang
  // dibuat lewat dashboard tidak pernah berspasi di tepi, jadi aman dicoba ulang.
  if (!ok && password !== password.trim()) ok = await signInWith(email, password.trim());
  if (!ok) return null;

  const { data } = await getSupabase().auth.getUser();
  if (!data.user) return null;
  await syncSession(data.user.id, true);

  if (!current) {
    // Akun ada di Supabase Auth tetapi belum didaftarkan sebagai pengelola.
    await getSupabase().auth.signOut();
    throw new Error("Akun ini belum terdaftar sebagai pengelola. Hubungi admin dusun.");
  }
  return current;
}

export async function logout(): Promise<void> {
  await getSupabase().auth.signOut();
  await syncSession(null);
}

// --- mengubah kredensial ----------------------------------------------------

export const MIN_PASSWORD_LENGTH = 8;

function requireCurrent(): SessionUser {
  if (!current) throw new Error("Sesi login tidak ditemukan. Silakan masuk kembali.");
  return current;
}

function validateNewPassword(next: string, username: string): void {
  if (next.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password baru minimal ${MIN_PASSWORD_LENGTH} karakter.`);
  }
  if (next !== next.trim()) {
    throw new Error("Password tidak boleh diawali atau diakhiri spasi.");
  }
  if (normalizeUsername(next) === normalizeUsername(username)) {
    throw new Error("Password tidak boleh sama dengan username.");
  }
}

// Memastikan yang mengetik memang pemilik akun, dengan login ulang memakai
// password saat ini. Sesi yang sedang berjalan tidak terganggu.
async function verifyCurrentPassword(password: string): Promise<void> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;
  if (!email) throw new Error("Sesi login tidak ditemukan. Silakan masuk kembali.");
  const ok = await signInWith(email, password);
  if (!ok) throw new Error("Password saat ini salah.");
}

export async function changeOwnPassword(currentPassword: string, next: string, confirm: string): Promise<void> {
  const me = requireCurrent();
  if (next !== confirm) throw new Error("Konfirmasi password tidak sama dengan password baru.");
  if (next === currentPassword) throw new Error("Password baru harus berbeda dari yang sekarang.");
  validateNewPassword(next, me.username);
  await verifyCurrentPassword(currentPassword);

  const { error } = await getSupabase().auth.updateUser({ password: next });
  if (error) {
    console.error(error);
    throw new Error(error.message || "Password gagal diubah.");
  }
}

export async function changeOwnUsername(newUsername: string, currentPassword: string): Promise<void> {
  const me = requireCurrent();
  const next = normalizeUsername(newUsername);
  if (!/^[a-z0-9._-]{3,30}$/.test(next)) {
    throw new Error("Username 3–30 karakter, hanya huruf kecil, angka, titik, garis bawah, atau tanda hubung.");
  }
  if (next === normalizeUsername(me.username)) throw new Error("Username baru sama dengan yang sekarang.");
  await verifyCurrentPassword(currentPassword);

  const { error } = await getSupabase().rpc("change_my_username", { p_username: next });
  if (error) {
    if (error.code === "23505") throw new Error("Username sudah dipakai akun lain.");
    console.error(error);
    throw new Error("Username gagal diubah.");
  }
  current = { ...me, username: next };
  notify();
}

export type ManagedAccount = {
  id: string;
  username: string;
  displayName: string;
  role: Role;
  wilayahId: string;
};

// Hanya akun Dusun yang boleh melihat dan mengatur ulang akun lain
// (dijaga oleh policy profiles_read_own di database).
export async function listManagedAccounts(session: SessionUser | null): Promise<ManagedAccount[]> {
  if (session?.role !== "dusun") return [];
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("id, username, display_name, role, wilayah_id")
    .neq("id", session.userId);
  if (error) {
    console.error(error);
    throw new Error("Daftar akun gagal dimuat.");
  }
  const order = { rw: 0, rt: 1, dusun: 2 } as const;
  return (data ?? [])
    .map((p) => ({
      id: p.id as string,
      username: (p.username as string | null) ?? "",
      displayName: p.display_name as string,
      role: p.role as Role,
      wilayahId: p.wilayah_id as string,
    }))
    .sort((a, b) => order[a.role] - order[b.role] || a.wilayahId.localeCompare(b.wilayahId));
}

// Mengatur ulang password akun lain butuh hak admin Supabase, yang tidak boleh
// ada di browser. Karena itu lewat Route Handler di server.
export async function resetAccountPassword(targetId: string, next: string): Promise<void> {
  const me = requireCurrent();
  if (me.role !== "dusun") throw new Error("Hanya akun Dusun yang dapat mengatur ulang password akun lain.");
  validateNewPassword(next, "");

  const res = await fetch("/api/admin/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: targetId, password: next }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Password gagal diatur ulang.");
  }
}

// --- hak akses --------------------------------------------------------------

export function isDusun(session: SessionUser | null): boolean {
  return session?.role === "dusun";
}

// Padanan di sisi UI untuk fungsi can_manage_wilayah() di database. Ini hanya
// untuk menyembunyikan tombol dan memberi pesan yang ramah; yang benar-benar
// mengikat adalah Row Level Security.
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

// Setiap wilayah yang boleh dipublikasi/dikelola sesi ini, berurutan menurut
// hierarki (dusun, lalu tiap RW diikuti RT-nya).
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
