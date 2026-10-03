export type OrganizationField = {
  id: string;
  name: string;
};

// Areas of activity, used for the badge on each organization and the filter.
export const organizationFields: OrganizationField[] = [
  { id: "lingkungan", name: "Lingkungan & Kebersihan" },
  { id: "kepemudaan", name: "Kepemudaan" },
  { id: "sosial", name: "Sosial Kemasyarakatan" },
  { id: "ekonomi", name: "Ekonomi & Usaha" },
  { id: "keagamaan", name: "Keagamaan" },
  { id: "seni-budaya", name: "Seni & Budaya" },
  { id: "lainnya", name: "Lainnya" },
];

export function getOrganizationFieldName(fieldId: string): string {
  return organizationFields.find((f) => f.id === fieldId)?.name ?? "Lainnya";
}

// A person in an organization's optional management structure. Stored inside
// the organization record; `order` is the display position.
export type OrganizationMember = {
  id: string;
  name: string;
  position: string;
  order: number;
};

export type Organization = {
  id: string;
  slug: string;
  name: string;
  // Public URLs in Supabase Storage (bucket "media").
  logo?: string;
  // One-line description shown on cards and in link previews.
  summary: string;
  // One string per paragraph.
  description: string[];
  fieldId: string;
  // Where the organization comes from: "dusun", an RW id, or an RT id.
  wilayahId: string;
  foundedYear?: number;
  leader?: string;
  contact?: string;
  // Optional secretariat / meeting place. Any of these puts it on the map.
  alamat?: string;
  mapsUrl?: string;
  lat?: number;
  lng?: number;
  instagram?: string;
  facebook?: string;
  website?: string;
  gallery: string[];
  // Optional. An organization can have a profile only, or a profile plus a
  // management structure. Empty or missing means "profile only".
  members?: OrganizationMember[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export const MAX_ORGANIZATION_GALLERY = 6;
