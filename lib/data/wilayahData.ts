// Relational wilayah (region) model: Dusun -> RW -> RT.
// This intentionally stays as static in-memory data (no real DB yet — see
// project notes), but the shape mirrors what a `dusun` / `rw` / `rt` table
// set would look like, so it can be lifted into a real schema later without
// reshaping the app. Nama ketua sengaja TIDAK disimpan di sini: dibaca dari
// struktur dusun (lihat useWilayahHeads di lib/hooks/use-directory.ts). Never hardcode "if rw09 then rt01" logic elsewhere —
// always resolve relationships through rwId / getRTsByRW / getRWByRT below.

export type Dusun = {
  id: "dusun";
  name: string;
};

export type RW = {
  id: string; // "rw09"
  label: string; // "RW 09"
};

export type RT = {
  id: string; // "rt01"
  label: string; // "RT 01"
  rwId: string; // foreign key -> RW.id
  // Angka kependudukan tidak disimpan di sini: ada di tabel rt_demografi
  // (lihat lib/data/demografiData.ts).
};

export const dusun: Dusun = {
  id: "dusun",
  name: "Dusun Cilikan",
};

export const rwList: RW[] = [
  { id: "rw09", label: "RW 09" },
  { id: "rw10", label: "RW 10" },
];

export const rtList: RT[] = [
  { id: "rt01", label: "RT 01", rwId: "rw09" },
  { id: "rt02", label: "RT 02", rwId: "rw09" },
  { id: "rt03", label: "RT 03", rwId: "rw10" },
  { id: "rt04", label: "RT 04", rwId: "rw10" },
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

// Sebutan jabatan kepala wilayah: "Dukuh", "Ketua RW 09", "Ketua RT 01".
export function getHeadTitle(id: string): string {
  return id === dusun.id ? "Dukuh" : `Ketua ${getWilayahLabel(id)}`;
}

// "RT 03 · RW 10" for places that belong to an RT.
export function getRTWithRWLabel(rtId: string): string {
  const rt = getRTById(rtId);
  if (!rt) return getWilayahLabel(rtId);
  const rw = getRWById(rt.rwId);
  return rw ? `${rt.label} · ${rw.label}` : rt.label;
}
