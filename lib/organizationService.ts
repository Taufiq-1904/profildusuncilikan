import { AccessError, requireSession, requireWilayah } from "./access";
import { canManageWilayah, type SessionUser } from "./auth";
import {
  MAX_ORGANIZATION_GALLERY,
  organizationFields,
  type Organization,
  type OrganizationMember,
} from "./data/organizationData";
import { getWilayahLevel } from "./data/wilayahData";
import { rowToOrganization } from "./db/mappers";
import { toUserError } from "./db/errors";
import { saveWithUniqueSlug } from "./db/slug";
import { validateLocation } from "./geo";
import { droppedMedia, removeMedia } from "./image-upload";
import { safeExternalUrl } from "./links";
import { createRemoteStore } from "./remoteStore";
import { getSupabase } from "./supabase/client";
import { slugify } from "./utils";

async function loadOrganizations(): Promise<Organization[]> {
  const { data, error } = await getSupabase().from("organizations").select("*").order("name", { ascending: true });
  if (error) throw toUserError(error, "Data organisasi gagal dimuat.");
  return (data ?? []).map(rowToOrganization);
}

export const organizationStore = createRemoteStore<Organization>({ load: loadOrganizations });

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

function guessSlug(base: string, all: Organization[], excludeId?: string): { guess: string; root: string } {
  const root = slugify(base) || "organisasi";
  const taken = new Set(all.filter((o) => o.id !== excludeId).map((o) => o.slug));
  let guess = root;
  for (let n = 2; taken.has(guess); n += 1) guess = `${root}-${n}`;
  return { guess, root };
}

function clean(value?: string): string | null {
  const v = value?.trim();
  return v || null;
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

function toRow(input: OrganizationInput, slug: string, existingMembers: OrganizationMember[] = []) {
  return {
    slug,
    name: input.name.trim(),
    logo: input.logo ?? null,
    summary: input.summary.trim(),
    description: input.description.map((p) => p.trim()).filter(Boolean),
    field_id: input.fieldId,
    wilayah_id: input.wilayahId,
    founded_year: input.foundedYear ?? null,
    leader: clean(input.leader),
    contact: clean(input.contact),
    alamat: clean(input.alamat),
    maps_url: clean(input.mapsUrl),
    lat: input.lat ?? null,
    lng: input.lng ?? null,
    instagram: clean(input.instagram),
    facebook: clean(input.facebook),
    website: clean(input.website),
    gallery: input.gallery,
    members: buildMembers(input.members, existingMembers) ?? [],
  };
}

export async function createOrganization(input: OrganizationInput): Promise<Organization> {
  const session = requireSession();
  requireWilayah(session, input.wilayahId);
  validate(input);

  const supabase = getSupabase();
  const { guess, root } = guessSlug(input.slug || input.name, organizationStore.getState().items);
  const { data, error } = await saveWithUniqueSlug(guess, root, (slug) =>
    supabase
      .from("organizations")
      .insert({ ...toRow(input, slug), created_by: session.userId })
      .select("*")
      .single()
  );
  if (error || !data) throw toUserError(error ?? { message: "no data" }, "Organisasi gagal disimpan.");

  await organizationStore.refresh();
  return rowToOrganization(data);
}

export async function updateOrganization(id: string, input: OrganizationInput): Promise<Organization> {
  const session = requireSession();
  const all = organizationStore.getState().items;
  const existing = findOrganizationById(all, id);
  if (!existing) throw new Error("Organisasi tidak ditemukan.");
  // Both ends are checked: the account must own the current wilayah and the
  // wilayah the organization is being moved to.
  if (!canManageOrganization(session, existing)) throw new AccessError();
  requireWilayah(session, input.wilayahId);
  validate(input);

  const supabase = getSupabase();
  const { guess, root } = guessSlug(input.slug || input.name, all, id);
  const { data, error } = await saveWithUniqueSlug(guess, root, (slug) =>
    supabase
      .from("organizations")
      .update(toRow(input, slug, existing.members))
      .eq("id", id)
      .select("*")
      .maybeSingle()
  );
  if (error) throw toUserError(error, "Organisasi gagal disimpan.");
  if (!data) throw new AccessError();

  await removeMedia(droppedMedia([existing.logo, ...existing.gallery], [input.logo, ...input.gallery]));
  await organizationStore.refresh();
  return rowToOrganization(data);
}

export async function deleteOrganization(id: string): Promise<void> {
  const session = requireSession();
  const existing = findOrganizationById(organizationStore.getState().items, id);
  if (!existing) return;
  if (!canManageOrganization(session, existing)) throw new AccessError();

  const { data, error } = await getSupabase().from("organizations").delete().eq("id", id).select("id");
  if (error) throw toUserError(error, "Organisasi gagal dihapus.");
  if (!data || data.length === 0) throw new AccessError();

  await removeMedia([existing.logo, ...existing.gallery]);
  await organizationStore.refresh();
}

export type { Organization, OrganizationMember };
