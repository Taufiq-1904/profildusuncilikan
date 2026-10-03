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
  // Data URLs for now; storage URLs once there is a real backend.
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

const SEED_STAMP = "2026-09-24T08:00:00.000Z";

export const organizationSeed: Organization[] = [
  {
    id: "org-seed-kelompok-tani",
    slug: "kelompok-tani",
    name: "Kelompok Tani Cilikan",
    summary: "Kelompok tani warga Dusun Cilikan yang diketuai Bapak Suharyanta.",
    description: [
      "Kelompok Tani Cilikan menghimpun warga dusun yang bertani, sebagai wadah berbagi pengalaman dan koordinasi kegiatan pertanian.",
      "Kelompok ini diketuai oleh Bapak Suharyanta.",
    ],
    fieldId: "ekonomi",
    wilayahId: "dusun",
    leader: "Suharyanta",
    gallery: [],
    createdAt: SEED_STAMP,
    updatedAt: SEED_STAMP,
  },
  {
    id: "org-seed-kelompok-kandang",
    slug: "kelompok-kandang",
    name: "Kelompok Kandang Cilikan",
    summary: "Kelompok peternak warga Dusun Cilikan yang diketuai Bapak Puji Wahono.",
    description: [
      "Kelompok Kandang Cilikan menjadi wadah bagi warga yang beternak, untuk saling berbagi ilmu dan mengelola kegiatan peternakan bersama.",
      "Kelompok ini diketuai oleh Bapak Puji Wahono.",
    ],
    fieldId: "ekonomi",
    wilayahId: "dusun",
    leader: "Puji Wahono",
    gallery: [],
    createdAt: SEED_STAMP,
    updatedAt: SEED_STAMP,
  },
  {
    id: "org-seed-pemuda",
    slug: "pemuda-cilikan",
    name: "Pemuda Cilikan",
    summary: "Wadah kegiatan pemuda Dusun Cilikan yang diketuai Iqbal.",
    description: [
      "Pemuda Cilikan adalah wadah kegiatan generasi muda dusun, terlibat dalam kegiatan sosial dan kemasyarakatan.",
      "Diketuai oleh Iqbal.",
    ],
    fieldId: "kepemudaan",
    wilayahId: "dusun",
    leader: "Iqbal",
    gallery: [],
    createdAt: SEED_STAMP,
    updatedAt: SEED_STAMP,
  },
  {
    id: "org-seed-kader",
    slug: "kader-dusun",
    name: "Kader Dusun Cilikan",
    summary: "Para kader yang aktif melayani kegiatan kesehatan dan sosial warga dusun.",
    description: [
      "Kader Dusun Cilikan beranggotakan Nopi Damar, Munarti, Wijiyati (Mak Enok), Susi, Yulia Rohman, Harmini, dan Umi.",
      "Para kader membantu berbagai kegiatan kesehatan dan kemasyarakatan di dusun.",
    ],
    fieldId: "sosial",
    wilayahId: "dusun",
    leader: "Nopi Damar",
    gallery: [],
    createdAt: SEED_STAMP,
    updatedAt: SEED_STAMP,
  },
  {
    id: "org-seed-lpmd",
    slug: "lpmd-cilikan",
    name: "LPMD Cilikan",
    summary: "Lembaga Pemberdayaan Masyarakat Dusun yang diketuai Saiin Ardiansyah.",
    description: [
      "LPMD Cilikan berperan mendorong pemberdayaan dan pembangunan dusun bersama warga.",
      "Lembaga ini diketuai oleh Saiin Ardiansyah.",
    ],
    fieldId: "sosial",
    wilayahId: "dusun",
    leader: "Saiin Ardiansyah",
    gallery: [],
    createdAt: SEED_STAMP,
    updatedAt: SEED_STAMP,
  },
  {
    id: "org-seed-jaga-warga",
    slug: "jaga-warga",
    name: "Jaga Warga Cilikan",
    summary: "Kelompok penjaga keamanan lingkungan dusun, dikoordinir Samsul Hadi.",
    description: [
      "Jaga Warga membantu menjaga keamanan dan kenyamanan lingkungan Dusun Cilikan.",
      "Dikoordinir oleh Samsul Hadi.",
    ],
    fieldId: "sosial",
    wilayahId: "dusun",
    leader: "Samsul Hadi",
    gallery: [],
    createdAt: SEED_STAMP,
    updatedAt: SEED_STAMP,
  },
];
