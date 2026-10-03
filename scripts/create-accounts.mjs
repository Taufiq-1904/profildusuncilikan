// Membuat (atau memperbarui) akun pengelola beserta barisnya di tabel profiles.
// Aman dijalankan ulang: akun yang sudah ada hanya diperbarui password dan profilnya.
//
// Dari folder proyek (PowerShell):
//   $env:SEED_PASSWORD = "password-yang-kamu-mau"
//   node --env-file=.env.local scripts/create-accounts.mjs
//
// Butuh NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local.
// Service role key hanya dipakai dari komputer kamu, jangan dimasukkan ke kode situs.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.SEED_PASSWORD;

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local.");
  process.exit(1);
}
if (!password || password.length < 6) {
  console.error("Isi SEED_PASSWORD dulu (minimal 6 karakter).");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Email hanya dipakai di balik layar; pengelola login dengan username.
// Akun admin memakai email yang sudah terdaftar di Supabase.
const accounts = [
  { username: "admin", email: "admindusuncilikan@gmail.com", name: "Admin Dusun Cilikan", role: "dusun", wilayah: "dusun" },
  { username: "rw09", email: "rw09@dusuncilikan.web.id", name: "Ketua RW 09", role: "rw", wilayah: "rw09" },
  { username: "rw10", email: "rw10@dusuncilikan.web.id", name: "Ketua RW 10", role: "rw", wilayah: "rw10" },
  { username: "rt01", email: "rt01@dusuncilikan.web.id", name: "Ketua RT 01", role: "rt", wilayah: "rt01" },
  { username: "rt02", email: "rt02@dusuncilikan.web.id", name: "Ketua RT 02", role: "rt", wilayah: "rt02" },
  { username: "rt03", email: "rt03@dusuncilikan.web.id", name: "Ketua RT 03", role: "rt", wilayah: "rt03" },
  { username: "rt04", email: "rt04@dusuncilikan.web.id", name: "Ketua RT 04", role: "rt", wilayah: "rt04" },
];

async function findUserByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  return data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
}

async function ensureUser(email) {
  const existing = await findUserByEmail(email);
  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, { password });
    if (error) throw error;
    return { id: existing.id, created: false };
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  return { id: data.user.id, created: true };
}

for (const acc of accounts) {
  try {
    const { id, created } = await ensureUser(acc.email);

    const { error } = await supabase.from("profiles").upsert(
      {
        id,
        username: acc.username,
        display_name: acc.name,
        role: acc.role,
        wilayah_id: acc.wilayah,
      },
      { onConflict: "id" }
    );
    if (error) throw error;

    console.log(`${created ? "dibuat  " : "diperbarui"}  ${acc.username.padEnd(5)} (${acc.role}, ${acc.wilayah})`);
  } catch (e) {
    console.error(`GAGAL  ${acc.username}:`, e.message ?? e);
  }
}
