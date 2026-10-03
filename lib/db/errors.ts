import { AccessError } from "../access";

type DbError = { code?: string; message: string; details?: string | null };

// Mengubah error Supabase menjadi pesan yang aman ditampilkan di form.
// Detail teknis hanya masuk console.
export function toUserError(error: DbError, fallback: string): Error {
  console.error(error);
  // 42501 = ditolak oleh Row Level Security.
  if (error.code === "42501") return new AccessError();
  return new Error(fallback);
}

export function isSlugConflict(error: DbError | null): boolean {
  if (!error || error.code !== "23505") return false;
  return /slug/i.test(`${error.message} ${error.details ?? ""}`);
}
