import { requireSession, requireWilayah } from "./access";
import { AGE_GROUPS, sumUmur, totalWarga, type Demografi, type DemografiInput } from "./data/demografiData";
import { getRTById } from "./data/wilayahData";
import { rowToDemografi } from "./db/mappers";
import { toUserError } from "./db/errors";
import { createRemoteStore } from "./remoteStore";
import { getSupabase } from "./supabase/client";

async function loadDemografi(): Promise<Demografi[]> {
  const { data, error } = await getSupabase().from("rt_demografi").select("*");
  if (error) throw toUserError(error, "Data kependudukan gagal dimuat.");
  return (data ?? []).map(rowToDemografi);
}

export const demografiStore = createRemoteStore<Demografi>({ load: loadDemografi });

export function selectDemografiByRT(all: Demografi[], rtId: string): Demografi | undefined {
  return all.find((d) => d.rtId === rtId);
}

function validate(input: DemografiInput): void {
  const numbers = [input.jumlahKK, input.laki, input.perempuan, ...input.kelompokUmur];
  if (numbers.some((n) => !Number.isInteger(n) || n < 0)) {
    throw new Error("Semua angka harus bilangan bulat, 0 atau lebih.");
  }
  if (input.kelompokUmur.length !== AGE_GROUPS.length) {
    throw new Error("Data kelompok usia tidak lengkap.");
  }

  // Kelompok usia boleh dikosongkan semua, tapi kalau diisi jumlahnya harus
  // sama dengan total penduduk, supaya grafik dan persentasenya tidak janggal.
  const umur = sumUmur(input.kelompokUmur);
  const warga = totalWarga(input);
  if (umur > 0 && umur !== warga) {
    throw new Error(`Jumlah kelompok usia (${umur}) harus sama dengan total penduduk (${warga}).`);
  }
}

export async function saveDemografi(rtId: string, input: DemografiInput): Promise<void> {
  requireWilayah(requireSession(), rtId);
  if (!getRTById(rtId)) throw new Error("RT tidak ditemukan.");
  validate(input);

  const { error } = await getSupabase().from("rt_demografi").upsert(
    {
      rt_id: rtId,
      jumlah_kk: input.jumlahKK,
      laki: input.laki,
      perempuan: input.perempuan,
      kelompok_umur: input.kelompokUmur,
    },
    { onConflict: "rt_id" }
  );
  if (error) throw toUserError(error, "Data kependudukan gagal disimpan.");

  await demografiStore.refresh();
}
