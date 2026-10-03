import type { Metadata } from "next";
import { UmkmDetail } from "@/components/sections/umkm-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { getRTWithRWLabel } from "@/lib/data/wilayahData";
import { buildMetadata } from "@/lib/seo";
import { getActiveUmkmBySlug } from "@/lib/server/public-content";

type Props = { params: Promise<{ slug: string }> };

// Metadata dan JSON-LD dibaca dari Supabase di server (hanya UMKM yang aktif).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const umkm = await getActiveUmkmBySlug(slug);
  if (!umkm) return { title: "UMKM Dusun" };
  return buildMetadata({
    title: umkm.nama,
    description: umkm.deskripsi ?? `${umkm.jenis} di ${getRTWithRWLabel(umkm.rtId)}.`,
    path: `/umkm/${umkm.slug}`,
    image: umkm.galeri[0] ?? umkm.logo,
  });
}

export default async function UmkmDetailPage({ params }: Props) {
  const { slug } = await params;
  const umkm = await getActiveUmkmBySlug(slug);

  return (
    <>
      {umkm && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: umkm.nama,
            description: umkm.deskripsi,
            image: umkm.galeri[0] ?? umkm.logo,
            telephone: umkm.kontak,
            address: umkm.alamat
              ? { "@type": "PostalAddress", streetAddress: umkm.alamat, addressLocality: getRTWithRWLabel(umkm.rtId) }
              : undefined,
            ...(umkm.lat !== undefined && umkm.lng !== undefined
              ? { geo: { "@type": "GeoCoordinates", latitude: umkm.lat, longitude: umkm.lng } }
              : {}),
          }}
        />
      )}
      <UmkmDetail slug={slug} />
    </>
  );
}
