import { requireDusun, requireSession } from "./access";
import { sortGallery, type GalleryItem, type GallerySpan } from "./data/galleryData";
import { rowToGalleryPhoto } from "./db/mappers";
import { toUserError } from "./db/errors";
import { droppedMedia, removeMedia } from "./image-upload";
import { createRemoteStore } from "./remoteStore";
import { getSupabase } from "./supabase/client";

async function loadGallery(): Promise<GalleryItem[]> {
  const { data, error } = await getSupabase()
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw toUserError(error, "Galeri gagal dimuat.");
  return sortGallery((data ?? []).map(rowToGalleryPhoto));
}

export const galleryStore = createRemoteStore<GalleryItem>({ load: loadGallery });

export type GalleryInput = {
  title: string;
  category: string;
  image: string;
  span: GallerySpan;
  order: number;
};

function validate(input: GalleryInput): void {
  if (!input.title.trim()) throw new Error("Judul foto wajib diisi.");
  if (input.title.trim().length > 120) throw new Error("Judul foto maksimal 120 karakter.");
  if (!input.category.trim()) throw new Error("Kategori wajib diisi.");
  if (!input.image) throw new Error("Foto wajib diunggah.");
  if (!Number.isInteger(input.order)) throw new Error("Urutan harus bilangan bulat.");
}

function toRow(input: GalleryInput) {
  return {
    title: input.title.trim(),
    category: input.category.trim(),
    image: input.image,
    span: input.span,
    sort_order: input.order,
  };
}

// Galeri hanya dikelola akun Dusun. Pemeriksaan ini untuk pesan yang ramah;
// yang mengikat adalah Row Level Security (policy gallery_write).
export async function createPhoto(input: GalleryInput): Promise<GalleryItem> {
  requireDusun(requireSession());
  validate(input);
  const { data, error } = await getSupabase().from("gallery_photos").insert(toRow(input)).select("*").single();
  if (error || !data) throw toUserError(error ?? { message: "no data" }, "Foto gagal disimpan.");
  await galleryStore.refresh();
  return rowToGalleryPhoto(data);
}

export async function updatePhoto(id: string, input: GalleryInput): Promise<GalleryItem> {
  requireDusun(requireSession());
  const existing = galleryStore.getState().items.find((p) => p.id === id);
  if (!existing) throw new Error("Foto tidak ditemukan.");
  validate(input);

  const { data, error } = await getSupabase()
    .from("gallery_photos")
    .update(toRow(input))
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw toUserError(error, "Foto gagal disimpan.");
  if (!data) throw new Error("Foto tidak ditemukan atau Anda tidak memiliki akses.");

  await removeMedia(droppedMedia([existing.image], [input.image]));
  await galleryStore.refresh();
  return rowToGalleryPhoto(data);
}

export async function deletePhoto(id: string): Promise<void> {
  requireDusun(requireSession());
  const existing = galleryStore.getState().items.find((p) => p.id === id);
  if (!existing) throw new Error("Foto tidak ditemukan.");

  const { error } = await getSupabase().from("gallery_photos").delete().eq("id", id);
  if (error) throw toUserError(error, "Foto gagal dihapus.");

  await removeMedia([existing.image]);
  await galleryStore.refresh();
}
