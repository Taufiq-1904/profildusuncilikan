# Desa Cilikan — Website Profil Desa

Foundation/template website profil desa modern untuk **Desa Cilikan** (desa fiktif), dibangun dengan Next.js App Router, TypeScript, dan Tailwind CSS. Website ini berfungsi sebagai **portal informasi dan digitalisasi dusun**, dengan dashboard pengelola berbasis peran (Dusun, RW, RT). Fitur keuangan dan data warga individual sudah dihapus.

## Tech Stack

- **Next.js 16** (App Router, Server Components by default)
- **TypeScript**
- **Tailwind CSS v4**
- Komponen UI bergaya **shadcn/ui** (dibangun manual dengan `class-variance-authority`, tanpa CLI — lihat catatan di bawah)
- **Lucide Icons**
- Siap diintegrasikan dengan **Supabase** (database & image storage)
- Target deploy: **Vercel**

## Status Pengembangan

| Phase | Isi | Status |
|-------|-----|--------|
| 1 | Hierarki Dusun → RW → RT, role RW, hapus fitur keuangan | Selesai |
| 2 | Berita (CMS), dashboard & otorisasi per role | Selesai |
| 3 | Organisasi & komunitas, struktur organisasi dusun, UMKM | Selesai |
| 4 | Redesain peta, marker klik, tombol Google Maps | Selesai |
| 5 | Performa, SEO, aksesibilitas, uji responsif akhir | Selesai |

### Hierarki wilayah dan hak akses

Wilayah didefinisikan relasional di `lib/data/wilayahData.ts` (`rwList`, `rtList` dengan `rwId`). Tidak ada logika `if RW09 then RT01`; penambahan RW/RT cukup menambah data. Hak akses dihitung di `lib/auth.ts` (`canManageWilayah`) dan **diperiksa ulang di setiap service** (`lib/access.ts`), bukan hanya disembunyikan di UI:

- **Dusun**: semua data, ditambah struktur organisasi dusun dan peta dusun.
- **RW**: RW-nya sendiri dan semua RT di bawahnya.
- **RT**: hanya RT-nya sendiri.

### Modul data (Phase 3)

| Modul | Service | Halaman publik | Dashboard |
|-------|---------|----------------|-----------|
| Berita | `lib/newsService.ts` | `/berita`, `/berita/[slug]` | `/dashboard/berita` |
| Organisasi & komunitas | `lib/organizationService.ts` | `/organisasi`, `/organisasi/[slug]` | `/dashboard/organisasi` |
| UMKM | `lib/umkmService.ts` | `/umkm`, `/umkm/[slug]` | `/dashboard/umkm` |
| Struktur organisasi dusun | `lib/dusunOfficialService.ts` | `/profil/struktur` | `/dashboard/struktur` (hanya Dusun) |
| Konten situs (beranda, profil, geografis, kontak) | `lib/siteSettingsService.ts` | `/`, `/profil`, `/kontak`, footer | `/dashboard/beranda` (hanya Dusun) |
| Galeri | `lib/galleryService.ts` | `/galeri`, beranda | `/dashboard/galeri` (hanya Dusun) |

Struktur kepengurusan organisasi bersifat **opsional**: organisasi boleh hanya berupa profil. Bagan struktur dusun bersifat data-driven (baris = `tier`, urutan = `order`), tanpa data yang ditulis langsung di komponen.

### Penyimpanan data

Semua data tersimpan di **Supabase** (Postgres + Auth + Storage); tidak ada yang disimpan di `localStorage`.

- Skema, RLS, dan fungsi: `supabase/schema.sql`. Data contoh: `supabase/seed.sql`. Langkah setup: `MIGRASI.md`.
- Browser membaca/menulis lewat `lib/*Service.ts` yang memakai `lib/supabase/client.ts`. Daftar dimuat sekali dan di-cache di memori oleh `lib/remoteStore.ts`, lalu dimuat ulang setelah setiap tambah/ubah/hapus atau login/logout.
- Login memakai Supabase Auth (username dipetakan ke email oleh fungsi `login_email`). Sesi disegarkan oleh `proxy.ts`.
- Hak akses sebenarnya dijaga Row Level Security di database; pemeriksaan di `lib/auth.ts` hanya untuk UI dan pesan error.
- Gambar diunggah ke bucket `media` (`lib/image-upload.ts`); tabel hanya menyimpan URL-nya.
- Metadata SEO, JSON-LD, dan sitemap dibaca di server lewat `lib/server/public-content.ts` (hanya konten publik).
- Reset password akun lain memakai `app/api/admin/reset-password/route.ts` dan `SUPABASE_SERVICE_ROLE_KEY` (server saja).


