import { canManageWilayah, getSession, isDusun, type SessionUser } from "./auth";

// Shared authorization guards for every service that mutates data. Services
// call these themselves instead of trusting what the UI passes in, which is
// the shape a real API route would have.

export class AccessError extends Error {
  constructor(message = "Anda tidak memiliki akses untuk tindakan ini.") {
    super(message);
    this.name = "AccessError";
  }
}

export function requireSession(): SessionUser {
  const session = getSession();
  if (!session) throw new AccessError("Sesi login tidak ditemukan. Silakan masuk kembali.");
  return session;
}

export function requireWilayah(session: SessionUser, wilayahId: string): void {
  if (!canManageWilayah(session, wilayahId)) throw new AccessError();
}

export function requireDusun(session: SessionUser): void {
  if (!isDusun(session)) {
    throw new AccessError("Hanya akun Dusun yang dapat mengelola data ini.");
  }
}
