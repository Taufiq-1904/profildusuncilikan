import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { SITE_SETTINGS_TAG } from "@/lib/server/site-settings";
import { createClient } from "@/lib/supabase/server";

// Dipanggil dashboard setelah Dukuh menyimpan konten situs, supaya HTML yang
// di-cache server ikut diperbarui seketika (bukan menunggu 5 menit).
// Hanya akun berperan "dusun" yang boleh memicunya.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sesi login tidak ditemukan." }, { status: 401 });
  }

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (me?.role !== "dusun") {
    return NextResponse.json({ error: "Hanya akun Dusun yang dapat melakukan ini." }, { status: 403 });
  }

  revalidateTag(SITE_SETTINGS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
