-- ============================================================================
-- Skema Supabase untuk Profil Dusun Cilikan
-- Jalankan SEKALI di Supabase > SQL Editor > New query > Run.
-- Aman dijalankan ulang (memakai "if not exists" / "or replace" / "drop policy").
-- ============================================================================

-- 1. WILAYAH (Dusun > RW > RT), relasional ------------------------------------
create table if not exists public.wilayah (
  id        text primary key,                       -- 'dusun', 'rw09', 'rt01'
  level     text not null check (level in ('dusun','rw','rt')),
  label     text not null,
  parent_id text references public.wilayah(id)      -- RT -> RW, RW -> dusun
);

insert into public.wilayah (id, level, label, parent_id) values
  ('dusun','dusun','Dusun Cilikan',null),
  ('rw09','rw','RW 09','dusun'),
  ('rw10','rw','RW 10','dusun'),
  ('rt01','rt','RT 01','rw09'),
  ('rt02','rt','RT 02','rw09'),
  ('rt03','rt','RT 03','rw10'),
  ('rt04','rt','RT 04','rw10')
on conflict (id) do nothing;

-- 2. PROFIL PENGELOLA (1 baris per akun Supabase Auth) -------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role         text not null check (role in ('dusun','rw','rt')),
  wilayah_id   text not null references public.wilayah(id)
);

-- 3. FUNGSI HAK AKSES (padanan canManageWilayah di lib/auth.ts) ----------------
create or replace function public.can_manage_wilayah(target text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    left join public.wilayah t on t.id = target
    where p.id = auth.uid()
      and (
        p.role = 'dusun'
        or p.wilayah_id = target
        or (p.role = 'rw' and t.parent_id = p.wilayah_id)
      )
  );
$$;

create or replace function public.is_dusun()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'dusun');
$$;

