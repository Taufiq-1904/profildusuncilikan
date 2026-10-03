// Relational wilayah (region) model: Dusun -> RW -> RT.
// This intentionally stays as static in-memory data (no real DB yet — see
// project notes), but the shape mirrors what a `dusun` / `rw` / `rt` table
// set would look like, so it can be lifted into a real schema later without
// reshaping the app. Never hardcode "if rw09 then rt01" logic elsewhere —
// always resolve relationships through rwId / getRTsByRW / getRWByRT below.

export type KelompokUmur = {
  label: string; // "0-4", "5-14", "15-24", "25-44", "45-59", "60+"
  jumlah: number;
};

export type Dusun = {
  id: "dusun";
  name: string;
};

export type RW = {
  id: string; // "rw09"
  label: string; // "RW 09"
  ketua?: string;
};

export type RT = {
  id: string; // "rt01"
  label: string; // "RT 01"
  rwId: string; // foreign key -> RW.id
  ketua: string;
  sekretaris?: string;
  bendahara?: string;
  // Aggregate population statistics only (no individual resident registry —
  // that was removed together with the finance feature; see project notes).
  jumlahWarga: number;
  jumlahKK: number;
  jumlahLaki: number;
  jumlahPerempuan: number;
  kelompokUmur: KelompokUmur[];
};

export const dusun: Dusun = {
  id: "dusun",
  name: "Dusun Cilikan",
};

export const rwList: RW[] = [
  { id: "rw09", label: "RW 09", ketua: "Sukendar" },
  { id: "rw10", label: "RW 10", ketua: "Halim" },
];

export const rtList: RT[] = [
  {
    id: "rt01",
    label: "RT 01",
    rwId: "rw09",
    ketua: "Bayu K",
    jumlahWarga: 124,
    jumlahKK: 36,
    jumlahLaki: 63,
    jumlahPerempuan: 61,
    kelompokUmur: [
      { label: "0–4", jumlah: 8 },
      { label: "5–14", jumlah: 18 },
      { label: "15–24", jumlah: 22 },
      { label: "25–44", jumlah: 42 },
      { label: "45–59", jumlah: 24 },
      { label: "60+", jumlah: 10 },
    ],
  },
  {
    id: "rt02",
    label: "RT 02",
    rwId: "rw09",
    ketua: "Ilham",
    jumlahWarga: 131,
    jumlahKK: 38,
    jumlahLaki: 67,
    jumlahPerempuan: 64,
    kelompokUmur: [
      { label: "0–4", jumlah: 10 },
      { label: "5–14", jumlah: 20 },
      { label: "15–24", jumlah: 25 },
      { label: "25–44", jumlah: 45 },
      { label: "45–59", jumlah: 21 },
      { label: "60+", jumlah: 10 },
    ],
  },
  {
    id: "rt03",
    label: "RT 03",
    rwId: "rw10",
    ketua: "Darsono",
    jumlahWarga: 118,
    jumlahKK: 34,
    jumlahLaki: 60,
    jumlahPerempuan: 58,
    kelompokUmur: [
      { label: "0–4", jumlah: 7 },
      { label: "5–14", jumlah: 16 },
      { label: "15–24", jumlah: 19 },
      { label: "25–44", jumlah: 38 },
      { label: "45–59", jumlah: 25 },
      { label: "60+", jumlah: 13 },
    ],
  },
  {
    id: "rt04",
    label: "RT 04",
    rwId: "rw10",
    ketua: "Suyadi",
    jumlahWarga: 114,
    jumlahKK: 34,
    jumlahLaki: 58,
    jumlahPerempuan: 56,
    kelompokUmur: [
      { label: "0–4", jumlah: 6 },
      { label: "5–14", jumlah: 15 },
      { label: "15–24", jumlah: 20 },
      { label: "25–44", jumlah: 36 },
      { label: "45–59", jumlah: 24 },
      { label: "60+", jumlah: 13 },
    ],
  },
];

export function getRWById(id: string): RW | undefined {
  return rwList.find((rw) => rw.id === id);
}

export function getRTById(id: string): RT | undefined {
  return rtList.find((rt) => rt.id === id);
}

export function getRTsByRW(rwId: string): RT[] {
  return rtList.filter((rt) => rt.rwId === rwId);
}

export function getRWByRT(rtId: string): RW | undefined {
  const rt = getRTById(rtId);
  return rt ? getRWById(rt.rwId) : undefined;
}

// Back-compat alias: some existing components still import `type RTData`.
export type RTData = RT;

export type WilayahLevel = "dusun" | "rw" | "rt";

// Resolves what kind of wilayah an id points to, so callers never have to
// sniff prefixes like "rt" or "rw" out of the id string.
export function getWilayahLevel(id: string): WilayahLevel | null {
  if (id === dusun.id) return "dusun";
  if (getRWById(id)) return "rw";
  if (getRTById(id)) return "rt";
  return null;
}

export function getWilayahLabel(id: string): string {
  if (id === dusun.id) return dusun.name;
  return getRWById(id)?.label ?? getRTById(id)?.label ?? id;
}

// The wilayah an id sits under, nearest first: an RT gives [rt, rw, dusun].
// Filters use this so choosing "RW 10" also matches everything in its RTs.
export function getWilayahChain(id: string): string[] {
  const level = getWilayahLevel(id);
  if (level === "rt") {
    const rt = getRTById(id);
    return rt ? [id, rt.rwId, dusun.id] : [id];
  }
  if (level === "rw") return [id, dusun.id];
  if (level === "dusun") return [dusun.id];
  return [id];
}

export function wilayahContains(filterId: string, ownerId: string): boolean {
  return getWilayahChain(ownerId).includes(filterId);
}

export type WilayahFilterOption = { id: string; label: string; level: WilayahLevel };

// Options for a public "wilayah" filter, built from the wilayah that actually
// own content: every RW/RT in their chains, RW first and its RTs beneath it.
// The dusun itself is left out because it matches everything.
export function getWilayahFilterOptions(ownerIds: string[]): WilayahFilterOption[] {
  const ids = new Set<string>();
  ownerIds.forEach((owner) => getWilayahChain(owner).forEach((id) => ids.add(id)));
  ids.delete(dusun.id);

  const groupOf = (id: string) => getRTById(id)?.rwId ?? id;
  return Array.from(ids)
    .map((id) => ({ id, label: getWilayahLabel(id), level: getWilayahLevel(id) ?? ("rt" as const) }))
    .sort((a, b) => {
      const g = groupOf(a.id).localeCompare(groupOf(b.id));
      if (g !== 0) return g;
      if (a.level !== b.level) return a.level === "rw" ? -1 : 1;
      return a.label.localeCompare(b.label, "id");
    });
}

// "RT 03 · RW 10" for places that belong to an RT.
export function getRTWithRWLabel(rtId: string): string {
  const rt = getRTById(rtId);
  if (!rt) return getWilayahLabel(rtId);
  const rw = getRWById(rt.rwId);
  return rw ? `${rt.label} · ${rw.label}` : rt.label;
}
