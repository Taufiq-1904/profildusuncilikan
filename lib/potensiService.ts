import { potensiSeed, type RTPotensi } from "./data/potensiData";

const STORAGE_KEY = "cilikan_potensi_rt";

function getStore(): RTPotensi[] {
  if (typeof window === "undefined") return potensiSeed;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(potensiSeed));
    return potensiSeed;
  }
  try {
    return JSON.parse(raw) as RTPotensi[];
  } catch {
    return potensiSeed;
  }
}

function saveStore(data: RTPotensi[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function getAllPotensiRT(): RTPotensi[] {
  return getStore();
}

export function getPotensiByRT(rtId: string): RTPotensi[] {
  return getStore().filter((p) => p.rtId === rtId);
}

export function addPotensiRT(rtId: string, potensi: Omit<RTPotensi, "id" | "rtId">): RTPotensi {
  const all = getStore();
  const newPotensi: RTPotensi = { ...potensi, id: `pot-${rtId}-${Date.now()}`, rtId };
  saveStore([...all, newPotensi]);
  return newPotensi;
}

export function updatePotensiRT(id: string, data: Omit<RTPotensi, "id" | "rtId">): void {
  saveStore(getStore().map((p) => (p.id === id ? { ...p, ...data } : p)));
}

export function deletePotensiRT(id: string): void {
  saveStore(getStore().filter((p) => p.id !== id));
}

export { type RTPotensi };
