"use client";

import { CardEditButton } from "@/components/ui/manage-bar";
import { useAuth } from "@/components/providers/auth-provider";
import { canManageArticle } from "@/lib/newsService";
import { canManageUmkm } from "@/lib/umkmService";
import { canManageOrganization } from "@/lib/organizationService";
import type { NewsArticle } from "@/lib/data/newsData";
import type { UMKM } from "@/lib/data/umkmData";
import type { Organization } from "@/lib/data/organizationData";

export function NewsEditButton({ article }: { article: NewsArticle }) {
  const { user } = useAuth();
  return (
    <CardEditButton
      href={`/dashboard/berita/${article.id}`}
      label={`Edit berita ${article.title}`}
      show={canManageArticle(user, article)}
    />
  );
}

export function UmkmEditButton({ umkm }: { umkm: UMKM }) {
  const { user } = useAuth();
  return (
    <CardEditButton
      href={`/dashboard/umkm/${umkm.id}`}
      label={`Edit UMKM ${umkm.nama}`}
      show={canManageUmkm(user, umkm)}
    />
  );
}

export function OrganizationEditButton({ organization }: { organization: Organization }) {
  const { user } = useAuth();
  return (
    <CardEditButton
      href={`/dashboard/organisasi/${organization.id}`}
      label={`Edit organisasi ${organization.name}`}
      show={canManageOrganization(user, organization)}
    />
  );
}