### Peta (Phase 4)

Peta lama (`components/ui/interactive-map.tsx`) memuat Leaflet secara statis di setiap halaman yang mengandungnya, menjalankan animasi CSS tanpa henti pada tiap marker, dan menduplikasi dua UMKM sebagai pin terpisah. Diganti dengan `components/map/`:

| File | Peran |
|------|-------|
| `place-map.tsx` | Pembungkus tipis di atas Leaflet. Dimuat lewat `next/dynamic({ ssr:false })` sehingga Leaflet dan CSS-nya hanya terunduh saat peta benar-benar akan tampil. |
| `place-map-view.tsx` | Menunda `place-map.tsx` sampai elemen hampir terlihat (`IntersectionObserver`), dengan kerangka placeholder berukuran sama agar tidak ada layout shift. |
| `marker-icons.tsx` | Satu ikon per jenis lokasi (bukan animasi/filter SVG per marker), dipakai ulang oleh peta, legenda, dan daftar. |
| `place-card.tsx`, `place-list.tsx`, `map-explorer.tsx` | Kartu detail saat marker diklik, daftar lokasi sebagai alternatif teks, dan penjelajah peta publik (`/peta` dan pratinjau beranda). |

Sumber data peta digabung oleh `lib/mapPlaces.ts` (`buildMapPlaces`): pin umum dari `lib/mapService.ts`, ditambah UMKM aktif dan organisasi yang koordinatnya sudah diisi — jadi UMKM tidak perlu didata dua kali sebagai pin terpisah lagi. Pin lama yang menduplikasi UMKM (`pin-004`, `pin-008`) sudah dihapus dari seed; kalau ada yang tersimpan di localStorage browser lama, `buildMapPlaces` menyaringnya otomatis (radius ~30 m dari UMKM yang sama).

Setiap marker punya popup berisi nama, jenis, foto (jika ada), alamat singkat, tombol "Lihat Detail" (jika punya halaman internal), dan "Buka di Google Maps" — dibangun dari `lib/links.ts` (`googleMapsUrl`, memakai link eksplisit atau koordinat). Form UMKM, organisasi, dan pin berbagi komponen `LocationFields` (`components/dashboard/location-fields.tsx`); menempelkan link Google Maps lengkap otomatis mengisi koordinat lewat `parseCoordinatesFromUrl`.


### Phase 5: performa, SEO, aksesibilitas, responsif

**Bug yang diperbaiki (ditemukan saat audit sebelum menulis kode):**
- Nama dusun tidak konsisten di seluruh situs — konten asli memakai "Dusun Cilikan" sementara hierarki wilayah, akun, dan dashboard (dari Phase 1 dan seterusnya) memakai "Dusun Cilikan". Disatukan menjadi **Dusun Cilikan** di semua salinan teks, judul halaman, dan metadata.
- `metadataBase` (layout), `sitemap.ts`, dan `robots.ts` memakai tiga domain placeholder yang berbeda. Disatukan menjadi satu domain di ketiganya.
- `/berita` dan `/berita/[slug]` sepenuhnya client-render tanpa `generateMetadata` sama sekali — jadi tautan berita yang dibagikan ke WhatsApp/media sosial tidak punya judul, deskripsi, atau gambar pratinjau. Dipecah mengikuti pola UMKM/organisasi: `page.tsx` sebagai server component pembawa metadata, isinya di `components/sections/news-list.tsx` dan `news-detail.tsx`.
- **Sidebar dashboard tidak responsif** — lebar tetap 256px tanpa mode mobile sama sekali, sehingga di layar sempit sebagian sidebar terpotong dan tidak ada cara membukanya. Diubah menjadi drawer geser dengan tombol hamburger di bawah breakpoint `lg`, tetap sebagai sidebar statis di desktop.
- Dua form (`add-pinpoint-modal.tsx`, `add-potensi-modal.tsx`) memakai `<label>` tanpa `htmlFor`/`id` yang menyambung ke input-nya — screen reader tidak bisa mengaitkan label dengan field. Diperbaiki, termasuk grup kategori dengan `<fieldset>`/`<legend>`.

