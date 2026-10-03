-- Jalankan SEKALI di Supabase > SQL Editor (aman dijalankan ulang).
-- Membuat struktur organisasi dikelola per wilayah:
--   * akun Dusun  -> struktur dusun
--   * akun RW     -> struktur RW-nya (dan RT di bawahnya)
--   * akun RT     -> struktur RT-nya
-- dan menandai kepala wilayah (dukuh / ketua RW / ketua RT) supaya namanya
-- dibaca dari database, bukan dari kode.

-- 1. Kolom baru ---------------------------------------------------------------
alter table public.dusun_officials add column if not exists owner_id text not null default 'dusun' references public.wilayah(id);
alter table public.dusun_officials add column if not exists wilayah_id text references public.wilayah(id);
create unique index if not exists dusun_officials_wilayah_key
  on public.dusun_officials (wilayah_id) where wilayah_id is not null;
create index if not exists dusun_officials_owner_idx on public.dusun_officials (owner_id);

-- 2. Tandai kepala wilayah dari teks jabatan (hanya yang belum ditandai) ---------
update public.dusun_officials set wilayah_id = 'dusun'
 where wilayah_id is null and lower(trim(position)) in ('dukuh','kepala dusun','dukuh cilikan')
   and not exists (select 1 from public.dusun_officials x where x.wilayah_id = 'dusun');

update public.dusun_officials o set wilayah_id = w.id
  from public.wilayah w
 where o.wilayah_id is null
   and w.level in ('rw','rt')
   and lower(trim(o.position)) = 'ketua ' || lower(w.label)
   and not exists (select 1 from public.dusun_officials x where x.wilayah_id = w.id);

-- 3. Pindahkan kepala ke struktur wilayahnya sendiri ------------------------------
update public.dusun_officials set owner_id = wilayah_id, tier = 1, sort_order = 1
 where wilayah_id is not null and owner_id <> wilayah_id;

-- 4. Pendamping ("Ibu Ketua RT 01", "Ibu Ketua RW 09") ikut ke wilayahnya --------
update public.dusun_officials o set owner_id = w.id, tier = 2, sort_order = 2
  from public.wilayah w
 where o.owner_id = 'dusun'
   and w.level in ('rw','rt')
   and lower(trim(o.position)) = 'ibu ketua ' || lower(w.label);

-- 5. Satu kepala hanya boleh ada di wilayahnya sendiri ----------------------------
do $$ begin
  alter table public.dusun_officials
    add constraint dusun_officials_head_own check (wilayah_id is null or wilayah_id = owner_id);
exception when duplicate_object then null; end $$;

-- 6. Hak tulis: pengelola wilayah tersebut ----------------------------------------
drop policy if exists "off_write" on public.dusun_officials;
create policy "off_write" on public.dusun_officials for all
  using (public.can_manage_wilayah(owner_id))
  with check (public.can_manage_wilayah(owner_id));

-- Cek: harus 7 baris (dusun, rw09, rw10, rt01-rt04).
select owner_id, wilayah_id, name, position from public.dusun_officials
 where wilayah_id is not null order by owner_id;
