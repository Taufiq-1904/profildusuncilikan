
// A person on the dusun organization chart. The chart is data-driven: people
// are grouped into rows by `tier` (1 = top row) and ordered inside a row by
// `order`, so adding a row or a person never touches the page component.
export type DusunOfficial = {
  id: string;
  name: string;
  position: string;
  // Data URL for now; storage URL once there is a real backend.
  photo?: string;
  period?: string;
  tier: number;
  order: number;
  createdAt: string;
  updatedAt: string;
};

const SEED_STAMP = "2026-09-29T00:00:00.000Z";

type Row = [string, string, number, string];
// [nama, jabatan, tier, id]. Tier 1 paling atas; urutan di dalam tier mengikuti urutan array.
const rows: Row[] = [
  ["Nur Edy P", "Dukuh", 1, "dukuh"],
  ["Sukendar", "Ketua RW 09", 2, "rw09"],
  ["Halim", "Ketua RW 10", 2, "rw10"],
  ["Supriyono", "Tokoh Masyarakat", 2, "tomas"],
  ["Bayu K", "Ketua RT 01", 3, "rt01"],
  ["Ilham", "Ketua RT 02", 3, "rt02"],
  ["Darsono", "Ketua RT 03", 3, "rt03"],
  ["Suyadi", "Ketua RT 04", 3, "rt04"],
  ["Saiin Ardiansyah", "Ketua LPMD", 4, "lpmd"],
  ["Samsul Hadi", "Jaga Warga", 4, "jaga-warga"],
  ["Puji Wahono", "Ketua Kelompok Kandang", 4, "kandang"],
  ["Suharyanta", "Ketua Kelompok Tani", 4, "tani"],
  ["Iqbal", "Ketua Pemuda", 4, "pemuda"],
  ["Nopi Damar", "Kader", 5, "kader-nopi"],
  ["Munarti", "Kader", 5, "kader-munarti"],
  ["Wijiyati (Mak Enok)", "Kader", 5, "kader-wijiyati"],
  ["Susi", "Kader", 5, "kader-susi"],
  ["Yulia Rohman", "Kader", 5, "kader-yulia"],
  ["Harmini", "Kader", 5, "kader-harmini"],
  ["Umi", "Kader", 5, "kader-umi"],
  ["Maya", "Ibu Dukuh", 6, "ibu-dukuh"],
  ["Hasil", "Ibu Ketua RW 09", 6, "ibu-rw09"],
  ["Saryati", "Ibu Ketua RW 10", 6, "ibu-rw10"],
  ["Ida", "Ibu Ketua RT 01", 6, "ibu-rt01"],
  ["Novi", "Ibu Ketua RT 02", 6, "ibu-rt02"],
  ["Sugiyatmi", "Ibu Ketua RT 03", 6, "ibu-rt03"],
  ["Agnes", "Ibu Ketua RT 04", 6, "ibu-rt04"],
];

export const dusunOfficialsSeed: DusunOfficial[] = rows.map(([name, position, tier, id], i) => ({
  id: `official-seed-${id}`,
  name,
  position,
  tier,
  order: i + 1,
  createdAt: SEED_STAMP,
  updatedAt: SEED_STAMP,
}));

export function sortOfficials(list: DusunOfficial[]): DusunOfficial[] {
  return [...list].sort((a, b) => a.tier - b.tier || a.order - b.order || a.name.localeCompare(b.name, "id"));
}

export type OfficialTier = { tier: number; people: DusunOfficial[] };

export function groupOfficialsByTier(list: DusunOfficial[]): OfficialTier[] {
  const tiers = new Map<number, DusunOfficial[]>();
  sortOfficials(list).forEach((o) => {
    tiers.set(o.tier, [...(tiers.get(o.tier) ?? []), o]);
  });
  return Array.from(tiers, ([tier, people]) => ({ tier, people }));
}