**SEO:** setiap halaman berita/UMKM/organisasi kini punya `generateMetadata` (judul, deskripsi, Open Graph, gambar bila tersedia dan berupa URL — gambar `data:` dari unggahan browser sengaja dilewati karena tidak bisa diambil crawler). Ditambahkan data terstruktur JSON-LD: `GovernmentOrganization` di seluruh situs (root layout), `NewsArticle`/`LocalBusiness`/`Organization` di masing-masing halaman detail (`components/seo/json-ld.tsx`). Ditambahkan `app/manifest.ts`, dan `app/robots.ts` sekarang men-disallow `/dashboard` dan `/login` dari pengindeksan.

**Aksesibilitas & UX:** ditambahkan `app/not-found.tsx` (404 sesuai desain situs) dan `app/loading.tsx` (indikator transisi rute).

**Performa:** `next.config.ts` menonaktifkan header `X-Powered-By`. Peta (Phase 4) sudah lazy-load; halaman berita kini SSR-friendly (lihat di atas). Tidak ada perubahan lain yang diperlukan — pola pemisahan server/client yang sudah dipakai konsisten sejak Phase 2–4 (server component pembawa metadata + client component untuk bagian interaktif) sudah sesuai rekomendasi Next.js.

## Menjalankan Project

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Build produksi:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Struktur Folder

```
app/
├── page.tsx                 # Homepage
├── profil/page.tsx          # Sejarah, visi-misi, geografis, demografi, wilayah
├── pemerintahan/page.tsx    # Struktur pemerintahan & perangkat desa
├── potensi/
│   ├── page.tsx             # Daftar potensi desa
│   └── [id]/page.tsx        # Detail potensi
├── berita/
│   ├── page.tsx             # Daftar berita (search, filter, pagination)
│   └── [slug]/page.tsx      # Detail berita
├── galeri/page.tsx          # Galeri foto dengan filter kategori + lightbox
├── kontak/page.tsx          # Kontak & lokasi
├── sitemap.ts                # Sitemap dinamis (termasuk semua slug)
├── robots.ts                 # robots.txt
└── globals.css                # Design tokens (warna, tipografi, animasi)

components/
├── layout/    # Navbar, Footer, Container, Breadcrumb, VillageMark (logo)
├── sections/  # Hero, Stats, PotentialsSection, NewsSection, GalleryGrid, MapSection, dst.
├── cards/     # StatCard, NewsCard, PotentialCard, OfficialCard, GalleryCard
└── ui/        # Button, Badge, Card, ImagePlaceholder

lib/
├── data/      # Semua dummy data (siteConfig, villageData, officialsData, newsData, galleryData)
├── icon-map.tsx  # Pemetaan nama ikon -> komponen Lucide
└── utils.ts      # Helper cn() dan formatDate()

public/
└── images/    # Tempat menaruh gambar asli nantinya
```

## Cara Mengganti Informasi Desa

Semua data terpusat di `lib/data/`, terpisah dari UI — cukup edit file-nya, tidak perlu menyentuh komponen.

- **Nama desa, tagline, alamat, kontak, media sosial, menu navigasi** → `lib/data/siteConfig.ts`
- **Sejarah, visi-misi, geografis, demografi, wilayah administratif** → `lib/data/villageData.ts`
- **Kepala desa, perangkat, kepala dusun, struktur organisasi** → `lib/data/officialsData.ts`

## Cara Mengganti Gambar

Saat ini semua gambar menggunakan komponen `<ImagePlaceholder />` (di `components/ui/image-placeholder.tsx`) — sebuah visual bermerek (gradient + motif garis kontur + ikon) yang aman digunakan sebagai placeholder tanpa bergantung pada URL foto eksternal yang mudah mati.

