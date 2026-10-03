import { isSlugConflict } from "./errors";

type Result<R> = { data: R | null; error: { code?: string; message: string; details?: string | null } | null };

// Menjalankan simpan dengan slug yang unik. Tebakan pertama dihitung dari data
// yang sudah dimuat di browser, tetapi pengelola RT tidak bisa melihat draft
// milik wilayah lain, jadi tabrakan sungguhan hanya diketahui database (kode
// 23505). Bila bertabrakan, coba akhiran -2, -3, ... sampai berhasil.
export async function saveWithUniqueSlug<R>(
  guess: string,
  root: string,
  run: (slug: string) => PromiseLike<Result<R>>
): Promise<{ data: R | null; error: Result<R>["error"]; slug: string }> {
  const tried = new Set<string>();
  const next = (n: number) => (n === 1 ? guess : `${root}-${n}`);
  let last: Result<R> = { data: null, error: null };
  let slug = guess;
  for (let n = 1; n <= 30; n += 1) {
    slug = next(n);
    if (tried.has(slug)) continue;
    tried.add(slug);
    last = await run(slug);
    if (!isSlugConflict(last.error)) return { ...last, slug };
  }
  return { ...last, slug };
}
