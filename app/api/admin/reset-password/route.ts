import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MIN_PASSWORD_LENGTH = 8;

// Mengatur ulang password akun pengelola lain. Hanya boleh dipanggil oleh akun
// berperan "dusun". Butuh SUPABASE_SERVICE_ROLE_KEY di environment server.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sesi login tidak ditemukan. Silakan masuk kembali." }, { status: 401 });
  }

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (me?.role !== "dusun") {
    return NextResponse.json(
      { error: "Hanya akun Dusun yang dapat mengatur ulang password akun lain." },
      { status: 403 }
    );
  }

  let body: { userId?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
  const userId = typeof body.userId === "string" ? body.userId : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!userId) return NextResponse.json({ error: "Akun tujuan tidak valid." }, { status: 400 });
  if (password.length < MIN_PASSWORD_LENGTH || password !== password.trim()) {
    return NextResponse.json(
      { error: `Password minimal ${MIN_PASSWORD_LENGTH} karakter dan tanpa spasi di awal/akhir.` },
      { status: 400 }
    );
  }

  // Tujuan harus akun pengelola yang terdaftar.
  const { data: target } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!target) return NextResponse.json({ error: "Akun tujuan tidak ditemukan." }, { status: 404 });

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Fitur ini belum aktif: SUPABASE_SERVICE_ROLE_KEY belum diisi di server." },
      { status: 500 }
    );
  }

  const { error } = await admin.auth.admin.updateUserById(userId, { password });
  if (error) {
    console.error("Reset password gagal:", error);
    return NextResponse.json({ error: "Password gagal diatur ulang." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
