# Panduan Migrasi: Vercel + Supabase + Domain

Urutan kerja yang aman. Kerjakan berurutan, jangan loncat.

## Gambaran besar

| Bagian | Tugasnya | Sekarang |
|---|---|---|
| **GitHub** | Menyimpan kode, jadi sumber deploy | belum |
| **Vercel** | Menjalankan website (hosting) | belum |
| **Supabase** | Database + login pengelola + penyimpanan gambar | belum, data masih `localStorage` |
| **Domain** | Alamat `dusuncilikan.web.id` | belum |

**Status kode:** seluruh data (berita, UMKM, organisasi, struktur dusun, pin peta, potensi RT, kependudukan per RT),
login pengelola, dan gambar sudah memakai Supabase. Tidak ada lagi yang disimpan di `localStorage`,
dan kata sandi tidak lagi ada di kode. Yang perlu kamu lakukan hanya menyiapkan project Supabase (Tahap 3-5 di bawah).

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

1. Daftar di supabase.com → **New project**. Pilih region **Southeast Asia (Singapore)**, simpan *database password*.
2. **SQL Editor → New query**, tempel seluruh isi `supabase/schema.sql`, klik **Run**.
   Membuat tabel, aturan hak akses (RLS), fungsi login username, dan bucket gambar `media`.
3. (Opsional) Jalankan `supabase/seed.sql` untuk memasukkan data contoh (berita, organisasi, struktur dusun, 1 pin).
   Lewati bila ingin mulai kosong.
