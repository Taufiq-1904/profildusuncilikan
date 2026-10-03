import { redirect } from "next/navigation";

// Halaman berita per-RT yang lama memakai penyimpanan lokal dan sudah digantikan
// oleh modul Berita di dashboard (tersimpan di Supabase, bisa difilter per
// wilayah). Alamat lama tetap hidup dan diarahkan ke sana.
export default async function RTBeritaRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard/berita?wilayah=${encodeURIComponent(id)}`);
}
