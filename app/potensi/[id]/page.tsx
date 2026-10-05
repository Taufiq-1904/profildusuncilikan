import type { Metadata } from "next";
import { PotensiDetail } from "@/components/sections/potensi-detail";
import { getRTWithRWLabel } from "@/lib/data/wilayahData";
import { buildMetadata } from "@/lib/seo";
import { getPotensiById } from "@/lib/server/public-content";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const potensi = await getPotensiById(id);
  if (!potensi) return { title: "Potensi Dusun" };
  const ringkas = potensi.deskripsi.replace(/\s+/g, " ").trim();
  return buildMetadata({
    title: potensi.judul,
    description:
      ringkas.length > 160
        ? `${ringkas.slice(0, 157)}...`
        : ringkas || `${potensi.kategori} di ${getRTWithRWLabel(potensi.rtId)}.`,
    path: `/potensi/${potensi.id}`,
    image: potensi.foto,
  });
}

export default async function PotensiDetailPage({ params }: Props) {
  const { id } = await params;
  return <PotensiDetail id={id} />;
}
