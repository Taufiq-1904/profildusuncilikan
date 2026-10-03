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

-- 7. SETELAH MEMBUAT USER DI Authentication > Users, DAFTARKAN PROFILNYA --------
-- Contoh (ganti UUID dengan id user dari dashboard Supabase):
-- insert into public.profiles (id, display_name, role, wilayah_id) values
--   ('00000000-0000-0000-0000-000000000000', 'Admin Dusun Cilikan', 'dusun', 'dusun');
