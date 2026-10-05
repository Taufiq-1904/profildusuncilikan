-- Jalankan SEKALI di Supabase > SQL Editor (aman dijalankan ulang).
-- Menambah kolom foto pada potensi RT. Foto diunggah ke bucket 'media'
-- (folder 'potensi'); yang disimpan di sini hanya URL publiknya.

alter table public.rt_potensi add column if not exists foto text;
