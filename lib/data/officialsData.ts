export type Official = {
  slug: string;
  name: string;
  position: string;
  category: "pimpinan" | "rt";
  period?: string;
};

export const villageHead: Official = {
  slug: "kepala-dusun",
  name: "Bapak Nur Edy P",
  position: "Dukuh Cilikan",
  category: "pimpinan",
};

export const headWelcome = {
  message:
    "Selamat datang di website resmi Dusun Cilikan, Umbulmartani, Ngemplak, Sleman. Website ini hadir sebagai media informasi bagi warga dan masyarakat luas mengenai profil, potensi, serta kegiatan dusun kami. Mari bersama-sama menjaga kerukunan dan gotong royong demi Dusun Cilikan yang guyub dan sejahtera.",
};

export const officials: Official[] = [
  villageHead,
  { slug: "ketua-rt-01", name: "Bapak Bayu K", position: "Ketua RT 01", category: "rt" },
  { slug: "ketua-rt-02", name: "Bapak Ilham", position: "Ketua RT 02", category: "rt" },
  { slug: "ketua-rt-03", name: "Bapak Darsono", position: "Ketua RT 03", category: "rt" },
  { slug: "ketua-rt-04", name: "Bapak Suyadi", position: "Ketua RT 04", category: "rt" },
];