4. Ambil kunci di **Project Settings → API**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** (`sb_publishable_...`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **Secret / service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (rahasia, hanya di server/Vercel,
     tanpa awalan `NEXT_PUBLIC_`; dipakai hanya untuk fitur "Atur ulang password akun").
5. Lokal: salin `.env.example` jadi `.env.local`, isi nilainya. Vercel: tambahkan variabel yang sama, lalu **Redeploy**.

## Tahap 4 — Buat akun pengelola

1. **Authentication → Users → Add user** untuk tiap akun (admin, rw09, rw10, rt01–rt04), isi email dan password
   yang kuat, centang *Auto Confirm User*. Email boleh alias (mis. `rt01@dusuncilikan.web.id`); warga tidak melihatnya,
   pengelola login memakai **username**.
2. Salin UUID tiap user, lalu jalankan di SQL Editor (ganti UUID):
   ```sql
   insert into public.profiles (id, username, display_name, role, wilayah_id) values
     ('UUID-ADMIN', 'admin', 'Admin Dusun Cilikan', 'dusun', 'dusun'),
     ('UUID-RW09',  'rw09',  'Ketua RW 09',        'rw',    'rw09'),
     ('UUID-RW10',  'rw10',  'Ketua RW 10',        'rw',    'rw10'),
     ('UUID-RT01',  'rt01',  'Ketua RT 01',        'rt',    'rt01'),
     ('UUID-RT02',  'rt02',  'Ketua RT 02',        'rt',    'rt02'),
     ('UUID-RT03',  'rt03',  'Ketua RT 03',        'rt',    'rt03'),
     ('UUID-RT04',  'rt04',  'Ketua RT 04',        'rt',    'rt04');
   ```
3. Di **Authentication → URL Configuration** isi *Site URL* dengan domain final.

## Catatan: struktur per wilayah dan ganti periode

Nama dukuh, ketua RW, dan ketua RT **tidak ada di kode**. Semuanya ada di tabel `dusun_officials`
(Dashboard > Struktur). Setiap baris dimiliki satu wilayah (`owner_id`):

| Akun | Boleh mengisi struktur |
|---|---|
| Dusun | dusun (dan semua RW/RT) |
| RW | RW-nya + RT di bawahnya |
| RT | RT-nya saja |

Aturan ini dijalankan di database (RLS), bukan hanya disembunyikan di tampilan.

- **Database baru:** `schema.sql` (+ `seed.sql` bila mau data contoh) sudah lengkap.
- **Database yang sudah berisi data:** jalankan sekali `supabase/migrasi-ketua-wilayah.sql`.
  Skrip itu memindahkan ketua RW/RT dan pendampingnya ("Ibu Ketua ...") ke struktur wilayah masing-masing
  dan menandai kepalanya. Hasil cek di akhir skrip harus 7 baris; bila kurang, tandai sisanya lewat Edit.
- **Ganti periode:** login > Struktur > pilih wilayah > Edit pada jabatannya > ganti Nama dan Periode > Simpan.
  Centang "Ini Dukuh / Ketua RT 01 / ..." menandai orang tersebut sebagai kepala wilayahnya; beranda, halaman
  Pemerintahan, tabel RT, dan dashboard membaca namanya dari situ.
- Sekretaris/Bendahara RT diambil dari baris di struktur RT yang jabatannya diawali "Sekretaris" / "Bendahara".
- Potensi di beranda dan halaman Potensi diambil dari data yang diinput di Dashboard > RT > Potensi RT (tabel `rt_potensi`).

---

## Catatan: konten beranda, profil, kontak, dan galeri (khusus Dukuh)

Teks beranda, sambutan, sejarah, visi-misi, kondisi geografis, kontak, media sosial, dan foto (latar beranda,
foto "Tentang Dusun", galeri) **tidak ada di kode**. Semuanya diubah akun **Dusun** lewat
**Dashboard > Beranda & Profil** dan **Dashboard > Galeri**. Akun RW/RT tidak melihat menu itu, dan database
menolak tulisan dari mereka (RLS `is_dusun()`, termasuk unggahan ke folder `situs` di Storage).

- **Database yang sudah berisi data:** jalankan sekali `supabase/migrasi-konten-situs.sql`.
- **Database baru:** `schema.sql` sudah termasuk (bagian 9).
- Sebelum Dukuh menyimpan apa pun, situs memakai **isi bawaan** (`lib/data/siteSettingsData.ts`), jadi tidak ada
  halaman kosong. Setelah tombol **Simpan semua** ditekan, nilai dari database yang dipakai.
- Kolom yang dikosongkan tidak ditampilkan (kartu kontak, batas wilayah, sambutan, galeri di beranda), jadi tidak ada
  tombol mati atau tulisan "Data menyusul".
- Nomor telepon, WhatsApp, email, dan media sosial **sengaja kosong** sampai Dukuh mengisinya (isi lama hanya contoh).
- Isi bawaan geografis (luas 6,62 km², ketinggian ± 275 m, curah hujan ± 2.225 mm/tahun, batas kalurahan) adalah
  angka **tingkat Kalurahan Umbulmartani** dari Peraturan Bupati Sleman No. 86 Tahun 2025 dan website kalurahan.
  Titik lokasi bawaan hanya perkiraan Balai Padukuhan; konfirmasi lewat peta di tab Kontak.

## Tahap 5 — Cara kerja penyimpanan (untuk referensi)

| Data | Tabel | Siapa yang boleh mengubah |
|---|---|---|
| Berita | `news` | Pengelola wilayahnya (draft hanya terlihat pengelola) |
| UMKM | `umkm` | Pengelola RT-nya (nonaktif hanya terlihat pengelola) |
| Organisasi | `organizations` | Pengelola wilayahnya |
| Struktur dusun | `dusun_officials` | Akun Dusun |
| Pin peta | `map_pins` | Pengelola wilayahnya |
| Potensi RT | `rt_potensi` | Pengelola RT-nya |
| Kependudukan (jumlah laki-laki, perempuan, KK, kelompok usia) | `rt_demografi` | Pengelola RT-nya (RW dan Dusun juga bisa) |
| Gambar | Storage bucket `media` | Pengelola yang login |

Aturan akses dijalankan di database (RLS), jadi akun RT tidak bisa mengubah data RT/RW lain walau
memanipulasi browser. Gambar diunggah ke bucket `media` dan yang disimpan di tabel hanya URL-nya.

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

- [ ] Semua akun pengelola sudah dibuat + didaftarkan di `profiles`, login dengan username berhasil
- [ ] Data tersimpan di Supabase (buka dari HP lain, datanya sama)
- [ ] Coba login sebagai akun RT: tidak bisa mengubah data RT/RW lain
- [ ] Gambar tersimpan di Supabase Storage, bukan data URL
- [ ] HTTPS aktif, `www` mengarah ke domain utama
- [ ] Sitemap terbuka di `/sitemap.xml`
