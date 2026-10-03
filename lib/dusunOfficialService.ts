import { requireDusun, requireSession } from "./access";
import { isDusun, type SessionUser } from "./auth";
import { createLocalStore } from "./localStore";
import { dusunOfficialsSeed, type DusunOfficial } from "./data/dusunOfficialsData";

export const dusunOfficialStore = createLocalStore<DusunOfficial>({
  key: "cilikan_dusun_officials_v1",
  seed: dusunOfficialsSeed,
});

export type DusunOfficialInput = Pick<
  DusunOfficial,
  "name" | "position" | "photo" | "period" | "tier" | "order"
>;

// The dusun-level structure belongs to the dusun account only.
export function canManageDusunStructure(session: SessionUser | null): boolean {
  return isDusun(session);
}

function validate(input: DusunOfficialInput): void {
  if (!input.name.trim()) throw new Error("Nama wajib diisi.");
  if (!input.position.trim()) throw new Error("Jabatan wajib diisi.");
  if (!Number.isInteger(input.tier) || input.tier < 1) throw new Error("Tingkat harus bilangan bulat mulai dari 1.");
  if (!Number.isInteger(input.order) || input.order < 1) throw new Error("Urutan harus bilangan bulat mulai dari 1.");
}

function normalize(input: DusunOfficialInput) {
  return {
    name: input.name.trim(),
    position: input.position.trim(),
    photo: input.photo,
    period: input.period?.trim() || undefined,
    tier: input.tier,
    order: input.order,
  };
}

export function createOfficial(input: DusunOfficialInput): DusunOfficial {
  requireDusun(requireSession());
  validate(input);

  const now = new Date().toISOString();
  const official: DusunOfficial = {
    ...normalize(input),
    id: `official-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: now,
    updatedAt: now,
  };
  dusunOfficialStore.write([...dusunOfficialStore.getSnapshot(), official]);
  return official;
}

export function updateOfficial(id: string, input: DusunOfficialInput): DusunOfficial {
  requireDusun(requireSession());
  validate(input);

  const all = dusunOfficialStore.getSnapshot();
  const existing = all.find((o) => o.id === id);
  if (!existing) throw new Error("Data tidak ditemukan.");

  const updated: DusunOfficial = { ...existing, ...normalize(input), updatedAt: new Date().toISOString() };
  dusunOfficialStore.write(all.map((o) => (o.id === id ? updated : o)));
  return updated;
}

export function deleteOfficial(id: string): void {
  requireDusun(requireSession());
  const all = dusunOfficialStore.getSnapshot();
  dusunOfficialStore.write(all.filter((o) => o.id !== id));
}

export type { DusunOfficial };
