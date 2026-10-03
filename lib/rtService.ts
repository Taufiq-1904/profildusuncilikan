import { rtList, type RTData, type Warga, type UMKM, type Potensi } from "./data/rtData";

const STORAGE_KEY = "cilikan_rt_data";

function getRTStore(): RTData[] {
  if (typeof window === "undefined") return rtList;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rtList));
    return rtList;
  }
  try {
    return JSON.parse(raw) as RTData[];
  } catch {
    return rtList;
  }
}

function saveRTStore(data: RTData[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function getRTData(rtId: string): RTData | undefined {
  return getRTStore().find((rt) => rt.id === rtId);
}

// === WARGA ===
export function addWarga(rtId: string, warga: Omit<Warga, "id">): Warga {
  const all = getRTStore();
  const rt = all.find((r) => r.id === rtId);
  if (!rt) throw new Error("RT not found");
  const newWarga: Warga = { ...warga, id: `w-${rtId}-${Date.now()}` };
  rt.warga = [...rt.warga, newWarga];
  rt.jumlahWarga = rt.warga.length;
  rt.jumlahLaki = rt.warga.filter((w) => w.jenisKelamin === "L").length;
  rt.jumlahPerempuan = rt.warga.filter((w) => w.jenisKelamin === "P").length;
  saveRTStore(all);
  return newWarga;
}

export function deleteWarga(rtId: string, wargaId: string): void {
  const all = getRTStore();
  const rt = all.find((r) => r.id === rtId);
  if (!rt) return;
  rt.warga = rt.warga.filter((w) => w.id !== wargaId);
  rt.jumlahWarga = rt.warga.length;
  rt.jumlahLaki = rt.warga.filter((w) => w.jenisKelamin === "L").length;
  rt.jumlahPerempuan = rt.warga.filter((w) => w.jenisKelamin === "P").length;
  saveRTStore(all);
}

// === UMKM ===
export function addUMKM(rtId: string, umkm: Omit<UMKM, "id">): UMKM {
  const all = getRTStore();
  const rt = all.find((r) => r.id === rtId);
  if (!rt) throw new Error("RT not found");
  const newUMKM: UMKM = { ...umkm, id: `umkm-${rtId}-${Date.now()}` };
  rt.umkm = [...rt.umkm, newUMKM];
  saveRTStore(all);
  return newUMKM;
}

export function deleteUMKM(rtId: string, umkmId: string): void {
  const all = getRTStore();
  const rt = all.find((r) => r.id === rtId);
  if (!rt) return;
  rt.umkm = rt.umkm.filter((u) => u.id !== umkmId);
  saveRTStore(all);
}

// === POTENSI ===
export function addPotensi(rtId: string, potensi: Omit<Potensi, "id">): Potensi {
  const all = getRTStore();
  const rt = all.find((r) => r.id === rtId);
  if (!rt) throw new Error("RT not found");
  const newPotensi: Potensi = { ...potensi, id: `pot-${rtId}-${Date.now()}` };
  rt.potensi = [...rt.potensi, newPotensi];
  saveRTStore(all);
  return newPotensi;
}

export function deletePotensi(rtId: string, potensiId: string): void {
  const all = getRTStore();
  const rt = all.find((r) => r.id === rtId);
  if (!rt) return;
  rt.potensi = rt.potensi.filter((p) => p.id !== potensiId);
  saveRTStore(all);
}

// === HELPERS ===
export function calcAge(tanggalLahir: string): number {
  const birth = new Date(tanggalLahir);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function getAgeGroup(age: number): string {
  if (age <= 4)  return "0–4";
  if (age <= 14) return "5–14";
  if (age <= 24) return "15–24";
  if (age <= 44) return "25–44";
  if (age <= 59) return "45–59";
  return "60+";
}

export { type RTData, type Warga, type UMKM, type Potensi };
