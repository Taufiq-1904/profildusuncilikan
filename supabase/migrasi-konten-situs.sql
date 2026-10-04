-- ============================================================================
-- Migrasi: konten situs (beranda, profil, kontak) + galeri, khusus akun Dusun.
-- Jalankan SEKALI di Supabase > SQL Editor pada database yang SUDAH berisi data.
-- (Database baru cukup menjalankan schema.sql; bagian ini sudah termasuk.)
-- Aman dijalankan ulang. Tidak mengubah data yang sudah ada.
-- ============================================================================

-- 9. KONTEN SITUS (beranda, profil, kontak) + GALERI — KHUSUS AKUN DUSUN -------------
-- Aman dijalankan ulang. Dibaca siapa saja; ditulis hanya oleh akun berperan 'dusun'
-- (is_dusun()), dijalankan di database oleh RLS, bukan hanya disembunyikan di UI.

-- 9a. Satu baris pengaturan situs (id selalu 'main'). Kolom NULL = pakai isi bawaan
-- di lib/data/siteSettingsData.ts, jadi situs tidak pernah kosong sebelum Dukuh mengisi.
create table if not exists public.site_settings (
  id                text primary key default 'main' check (id = 'main'),
  tagline           text,
  short_description text,
  hero_image        text,
  welcome_message   text,
  location_note     text,
  about_photos      text[],
  excellence        text[],
  history_summary   text,
  timeline          jsonb,                 -- [{year,title,description}]
  vision            text,
  missions          text[],
  geo_area          text,
  geo_altitude      text,
  geo_climate       text,
  geo_north         text,
  geo_south         text,
  geo_east          text,
  geo_west          text,
  geo_topography    text,
  address           text,
  phone             text,
  whatsapp          text,
  email             text,
  service_hours     text,
  maps_url          text,
  lat               double precision,
  lng               double precision,
  instagram         text,
  facebook          text,
  youtube           text,
  kalurahan_address text,
  kalurahan_phone   text,
  updated_at        timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "site_read" on public.site_settings;
create policy "site_read" on public.site_settings for select using (true);
drop policy if exists "site_insert" on public.site_settings;
create policy "site_insert" on public.site_settings for insert
  with check (public.is_dusun());
drop policy if exists "site_update" on public.site_settings;
create policy "site_update" on public.site_settings for update
  using (public.is_dusun()) with check (public.is_dusun());
-- Sengaja tanpa policy delete: baris ini tidak boleh terhapus.

drop trigger if exists trg_site_touch on public.site_settings;
create trigger trg_site_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- 9b. Foto galeri
create table if not exists public.gallery_photos (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  category   text not null,
  image      text not null,                -- URL Supabase Storage (bucket media)
  span       text not null default 'normal' check (span in ('normal','tall','wide')),
  sort_order int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;

drop policy if exists "gallery_read" on public.gallery_photos;
create policy "gallery_read" on public.gallery_photos for select using (true);
drop policy if exists "gallery_write" on public.gallery_photos;
create policy "gallery_write" on public.gallery_photos for all
  using (public.is_dusun()) with check (public.is_dusun());

drop trigger if exists trg_gallery_touch on public.gallery_photos;
create trigger trg_gallery_touch before update on public.gallery_photos
  for each row execute function public.touch_updated_at();

-- 9c. Folder foto 'situs' di bucket media hanya boleh ditulis akun Dusun.
-- (Policy Postgres bersifat "atau", jadi policy lama diganti, bukan ditambah.)
drop policy if exists "media_upload" on storage.objects;
create policy "media_upload" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'media'
    and exists (select 1 from public.profiles where id = auth.uid())
    and ((storage.foldername(name))[1] is distinct from 'situs' or public.is_dusun())
  );
drop policy if exists "media_update" on storage.objects;
create policy "media_update" on storage.objects for update to authenticated
  using (
    bucket_id = 'media'
    and exists (select 1 from public.profiles where id = auth.uid())
    and ((storage.foldername(name))[1] is distinct from 'situs' or public.is_dusun())
  );
drop policy if exists "media_delete" on storage.objects;
create policy "media_delete" on storage.objects for delete to authenticated
  using (
    bucket_id = 'media'
    and exists (select 1 from public.profiles where id = auth.uid())
    and ((storage.foldername(name))[1] is distinct from 'situs' or public.is_dusun())
  );
