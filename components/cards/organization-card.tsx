import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { OrganizationEditButton } from "@/components/cards/edit-links";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import { getOrganizationFieldName, type Organization } from "@/lib/data/organizationData";
import { getWilayahLabel } from "@/lib/data/wilayahData";

export function OrganizationCard({ organization }: { organization: Organization }) {
  return (
    <Card className="group relative h-full hover:shadow-md">
      <Link href={`/organisasi/${organization.slug}`} className="flex h-full flex-col p-5">
        <div className="flex items-center gap-4">
          <MediaImage
            src={organization.logo}
            alt={`Logo ${organization.name}`}
            icon="users"
            fit="contain"
            sizes="64px"
            className="h-16 w-16 shrink-0 rounded-2xl"
          />
          <div className="min-w-0">
            <h3 className="text-balance font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
              {organization.name}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {getWilayahLabel(organization.wilayahId)}
            </p>
          </div>
        </div>

        <Badge variant="brand" className="mt-4 self-start">
          {getOrganizationFieldName(organization.fieldId)}
        </Badge>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">{organization.summary}</p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          Lihat profil
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
      <OrganizationEditButton organization={organization} />
    </Card>
  );
}
