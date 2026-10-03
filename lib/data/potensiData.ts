export type RTPotensiKategori =
  | "Pertanian"
  | "Peternakan"
  | "Kerajinan"
  | "Pariwisata"
  | "Perdagangan"
  | "Lainnya";

export type RTPotensi = {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: RTPotensiKategori;
  rtId: string;
};
