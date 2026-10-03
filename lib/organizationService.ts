import { AccessError, requireSession, requireWilayah } from "./access";
import { canManageWilayah, type SessionUser } from "./auth";
import { createLocalStore } from "./localStore";
import {
  MAX_ORGANIZATION_GALLERY,
  organizationFields,
  organizationSeed,
  type Organization,
  type OrganizationMember,
} from "./data/organizationData";
import { getWilayahLevel } from "./data/wilayahData";
import { validateLocation } from "./geo";
import { safeExternalUrl } from "./links";
import { slugify } from "./utils";

export const organizationStore = createLocalStore<Organization>({
  key: "cilikan_organizations_v1",
  seed: organizationSeed,
});

export type OrganizationMemberInput = Pick<OrganizationMember, "name" | "position">;

export type OrganizationInput = Omit<
  Organization,
  "id" | "members" | "createdBy" | "createdAt" | "updatedAt"
> & {
  // Omit or pass an empty list for a profile-only organization.
  members?: OrganizationMemberInput[];
};

// --- policy ----------------------------------------------------------------

export function canManageOrganization(session: SessionUser | null, org: Organization): boolean {
  return canManageWilayah(session, org.wilayahId);
}

// --- selectors -------------------------------------------------------------

function byName(a: Organization, b: Organization): number {
  return a.name.localeCompare(b.name, "id");
}

export function selectAllOrganizations(all: Organization[]): Organization[] {
  return [...all].sort(byName);
}

export function selectManageableOrganizations(
  all: Organization[],
  session: SessionUser | null
): Organization[] {
  return all.filter((o) => canManageOrganization(session, o)).sort(byName);
}

export function findOrganizationBySlug(all: Organization[], slug: string): Organization | undefined {
  return all.find((o) => o.slug === slug);
}

export function findOrganizationById(all: Organization[], id: string): Organization | undefined {
  return all.find((o) => o.id === id);
}

// --- mutations -------------------------------------------------------------

function uniqueSlug(base: string, all: Organization[], excludeId?: string): string {
  const root = slugify(base) || "organisasi";
  const taken = new Set(all.filter((o) => o.id !== excludeId).map((o) => o.slug));
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

function clean(value?: string): string | undefined {
  const v = value?.trim();
  return v || undefined;
}

function validate(input: OrganizationInput): void {
  if (!input.name.trim()) throw new Error("Nama organisasi wajib diisi.");
  if (!input.summary.trim()) throw new Error("Ringkasan organisasi wajib diisi.");
  if (input.description.filter((p) => p.trim()).length === 0) {
    throw new Error("Deskripsi organisasi wajib diisi.");
  }
  if (!organizationFields.some((f) => f.id === input.fieldId)) {
    throw new Error("Pilih bidang kegiatan organisasi.");
  }
  if (!getWilayahLevel(input.wilayahId)) throw new Error("Pilih wilayah asal organisasi.");
  if (input.foundedYear !== undefined) {
    const max = new Date().getFullYear();
    if (!Number.isInteger(input.foundedYear) || input.foundedYear < 1900 || input.foundedYear > max) {
      throw new Error(`Tahun berdiri harus antara 1900 dan ${max}.`);
    }
  }
  if (input.website?.trim() && !safeExternalUrl(input.website)) {
    throw new Error("Alamat website harus diawali http:// atau https://.");
  }
  validateLocation(input);
  if (input.gallery.length > MAX_ORGANIZATION_GALLERY) {
    throw new Error(`Galeri maksimal ${MAX_ORGANIZATION_GALLERY} foto.`);
  }
  (input.members ?? []).forEach((m, i) => {
    const hasName = m.name.trim() !== "";
    const hasPosition = m.position.trim() !== "";
    if (hasName !== hasPosition) {
      throw new Error(`Pengurus nomor ${i + 1}: isi nama dan jabatan, atau hapus barisnya.`);
    }
  });
}

function buildMembers(members: OrganizationMemberInput[] | undefined, existing: OrganizationMember[] = []) {
  const rows = (members ?? [])
    .map((m) => ({ name: m.name.trim(), position: m.position.trim() }))
    .filter((m) => m.name && m.position);
  if (rows.length === 0) return undefined;
  return rows.map((m, i) => ({
    ...m,
    id: existing[i]?.id ?? `member-${Date.now().toString(36)}-${i}`,
    order: i + 1,
  }));
}

function buildFields(input: OrganizationInput, all: Organization[], excludeId?: string) {
  return {
    name: input.name.trim(),
    slug: uniqueSlug(input.slug || input.name, all, excludeId),
    logo: input.logo,
    summary: input.summary.trim(),
    description: input.description.map((p) => p.trim()).filter(Boolean),
    fieldId: input.fieldId,
    wilayahId: input.wilayahId,
    foundedYear: input.foundedYear,
    leader: clean(input.leader),
    contact: clean(input.contact),
    alamat: clean(input.alamat),
    mapsUrl: clean(input.mapsUrl),
    lat: input.lat,
    lng: input.lng,
    instagram: clean(input.instagram),
    facebook: clean(input.facebook),
    website: clean(input.website),
    gallery: input.gallery,
  };
}

export function createOrganization(input: OrganizationInput): Organization {
  const session = requireSession();
  requireWilayah(session, input.wilayahId);
  validate(input);

  const all = organizationStore.getSnapshot();
  const now = new Date().toISOString();
  const org: Organization = {
    ...buildFields(input, all),
    members: buildMembers(input.members),
    id: `org-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdBy: session.username,
    createdAt: now,
    updatedAt: now,
  };
  organizationStore.write([...all, org]);
  return org;
}

export function updateOrganization(id: string, input: OrganizationInput): Organization {
  const session = requireSession();
  const all = organizationStore.getSnapshot();
  const existing = findOrganizationById(all, id);
  if (!existing) throw new Error("Organisasi tidak ditemukan.");
  // Both ends are checked: the account must own the current wilayah and the
  // wilayah the organization is being moved to.
  if (!canManageOrganization(session, existing)) throw new AccessError();
  requireWilayah(session, input.wilayahId);
  validate(input);

  const updated: Organization = {
    ...existing,
    ...buildFields(input, all, id),
    members: buildMembers(input.members, existing.members),
    updatedAt: new Date().toISOString(),
  };
  organizationStore.write(all.map((o) => (o.id === id ? updated : o)));
  return updated;
}

export function deleteOrganization(id: string): void {
  const session = requireSession();
  const all = organizationStore.getSnapshot();
  const existing = findOrganizationById(all, id);
  if (!existing) return;
  if (!canManageOrganization(session, existing)) throw new AccessError();
  organizationStore.write(all.filter((o) => o.id !== id));
}

export type { Organization, OrganizationMember };
