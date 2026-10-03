import type { Metadata } from "next";
import { OrganizationDetail } from "@/components/sections/organization-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSeed } from "@/lib/data/organizationData";
import { getWilayahLabel } from "@/lib/data/wilayahData";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// The server can only see the seed organizations. Ones added from the
// dashboard live in the browser until there is a database, so they fall back
// to the generic title (the page sets the real tab title once it loads).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const org = organizationSeed.find((o) => o.slug === slug);
  if (!org) return { title: "Organisasi & Komunitas" };
  return buildMetadata({ title: org.name, description: org.summary, path: `/organisasi/${org.slug}`, image: org.gallery[0] ?? org.logo });
}

export default async function OrganisasiDetailPage({ params }: Props) {
  const { slug } = await params;
  const org = organizationSeed.find((o) => o.slug === slug);

  return (
    <>
      {org && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: org.name,
            description: org.summary,
            image: org.gallery[0] ?? org.logo,
            foundingDate: org.foundedYear ? String(org.foundedYear) : undefined,
            areaServed: getWilayahLabel(org.wilayahId),
            address: org.alamat ? { "@type": "PostalAddress", streetAddress: org.alamat } : undefined,
          }}
        />
      )}
      <OrganizationDetail slug={slug} />
    </>
  );
}
