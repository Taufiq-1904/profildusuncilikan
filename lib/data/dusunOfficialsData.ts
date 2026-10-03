
// A person on the dusun organization chart. The chart is data-driven: people
// are grouped into rows by `tier` (1 = top row) and ordered inside a row by
// `order`, so adding a row or a person never touches the page component.
export type DusunOfficial = {
  id: string;
  name: string;
  position: string;
  // Public URL in Supabase Storage (bucket "media").
  photo?: string;
  period?: string;
  // Wilayah pemilik baris ini: "dusun", id RW ("rw09"), atau id RT ("rt01").
  // Menentukan siapa yang boleh mengubahnya dan di bagan mana ia tampil.
  ownerId: string;
  // Bila diisi (selalu sama dengan ownerId), orang ini adalah kepala wilayah
  // tersebut: dukuh / ketua RW / ketua RT. Sumber nama ketua di seluruh situs.
  wilayahId?: string;
  tier: number;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export function sortOfficials(list: DusunOfficial[]): DusunOfficial[] {
  return [...list].sort((a, b) => a.tier - b.tier || a.order - b.order || a.name.localeCompare(b.name, "id"));
}

// Baris struktur milik satu wilayah saja.
export function officialsOf(list: DusunOfficial[], ownerId: string): DusunOfficial[] {
  return list.filter((o) => o.ownerId === ownerId);
}

// Pengurus di struktur sebuah wilayah menurut awal teks jabatannya, mis.
// "sekretaris" menemukan "Sekretaris RT". Tidak ada = undefined.
export function findByPosition(list: DusunOfficial[], ownerId: string, keyword: string): DusunOfficial | undefined {
  const k = keyword.toLowerCase();
  return list.find((o) => o.ownerId === ownerId && o.position.trim().toLowerCase().startsWith(k));
}

// Kepala (dukuh / ketua RW / ketua RT) dari sebuah wilayah, bila sudah ditandai.
export function findWilayahHead(list: DusunOfficial[], wilayahId: string): DusunOfficial | undefined {
  return list.find((o) => o.wilayahId === wilayahId);
}

export type OfficialTier = { tier: number; people: DusunOfficial[] };

export function groupOfficialsByTier(list: DusunOfficial[]): OfficialTier[] {
  const tiers = new Map<number, DusunOfficial[]>();
  sortOfficials(list).forEach((o) => {
    tiers.set(o.tier, [...(tiers.get(o.tier) ?? []), o]);
  });
  return Array.from(tiers, ([tier, people]) => ({ tier, people }));
}
