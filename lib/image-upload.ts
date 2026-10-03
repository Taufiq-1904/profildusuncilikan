const MAX_SOURCE_BYTES = 10 * 1024 * 1024;

// Downscales an uploaded image and returns it as a JPEG data URL. Covers are
// kept in localStorage for now, so they have to stay small; a 1200px-wide
// JPEG is usually well under 200 KB.
export async function fileToCompressedDataUrl(
  file: File,
  maxWidth = 1200,
  quality = 0.82
): Promise<string> {
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
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}
