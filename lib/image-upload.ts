import { getSupabase } from "./supabase/client";

const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const BUCKET = "media";

async function compressToBlob(file: File, maxWidth: number, quality: number): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar.");
  if (file.size > MAX_SOURCE_BYTES) throw new Error("Ukuran gambar maksimal 10 MB.");

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Gambar tidak dapat dibaca."));
      el.src = url;
    });

    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Browser tidak mendukung pemrosesan gambar.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Gambar gagal diproses."))),
        "image/jpeg",
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Mengecilkan gambar lalu mengunggahnya ke Supabase Storage (bucket "media")
// dan mengembalikan URL publiknya. URL inilah yang disimpan di database.
export async function uploadImage(
  file: File,
  folder = "umum",
  maxWidth = 1200,
  quality = 0.82
): Promise<string> {
  const blob = await compressToBlob(file, maxWidth, quality);
  const supabase = getSupabase();
  const path = `${folder}/${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
  if (error) {
    console.error(error);
    throw new Error("Gambar gagal diunggah. Pastikan Anda masih login lalu coba lagi.");
  }
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// "https://xxx.supabase.co/storage/v1/object/public/media/berita/abc.jpg" -> "berita/abc.jpg"
function mediaPath(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
}

// Menghapus file gambar yang sudah tidak dipakai. Dilakukan setelah data
// berhasil disimpan; kegagalannya tidak boleh menggagalkan penyimpanan.
export async function removeMedia(urls: Array<string | undefined | null>): Promise<void> {
  const paths = urls
    .filter((u): u is string => typeof u === "string" && u.length > 0)
    .map(mediaPath)
    .filter((p): p is string => p !== null);
  if (paths.length === 0) return;
  try {
    const { error } = await getSupabase().storage.from(BUCKET).remove(paths);
    if (error) console.error("Gagal menghapus gambar lama:", error);
  } catch (e) {
    console.error("Gagal menghapus gambar lama:", e);
  }
}

// URL yang ada di `before` tetapi tidak lagi ada di `after`.
export function droppedMedia(
  before: Array<string | undefined | null>,
  after: Array<string | undefined | null>
): string[] {
  const keep = new Set(after.filter(Boolean) as string[]);
  return (before.filter(Boolean) as string[]).filter((u) => !keep.has(u));
}
