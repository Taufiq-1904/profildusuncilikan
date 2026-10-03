# Panduan Migrasi: Vercel + Supabase + Domain

Urutan kerja yang aman. Kerjakan berurutan, jangan loncat.

## Gambaran besar

| Bagian | Tugasnya | Sekarang |
|---|---|---|
| **GitHub** | Menyimpan kode, jadi sumber deploy | belum |
| **Vercel** | Menjalankan website (hosting) | belum |
| **Supabase** | Database + login pengelola + penyimpanan gambar | belum, data masih `localStorage` |
| **Domain** | Alamat `dusuncilikan.web.id` | belum |

**Penting:** saat ini berita/UMKM/dll tersimpan di `localStorage`, artinya hanya terlihat di browser
si pengisi. Kata sandi akun juga tertulis di `lib/data/authData.ts`, sehingga ikut terkirim ke browser
semua pengunjung. **Jangan umumkan website ke warga sebelum Tahap 4 (login Supabase) selesai.**

---

## Tahap 1 — Simpan kode di GitHub

1. Buat akun di github.com, lalu **New repository** (nama: `profil-dusun-cilikan`, pilih *Private*).
2. Di folder proyek:
   ```bash
   git init
   git add .
   git commit -m "Versi awal"
   git branch -M main
   git remote add origin https://github.com/USERNAME/profil-dusun-cilikan.git
   git push -u origin main
   ```
3. File `.gitignore` sudah disiapkan, jadi `node_modules` dan `.env.local` tidak ikut terunggah.
   Jangan pernah meng-commit file `.env.local`.

## Tahap 2 — Deploy ke Vercel (pakai data bawaan dulu)

1. Daftar di vercel.com dengan akun GitHub.
2. **Add New → Project** → pilih repo `profil-dusun-cilikan` → **Import**.
3. Framework otomatis terdeteksi **Next.js**. Biarkan pengaturan bawaan, klik **Deploy**.
4. Setelah selesai kamu dapat alamat sementara `nama-proyek.vercel.app`. Cek semua halaman.
5. Mulai sekarang, setiap `git push` ke `main` otomatis men-deploy ulang.

## Tahap 3 — Siapkan Supabase

1. Daftar di supabase.com → **New project**. Pilih region terdekat (**Southeast Asia / Singapore**),
   simpan *database password* di tempat aman.
2. Buka **SQL Editor → New query**, tempel seluruh isi `supabase/schema.sql`, klik **Run**.
   Ini membuat tabel wilayah, berita, UMKM, organisasi, struktur dusun, pin peta, aturan hak akses (RLS),
   dan bucket gambar `media`.
3. Ambil kunci di **Project Settings → API** (atau tombol **Connect**):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** (`sb_publishable_...`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Jangan pakai atau membagikan `secret`/`service_role` key di kode browser.
4. Lokal: salin `.env.example` jadi `.env.local`, isi nilainya.
5. Vercel: **Project → Settings → Environment Variables**, tambahkan tiga variabel yang sama
   (termasuk `NEXT_PUBLIC_SITE_URL`), lalu **Redeploy**.

## Tahap 4 — Pindahkan login ke Supabase Auth

1. **Authentication → Users → Add user** untuk tiap akun (admin, rw09, rw10, rt01–rt04).
   Supabase memakai email. Pakai email pengurus, atau email alias per akun. Centang *Auto Confirm User*.
2. Salin UUID tiap user, lalu daftarkan profilnya (contoh ada di bagian paling bawah `schema.sql`):
   ```sql
   insert into public.profiles (id, display_name, role, wilayah_id) values
     ('UUID-ADMIN', 'Admin Dusun Cilikan', 'dusun', 'dusun');
   ```
3. Kode login perlu diganti dari `lib/auth.ts` (localStorage) ke `supabase.auth.signInWithPassword`,
   plus file `proxy.ts` untuk menyegarkan sesi (di Next.js 16 namanya `proxy.ts`, bukan `middleware.ts`).
4. Setelah ini, hapus `lib/data/authData.ts` supaya kata sandi lama tidak lagi ada di kode.

## Tahap 5 — Pindahkan data per modul

Semua akses data sudah lewat `lib/*Service.ts`, jadi UI tidak perlu berubah. Satu modul per langkah,
tes dulu, baru lanjut:

1. Struktur dusun (`dusunOfficialService.ts`) — paling sederhana
2. Berita (`newsService.ts`)
3. UMKM (`umkmService.ts`)
4. Organisasi (`organizationService.ts`)
5. Pin peta (`mapService.ts`)
6. Gambar: ganti data URL jadi unggah ke bucket `media` (`lib/image-upload.ts`), simpan URL-nya.
   Tambahkan host Supabase ke `images.remotePatterns` di `next.config.ts` bila memakai `next/image`.

Data contoh (seed) di `lib/data/*` dimasukkan ke tabel sekali saja lewat SQL atau Table Editor.

## Tahap 6 — Beli dan sambungkan domain `dusuncilikan.web.id`

**Beli:**
1. Pilih registrar resmi PANDI, misalnya DomaiNesia, Niagahoster, Exabytes, IDwebhost, atau Jagoweb.
2. Cek ketersediaan `dusuncilikan.web.id`. Harga `.web.id` sekitar puluhan ribu rupiah per tahun
   (sering ada promo tahun pertama; perpanjangan biasanya lebih mahal, cek sebelum bayar).
3. Syarat dokumen berbeda antar registrar, ada yang tanpa dokumen, ada yang meminta scan KTP
   penanggung jawab. Siapkan KTP, verifikasi biasanya 1x24 jam.
4. Aktifkan **WHOIS privacy** bila ditawarkan, dan catat login registrar di tempat aman.
   Catatan: ada juga ekstensi `.desa.id` yang khusus desa, tapi syaratnya berbeda.

**Sambungkan ke Vercel:**
1. Vercel → Project → **Settings → Domains → Add** → ketik `dusuncilikan.web.id`.
2. Vercel menampilkan record DNS yang dibutuhkan. **Pakai nilai yang tampil di dashboard kamu**.
   Pada umumnya:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | nilai yang ditampilkan Vercel (mis. `cname.vercel-dns.com`) |

3. Buka panel **Manajemen DNS** di registrar, tambahkan dua record itu, simpan.
4. Kembali ke Vercel, tunggu status berubah **Valid Configuration** (menit sampai beberapa jam).
   SSL/HTTPS terpasang otomatis.
5. Jadikan `dusuncilikan.web.id` sebagai *primary*; `www` diarahkan (redirect) ke sana.
6. Pastikan `NEXT_PUBLIC_SITE_URL=https://dusuncilikan.web.id` di Vercel, lalu redeploy
   (dipakai untuk sitemap, robots, dan metadata SEO).
7. Di Supabase → **Authentication → URL Configuration**, isi **Site URL** dengan domain final.

## Checklist sebelum diumumkan

- [ ] Login Supabase aktif, `authData.ts` sudah dihapus
- [ ] Data tersimpan di Supabase (buka dari HP lain, datanya sama)
- [ ] Coba login sebagai akun RT: tidak bisa mengubah data RT/RW lain
- [ ] Gambar tersimpan di Supabase Storage, bukan data URL
- [ ] HTTPS aktif, `www` mengarah ke domain utama
- [ ] Sitemap terbuka di `/sitemap.xml`
