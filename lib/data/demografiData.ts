// Kependudukan per RT. Hanya angka agregat; tidak ada data individu warga.

// Urutan ini sama dengan urutan kolom kelompok_umur di database.
export const AGE_GROUPS = ["0–4", "5–14", "15–24", "25–44", "45–59", "60+"] as const;

export type Demografi = {
  rtId: string;
  jumlahKK: number;
  laki: number;
  perempuan: number;
  // Satu angka per AGE_GROUPS, urutannya sama.
  kelompokUmur: number[];
};

export type DemografiInput = Omit<Demografi, "rtId">;

export type DemografiTotal = {
  warga: number;
  kk: number;
  laki: number;
  perempuan: number;
  umur: number[];
};

export function totalWarga(d: Pick<Demografi, "laki" | "perempuan">): number {
  return d.laki + d.perempuan;
}

export function sumUmur(umur: number[]): number {
  return umur.reduce((a, b) => a + b, 0);
}

export function sumDemografi(rows: Demografi[]): DemografiTotal {
  const total: DemografiTotal = {
    warga: 0,
    kk: 0,
    laki: 0,
    perempuan: 0,
    umur: AGE_GROUPS.map(() => 0),
  };
  for (const r of rows) {
    total.laki += r.laki;
    total.perempuan += r.perempuan;
    total.kk += r.jumlahKK;
    r.kelompokUmur.forEach((n, i) => {
      total.umur[i] += n;
    });
  }
  total.warga = total.laki + total.perempuan;
  return total;
}
