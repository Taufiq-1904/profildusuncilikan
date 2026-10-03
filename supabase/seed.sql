-- ============================================================================
-- Data contoh (seed) Profil Dusun Cilikan.
-- Jalankan SETELAH schema.sql. Opsional: lewati bila ingin mulai dari kosong.
-- Aman dijalankan ulang (tidak menggandakan data).
-- ============================================================================

-- Berita
insert into public.news (slug,title,excerpt,content,cover_image,category_id,status,published_at,author_username,author_name,wilayah_id)
values ($q$musyawarah-dusun-rencana-akhir-tahun$q$,$q$Musyawarah Dusun Bahas Rencana Kegiatan Akhir Tahun$q$,$q$Perangkat dusun, pengurus RW, dan perwakilan RT berkumpul untuk menyusun agenda kegiatan hingga akhir tahun.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Perangkat dusun bersama pengurus RW dan perwakilan RT menggelar musyawarah untuk menyusun agenda kegiatan hingga akhir tahun.","Sejumlah usulan dibahas, mulai dari perawatan fasilitas umum, kegiatan kepemudaan, hingga jadwal kerja bakti gabungan antar-RT.","Hasil musyawarah akan dirangkum dan disampaikan kembali kepada warga melalui pengumuman di portal ini."]$q$::jsonb) with ordinality as t(x, ord)),null,$q$pemerintahan$q$,$q$published$q$,$q$2026-09-15$q$::date,$q$admin$q$,$q$Admin Dusun Cilikan$q$,$q$dusun$q$)
on conflict (slug) do nothing;
insert into public.news (slug,title,excerpt,content,cover_image,category_id,status,published_at,author_username,author_name,wilayah_id)
values ($q$penyesuaian-jadwal-pelayanan-dusun$q$,$q$Pengumuman: Penyesuaian Jadwal Pelayanan Administrasi Dusun$q$,$q$Jadwal pelayanan administrasi di kantor dusun disesuaikan mulai pekan depan. Warga diminta memperhatikan jam kunjungan.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Pemerintah dusun menginformasikan adanya penyesuaian jadwal pelayanan administrasi bagi warga.","Warga yang membutuhkan surat pengantar atau keperluan administrasi lain diharapkan menghubungi ketua RT masing-masing terlebih dahulu agar proses lebih lancar."]$q$::jsonb) with ordinality as t(x, ord)),null,$q$pengumuman$q$,$q$published$q$,$q$2026-09-08$q$::date,$q$admin$q$,$q$Admin Dusun Cilikan$q$,$q$dusun$q$)
on conflict (slug) do nothing;
insert into public.news (slug,title,excerpt,content,cover_image,category_id,status,published_at,author_username,author_name,wilayah_id)
values ($q$rapat-koordinasi-rw-10$q$,$q$Rapat Koordinasi RW 10 dan Pengurus RT$q$,$q$Pengurus RW 10 bertemu dengan ketua RT 03 dan RT 04 untuk menyelaraskan program kegiatan warga.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["RW 10 menggelar rapat koordinasi bersama ketua dan pengurus RT 03 serta RT 04.","Pertemuan membahas pembagian tugas kegiatan bulanan, pendataan kebutuhan warga, dan rencana kegiatan bersama antar-RT.","Rapat serupa direncanakan berlangsung rutin agar informasi dari tingkat RT dapat tersampaikan dengan cepat."]$q$::jsonb) with ordinality as t(x, ord)),null,$q$kegiatan-warga$q$,$q$published$q$,$q$2026-09-20$q$::date,$q$rw10$q$,$q$Ketua RW 10$q$,$q$rw10$q$)
on conflict (slug) do nothing;
insert into public.news (slug,title,excerpt,content,cover_image,category_id,status,published_at,author_username,author_name,wilayah_id)
values ($q$perbaikan-saluran-air-rw-09$q$,$q$Perbaikan Saluran Air di Lingkungan RW 09$q$,$q$Warga RW 09 bergotong royong memperbaiki saluran air yang tersumbat agar tidak menggenang saat musim hujan.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Menjelang musim hujan, warga RW 09 memperbaiki dan membersihkan saluran air di beberapa titik lingkungan.","Kegiatan dikoordinir pengurus RW bersama RT 01 dan RT 02, dan diikuti warga secara sukarela."]$q$::jsonb) with ordinality as t(x, ord)),null,$q$pembangunan$q$,$q$published$q$,$q$2026-09-02$q$::date,$q$rw09$q$,$q$Ketua RW 09$q$,$q$rw09$q$)
on conflict (slug) do nothing;
insert into public.news (slug,title,excerpt,content,cover_image,category_id,status,published_at,author_username,author_name,wilayah_id)
values ($q$enggal-makmur-ajak-warga-rt-03-pilah-sampah$q$,$q$Enggal Makmur Ajak Warga RT 03 Memilah Sampah dari Rumah$q$,$q$Kelompok pengelolaan sampah Enggal Makmur mengajak warga RT 03 memulai pemilahan sampah organik dan anorganik.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Enggal Makmur, kelompok pengelolaan sampah dari RT 03, mengajak warga untuk mulai memilah sampah dari rumah masing-masing.","Warga diminta memisahkan sampah organik, anorganik, dan sampah yang dapat dijual kembali sebelum diserahkan pada jadwal pengumpulan.","Kelompok ini juga terbuka bagi warga yang ingin ikut terlibat dalam kegiatan pengelolaan sampah di lingkungan RT 03."]$q$::jsonb) with ordinality as t(x, ord)),null,$q$kegiatan-warga$q$,$q$published$q$,$q$2026-09-24$q$::date,$q$rt03$q$,$q$Ketua RT 03$q$,$q$rt03$q$)
on conflict (slug) do nothing;
insert into public.news (slug,title,excerpt,content,cover_image,category_id,status,published_at,author_username,author_name,wilayah_id)
values ($q$kerja-bakti-warga-rt-01$q$,$q$Kerja Bakti Bersama Warga RT 01$q$,$q$Warga RT 01 membersihkan lingkungan dan fasilitas umum dalam kegiatan kerja bakti rutin akhir pekan.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Warga RT 01 mengadakan kerja bakti untuk membersihkan jalan lingkungan dan fasilitas umum.","Kegiatan ini rutin diadakan agar lingkungan tetap bersih dan mempererat kebersamaan antarwarga."]$q$::jsonb) with ordinality as t(x, ord)),null,$q$kegiatan-warga$q$,$q$published$q$,$q$2026-09-12$q$::date,$q$rt01$q$,$q$Ketua RT 01$q$,$q$rt01$q$)
on conflict (slug) do nothing;
insert into public.news (slug,title,excerpt,content,cover_image,category_id,status,published_at,author_username,author_name,wilayah_id)
values ($q$pelatihan-pemasaran-digital-umkm-rt-02$q$,$q$Warga RT 02 Ikuti Pelatihan Pemasaran Digital untuk UMKM$q$,$q$Pelaku usaha rumahan di RT 02 belajar membuat konten dan memanfaatkan media sosial untuk promosi.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Sejumlah pelaku usaha rumahan di RT 02 mengikuti pelatihan pemasaran digital.","Materi meliputi cara memotret produk, menulis deskripsi yang menarik, serta memanfaatkan media sosial untuk promosi."]$q$::jsonb) with ordinality as t(x, ord)),null,$q$ekonomi$q$,$q$published$q$,$q$2026-08-30$q$::date,$q$rt02$q$,$q$Ketua RT 02$q$,$q$rt02$q$)
on conflict (slug) do nothing;
insert into public.news (slug,title,excerpt,content,cover_image,category_id,status,published_at,author_username,author_name,wilayah_id)
values ($q$jadwal-ronda-malam-rt-04$q$,$q$Jadwal Ronda Malam RT 04$q$,$q$Rancangan jadwal ronda malam RT 04 untuk bulan berikutnya.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Rancangan jadwal ronda malam RT 04 masih disusun dan akan diumumkan setelah disepakati pengurus."]$q$::jsonb) with ordinality as t(x, ord)),null,$q$pengumuman$q$,$q$draft$q$,$q$2026-09-27$q$::date,$q$rt04$q$,$q$Ketua RT 04$q$,$q$rt04$q$)
on conflict (slug) do nothing;

-- Organisasi & komunitas
insert into public.organizations (slug,name,logo,summary,description,field_id,wilayah_id,founded_year,leader,contact,alamat,maps_url,lat,lng,instagram,facebook,website,gallery,members)
values ($q$kelompok-tani$q$,$q$Kelompok Tani Cilikan$q$,null,$q$Kelompok tani warga Dusun Cilikan.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Kelompok Tani Cilikan menghimpun warga dusun yang bertani, sebagai wadah berbagi pengalaman dan koordinasi kegiatan pertanian."]$q$::jsonb) with ordinality as t(x, ord)),$q$ekonomi$q$,$q$dusun$q$,null,$q$Suharyanta$q$,null,null,null,null,null,null,null,null,'{}'::text[],$q$[]$q$::jsonb)
on conflict (slug) do nothing;
insert into public.organizations (slug,name,logo,summary,description,field_id,wilayah_id,founded_year,leader,contact,alamat,maps_url,lat,lng,instagram,facebook,website,gallery,members)
values ($q$kelompok-kandang$q$,$q$Kelompok Kandang Cilikan$q$,null,$q$Kelompok peternak warga Dusun Cilikan.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Kelompok Kandang Cilikan menjadi wadah bagi warga yang beternak, untuk saling berbagi ilmu dan mengelola kegiatan peternakan bersama."]$q$::jsonb) with ordinality as t(x, ord)),$q$ekonomi$q$,$q$dusun$q$,null,$q$Puji Wahono$q$,null,null,null,null,null,null,null,null,'{}'::text[],$q$[]$q$::jsonb)
on conflict (slug) do nothing;
insert into public.organizations (slug,name,logo,summary,description,field_id,wilayah_id,founded_year,leader,contact,alamat,maps_url,lat,lng,instagram,facebook,website,gallery,members)
values ($q$pemuda-cilikan$q$,$q$Pemuda Cilikan$q$,null,$q$Wadah kegiatan pemuda Dusun Cilikan.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Pemuda Cilikan adalah wadah kegiatan generasi muda dusun, terlibat dalam kegiatan sosial dan kemasyarakatan."]$q$::jsonb) with ordinality as t(x, ord)),$q$kepemudaan$q$,$q$dusun$q$,null,$q$Iqbal$q$,null,null,null,null,null,null,null,null,'{}'::text[],$q$[]$q$::jsonb)
on conflict (slug) do nothing;
insert into public.organizations (slug,name,logo,summary,description,field_id,wilayah_id,founded_year,leader,contact,alamat,maps_url,lat,lng,instagram,facebook,website,gallery,members)
values ($q$kader-dusun$q$,$q$Kader Dusun Cilikan$q$,null,$q$Para kader yang aktif melayani kegiatan kesehatan dan sosial warga dusun.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Kader Dusun Cilikan beranggotakan Nopi Damar, Munarti, Wijiyati (Mak Enok), Susi, Yulia Rohman, Harmini, dan Umi.","Para kader membantu berbagai kegiatan kesehatan dan kemasyarakatan di dusun."]$q$::jsonb) with ordinality as t(x, ord)),$q$sosial$q$,$q$dusun$q$,null,$q$Nopi Damar$q$,null,null,null,null,null,null,null,null,'{}'::text[],$q$[]$q$::jsonb)
on conflict (slug) do nothing;
insert into public.organizations (slug,name,logo,summary,description,field_id,wilayah_id,founded_year,leader,contact,alamat,maps_url,lat,lng,instagram,facebook,website,gallery,members)
values ($q$lpmd-cilikan$q$,$q$LPMD Cilikan$q$,null,$q$Lembaga Pemberdayaan Masyarakat Dusun.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["LPMD Cilikan berperan mendorong pemberdayaan dan pembangunan dusun bersama warga."]$q$::jsonb) with ordinality as t(x, ord)),$q$sosial$q$,$q$dusun$q$,null,$q$Saiin Ardiansyah$q$,null,null,null,null,null,null,null,null,'{}'::text[],$q$[]$q$::jsonb)
on conflict (slug) do nothing;
insert into public.organizations (slug,name,logo,summary,description,field_id,wilayah_id,founded_year,leader,contact,alamat,maps_url,lat,lng,instagram,facebook,website,gallery,members)
values ($q$jaga-warga$q$,$q$Jaga Warga Cilikan$q$,null,$q$Kelompok penjaga keamanan lingkungan dusun.$q$,(select array_agg(x order by ord) from jsonb_array_elements_text($q$["Jaga Warga membantu menjaga keamanan dan kenyamanan lingkungan Dusun Cilikan."]$q$::jsonb) with ordinality as t(x, ord)),$q$sosial$q$,$q$dusun$q$,null,$q$Samsul Hadi$q$,null,null,null,null,null,null,null,null,'{}'::text[],$q$[]$q$::jsonb)
on conflict (slug) do nothing;

-- Struktur per wilayah (hanya diisi bila tabel masih kosong).
-- owner_id = wilayah pemilik baris; wilayah_id terisi bila orang itu kepala wilayahnya.
insert into public.dusun_officials (name,position,period,tier,sort_order,owner_id,wilayah_id)
select * from (values
  ($q$Nur Edy P$q$,$q$Dukuh$q$,null,1,1,$q$dusun$q$,$q$dusun$q$),
  ($q$Supriyono$q$,$q$Tokoh Masyarakat$q$,null,2,2,$q$dusun$q$,null),
  ($q$Saiin Ardiansyah$q$,$q$Ketua LPMD$q$,null,3,3,$q$dusun$q$,null),
  ($q$Samsul Hadi$q$,$q$Jaga Warga$q$,null,3,4,$q$dusun$q$,null),
  ($q$Puji Wahono$q$,$q$Ketua Kelompok Kandang$q$,null,3,5,$q$dusun$q$,null),
  ($q$Suharyanta$q$,$q$Ketua Kelompok Tani$q$,null,3,6,$q$dusun$q$,null),
  ($q$Iqbal$q$,$q$Ketua Pemuda$q$,null,3,7,$q$dusun$q$,null),
  ($q$Nopi Damar$q$,$q$Kader$q$,null,4,8,$q$dusun$q$,null),
  ($q$Munarti$q$,$q$Kader$q$,null,4,9,$q$dusun$q$,null),
  ($q$Wijiyati (Mak Enok)$q$,$q$Kader$q$,null,4,10,$q$dusun$q$,null),
  ($q$Susi$q$,$q$Kader$q$,null,4,11,$q$dusun$q$,null),
  ($q$Yulia Rohman$q$,$q$Kader$q$,null,4,12,$q$dusun$q$,null),
  ($q$Harmini$q$,$q$Kader$q$,null,4,13,$q$dusun$q$,null),
  ($q$Umi$q$,$q$Kader$q$,null,4,14,$q$dusun$q$,null),
  ($q$Maya$q$,$q$Ibu Dukuh$q$,null,5,15,$q$dusun$q$,null),
  ($q$Sukendar$q$,$q$Ketua RW 09$q$,null,1,1,$q$rw09$q$,$q$rw09$q$),
  ($q$Hasil$q$,$q$Ibu Ketua RW 09$q$,null,2,2,$q$rw09$q$,null),
  ($q$Halim$q$,$q$Ketua RW 10$q$,null,1,1,$q$rw10$q$,$q$rw10$q$),
  ($q$Saryati$q$,$q$Ibu Ketua RW 10$q$,null,2,2,$q$rw10$q$,null),
  ($q$Bayu K$q$,$q$Ketua RT 01$q$,null,1,1,$q$rt01$q$,$q$rt01$q$),
  ($q$Ida$q$,$q$Ibu Ketua RT 01$q$,null,2,2,$q$rt01$q$,null),
  ($q$Ilham$q$,$q$Ketua RT 02$q$,null,1,1,$q$rt02$q$,$q$rt02$q$),
  ($q$Novi$q$,$q$Ibu Ketua RT 02$q$,null,2,2,$q$rt02$q$,null),
  ($q$Darsono$q$,$q$Ketua RT 03$q$,null,1,1,$q$rt03$q$,$q$rt03$q$),
  ($q$Sugiyatmi$q$,$q$Ibu Ketua RT 03$q$,null,2,2,$q$rt03$q$,null),
  ($q$Suyadi$q$,$q$Ketua RT 04$q$,null,1,1,$q$rt04$q$,$q$rt04$q$),
  ($q$Agnes$q$,$q$Ibu Ketua RT 04$q$,null,2,2,$q$rt04$q$,null)
) as v(name,position,period,tier,sort_order,owner_id,wilayah_id)
where not exists (select 1 from public.dusun_officials);

-- Pin peta contoh (hanya diisi bila tabel masih kosong)
insert into public.map_pins (nama, deskripsi, kategori, lat, lng, kontak, wilayah_id)
select 'Balai Dusun Cilikan',
       'Pusat kegiatan warga, musyawarah, dan layanan administrasi dusun.',
       'Fasilitas Umum', -7.7028, 110.4219, '(0274) 895-123', 'dusun'
where not exists (select 1 from public.map_pins);