-- 4. TABEL KONTEN --------------------------------------------------------------
create table if not exists public.news (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text not null default '',
  content      text[] not null default '{}',          -- satu elemen = satu paragraf
  cover_image  text,                                  -- URL Supabase Storage
  category_id  text not null,
  status       text not null default 'draft' check (status in ('draft','published')),
  published_at date not null default current_date,
  author_id    uuid references auth.users(id),
  author_name  text not null default '',
  wilayah_id   text not null references public.wilayah(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.umkm (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  nama              text not null,
  jenis             text not null default '',
  pemilik           text not null default '',
  tampilkan_pemilik boolean not null default false,
  kontak            text,
  deskripsi         text,
  produk            text,
  alamat            text,
  jam_operasional   text,
  maps_url          text,
  lat               double precision,
  lng               double precision,
  logo              text,
  galeri            text[] not null default '{}',
  aktif             boolean not null default true,
  rt_id             text not null references public.wilayah(id),
  created_by        uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.organizations (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  logo         text,
  summary      text not null default '',
  description  text[] not null default '{}',
  field_id     text not null,
  wilayah_id   text not null references public.wilayah(id),
  founded_year int,
  leader       text,
  contact      text,
  alamat       text,
  maps_url     text,
  lat          double precision,
  lng          double precision,
  instagram    text,
  facebook     text,
  website      text,
  gallery      text[] not null default '{}',
  members      jsonb not null default '[]',           -- [{id,name,position,order}]
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.dusun_officials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  position   text not null,
  photo      text,
  period     text,
  tier       int not null default 1,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.map_pins (
  id         uuid primary key default gen_random_uuid(),
  nama       text not null,
  deskripsi  text not null default '',
  kategori   text not null,
  lat        double precision not null,
  lng        double precision not null,
  kontak     text,
  alamat     text,
  foto       text,
  maps_url   text,
  wilayah_id text not null references public.wilayah(id),
  created_at timestamptz not null default now()
);

-- 5. ROW LEVEL SECURITY --------------------------------------------------------
-- Ini pengaman sungguhan: dijalankan di database, bukan di UI.
alter table public.wilayah         enable row level security;
alter table public.profiles        enable row level security;
alter table public.news            enable row level security;
alter table public.umkm            enable row level security;
alter table public.organizations   enable row level security;
alter table public.dusun_officials enable row level security;
alter table public.map_pins        enable row level security;

-- wilayah & profil
drop policy if exists "wilayah_read" on public.wilayah;
create policy "wilayah_read" on public.wilayah for select using (true);

drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles for select
  using (id = auth.uid() or public.is_dusun());

-- berita: publik hanya melihat yang published; pengelola melihat wilayahnya
drop policy if exists "news_read" on public.news;
create policy "news_read" on public.news for select
  using (status = 'published' or public.can_manage_wilayah(wilayah_id));
drop policy if exists "news_write" on public.news;
create policy "news_write" on public.news for all
  using (public.can_manage_wilayah(wilayah_id))
  with check (public.can_manage_wilayah(wilayah_id));

-- UMKM: publik hanya melihat yang aktif
drop policy if exists "umkm_read" on public.umkm;
create policy "umkm_read" on public.umkm for select
  using (aktif or public.can_manage_wilayah(rt_id));
drop policy if exists "umkm_write" on public.umkm;
create policy "umkm_write" on public.umkm for all
  using (public.can_manage_wilayah(rt_id))
  with check (public.can_manage_wilayah(rt_id));

-- organisasi
drop policy if exists "org_read" on public.organizations;
create policy "org_read" on public.organizations for select using (true);
drop policy if exists "org_write" on public.organizations;
create policy "org_write" on public.organizations for all
  using (public.can_manage_wilayah(wilayah_id))
  with check (public.can_manage_wilayah(wilayah_id));

-- struktur dusun: baca publik, tulis hanya akun Dusun
drop policy if exists "off_read" on public.dusun_officials;
create policy "off_read" on public.dusun_officials for select using (true);
drop policy if exists "off_write" on public.dusun_officials;
create policy "off_write" on public.dusun_officials for all
  using (public.is_dusun()) with check (public.is_dusun());

-- pin peta
drop policy if exists "pins_read" on public.map_pins;
create policy "pins_read" on public.map_pins for select using (true);
drop policy if exists "pins_write" on public.map_pins;
create policy "pins_write" on public.map_pins for all
  using (public.can_manage_wilayah(wilayah_id))
  with check (public.can_manage_wilayah(wilayah_id));

-- 6. STORAGE (gambar) ----------------------------------------------------------
-- Bucket publik 'media': semua orang boleh melihat, hanya pengelola yang login
-- boleh mengunggah/mengubah/menghapus.
insert into storage.buckets (id, name, public) values ('media','media', true)
on conflict (id) do nothing;

drop policy if exists "media_upload" on storage.objects;
create policy "media_upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid()));
drop policy if exists "media_update" on storage.objects;
create policy "media_update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid()));
drop policy if exists "media_delete" on storage.objects;
create policy "media_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid()));

-- 7. LOGIN DENGAN USERNAME, TABEL TAMBAHAN, TRIGGER ------------------------------
-- Bagian ini yang membuat seluruh fitur aplikasi (login username, potensi RT,
-- kependudukan) tersimpan di Supabase. Aman dijalankan ulang.

-- 7a. Username untuk login (Supabase Auth sendiri memakai email)
alter table public.profiles add column if not exists username text;
create unique index if not exists profiles_username_key on public.profiles (lower(username));

-- Mengubah email login "username" -> email, supaya form login cukup meminta username.
-- Hanya mengembalikan email; password tetap diverifikasi oleh Supabase Auth.
create or replace function public.login_email(p_username text)
returns text
language sql stable security definer set search_path = public, auth
as $$
  select u.email::text
  from public.profiles p
  join auth.users u on u.id = p.id
  where lower(p.username) = lower(trim(p_username))
  limit 1;
$$;
revoke all on function public.login_email(text) from public;
grant execute on function public.login_email(text) to anon, authenticated;

-- Pengelola hanya boleh mengubah USERNAME miliknya sendiri. Role dan wilayah
-- tidak bisa diubah dari browser (tidak ada policy update pada profiles).
create or replace function public.change_my_username(p_username text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Belum login';
  end if;
  if p_username !~ '^[a-z0-9._-]{3,30}$' then
    raise exception 'Username tidak valid';
  end if;
  update public.profiles set username = p_username where id = auth.uid();
  if not found then
    raise exception 'Profil pengelola tidak ditemukan';
  end if;
end;
$$;
revoke all on function public.change_my_username(text) from public;
grant execute on function public.change_my_username(text) to authenticated;

-- 7b. Kolom tambahan
alter table public.news add column if not exists author_username text not null default '';

-- 7c. Potensi RT
create table if not exists public.rt_potensi (
  id         uuid primary key default gen_random_uuid(),
  rt_id      text not null references public.wilayah(id),
  judul      text not null,
  deskripsi  text not null default '',
  kategori   text not null default 'Lainnya',
  foto       text,                         -- URL Supabase Storage (bucket media)
  created_by uuid references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Untuk database lama yang tabelnya sudah dibuat sebelum ada kolom foto.
alter table public.rt_potensi add column if not exists foto text;

alter table public.rt_potensi enable row level security;

drop policy if exists "potensi_read" on public.rt_potensi;
create policy "potensi_read" on public.rt_potensi for select using (true);
drop policy if exists "potensi_write" on public.rt_potensi;
create policy "potensi_write" on public.rt_potensi for all
  using (public.can_manage_wilayah(rt_id))
  with check (public.can_manage_wilayah(rt_id));

-- 7d. Kependudukan per RT (angka agregat, bukan data individu warga).
-- Satu baris per RT. RT yang barisnya belum ada dianggap "belum diisi".
create table if not exists public.rt_demografi (
  rt_id         text primary key references public.wilayah(id),
  jumlah_kk     int not null default 0 check (jumlah_kk >= 0),
  laki          int not null default 0 check (laki >= 0),
  perempuan     int not null default 0 check (perempuan >= 0),
  -- Urutan tetap: 0-4, 5-14, 15-24, 25-44, 45-59, 60+
  kelompok_umur int[] not null default '{0,0,0,0,0,0}'
                check (cardinality(kelompok_umur) = 6 and 0 <= all (kelompok_umur)),
  updated_at    timestamptz not null default now()
);

alter table public.rt_demografi enable row level security;

drop policy if exists "demografi_read" on public.rt_demografi;
create policy "demografi_read" on public.rt_demografi for select using (true);
drop policy if exists "demografi_write" on public.rt_demografi;
create policy "demografi_write" on public.rt_demografi for all
  using (public.can_manage_wilayah(rt_id))
  with check (public.can_manage_wilayah(rt_id));

-- 7e. updated_at otomatis
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_news_touch on public.news;
create trigger trg_news_touch before update on public.news
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_umkm_touch on public.umkm;
create trigger trg_umkm_touch before update on public.umkm
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_org_touch on public.organizations;
create trigger trg_org_touch before update on public.organizations
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_off_touch on public.dusun_officials;
create trigger trg_off_touch before update on public.dusun_officials
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_demografi_touch on public.rt_demografi;
create trigger trg_demografi_touch before update on public.rt_demografi
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_potensi_touch on public.rt_potensi;
create trigger trg_potensi_touch before update on public.rt_potensi
  for each row execute function public.touch_updated_at();

-- 7f. Struktur per wilayah + kepala wilayah ------------------------------------
-- Setiap baris struktur dimiliki satu wilayah (owner_id): 'dusun', 'rw09', 'rt01', ...
-- Akun Dusun mengisi struktur dusun, akun RW mengisi struktur RW-nya (dan RT di
-- bawahnya), akun RT mengisi struktur RT-nya. Aturannya dijalankan di database
-- lewat can_manage_wilayah(), bukan hanya disembunyikan di tampilan.
--
-- wilayah_id menandai baris yang merupakan KEPALA wilayah itu (dukuh / ketua RW /
-- ketua RT). Beranda, Pemerintahan, tabel RT, dan dashboard membaca nama ketua
-- dari sini, jadi nama ketua tidak ditulis di kode.
alter table public.dusun_officials add column if not exists owner_id text not null default 'dusun' references public.wilayah(id);
alter table public.dusun_officials add column if not exists wilayah_id text references public.wilayah(id);
create unique index if not exists dusun_officials_wilayah_key
  on public.dusun_officials (wilayah_id) where wilayah_id is not null;
create index if not exists dusun_officials_owner_idx on public.dusun_officials (owner_id);
do $$ begin
  alter table public.dusun_officials
    add constraint dusun_officials_head_own check (wilayah_id is null or wilayah_id = owner_id);
exception when duplicate_object then null; end $$;

drop policy if exists "off_write" on public.dusun_officials;
create policy "off_write" on public.dusun_officials for all
  using (public.can_manage_wilayah(owner_id))
  with check (public.can_manage_wilayah(owner_id));

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

-- 10. SETELAH MEMBUAT USER DI Authentication > Users, DAFTARKAN PROFILNYA --------
-- Contoh (ganti UUID dengan id user dari dashboard Supabase):
-- insert into public.profiles (id, username, display_name, role, wilayah_id) values
--   ('00000000-0000-0000-0000-000000000000', 'admin', 'Admin Dusun Cilikan', 'dusun', 'dusun');