Untuk mengganti dengan gambar asli:

1. Siapkan gambar di salah satu sumber berikut:
   - **Lokal** — taruh file di `public/images/...`, lalu gunakan `next/image` dengan `src="/images/nama-file.jpg"`.
   - **Supabase Storage** — upload ke bucket, gunakan public URL atau signed URL sebagai `src`.
   - **CDN** — gunakan URL CDN langsung.
2. Ganti pemanggilan `<ImagePlaceholder tone="..." icon="..." label="..." className="..." />` dengan `<Image src="..." alt="..." fill className="object-cover" />` (bungkus dalam elemen `relative` dengan ukuran yang sama).
3. Tambahkan domain gambar (Supabase/CDN) ke `images.remotePatterns` di `next.config.ts` bila memakai `next/image` dengan URL eksternal.

Setiap penggunaan `ImagePlaceholder` memiliki atribut `data-image-slot` yang menandai gambar apa yang seharusnya ada di sana — memudahkan pencarian saat mengganti massal.

## Cara Menambahkan Berita

Edit `lib/data/newsData.ts`, tambahkan object baru ke array `newsArticles`:

```ts
{
  slug: "judul-berita-anda",       // dipakai di URL /berita/judul-berita-anda
  title: "Judul Berita",
  category: "Pemerintahan",         // salah satu: Pemerintahan | Pembangunan | Kegiatan Warga | Ekonomi | Pengumuman
  date: "2026-08-20",                // format YYYY-MM-DD
  author: "Nama Penulis",
  excerpt: "Ringkasan singkat berita...",
  content: ["Paragraf pertama...", "Paragraf kedua..."],
  imageTone: "green",                // green | gold | sky | clay — warna placeholder
}
```

Halaman daftar (`/berita`), homepage, halaman detail (`/berita/[slug]`), dan `sitemap.xml` akan otomatis menampilkan/mendaftarkan berita baru — tidak perlu edit komponen.

## Cara Menambahkan Potensi Dusun

Potensi tidak ditulis di kode. Pengelola menambahkannya lewat Dashboard > pilih RT > tab **Potensi RT** > **Tambah Potensi** (judul, kategori, deskripsi). Datanya tersimpan di tabel `rt_potensi` dan langsung tampil di beranda, halaman `/potensi`, dan halaman detailnya. Bila belum ada data, bagian potensi di beranda disembunyikan dan halaman `/potensi` menampilkan keterangan kosong.

## Deployment ke Vercel

1. Push project ke repository Git (GitHub/GitLab/Bitbucket).
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repository.
3. Framework preset otomatis terdeteksi sebagai **Next.js**, tidak perlu konfigurasi tambahan.
4. Jika sudah terhubung ke Supabase, tambahkan environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dst.) di **Project Settings → Environment Variables**.
5. Klik **Deploy**.

## Catatan Teknis

- **Font**: Font Google (`Fraunces` untuk display, `Plus Jakarta Sans` untuk body) sudah disiapkan sebagai bagian dari desain, namun di environment build ini akses ke `fonts.googleapis.com` tidak tersedia sehingga project memakai fallback system-font stack di `app/globals.css`. Jika deployment Anda punya akses internet penuh (mis. Vercel), aktifkan kembali dengan `next/font/google` — lihat komentar di `app/layout.tsx`.
- **shadcn/ui**: komponen (`Button`, `Badge`, `Card`) dibuat manual mengikuti pola resmi shadcn (cva + Tailwind + Radix Slot) tanpa menjalankan CLI `shadcn init`, karena registry `ui.shadcn.com` tidak dapat diakses dari environment build ini. Struktur file tetap kompatibel bila Anda ingin menambah komponen lain lewat CLI di lingkungan yang memiliki akses.
- **Peta**: Section peta (`components/sections/map-section.tsx`) memiliki placeholder pada elemen `data-map-embed` — ganti dengan `<iframe src="https://www.google.com/maps/embed?...">` untuk lokasi kantor dukuh yang sebenarnya.
