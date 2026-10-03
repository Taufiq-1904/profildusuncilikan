"use client";

import { useParams } from "next/navigation";
import { Notice } from "@/components/dashboard/notice";
import { OrganizationEditor } from "@/components/dashboard/organization-editor";
import { useAuth } from "@/components/providers/auth-provider";
import { useOrganizations, useOrganizationsReady } from "@/lib/hooks/use-directory";
import { canManageOrganization, findOrganizationById } from "@/lib/organizationService";

export default function EditOrganisasiPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isClient = useOrganizationsReady();
  const all = useOrganizations();

  // The editor copies the record into form state once on mount, so it must
  // not mount until the list has been loaded from Supabase.
  if (!isClient) return null;

  const organization = findOrganizationById(all, id);
  const back = { backHref: "/dashboard/organisasi", backLabel: "Kembali ke daftar organisasi" };
  if (!organization) return <Notice message="Organisasi tidak ditemukan." {...back} />;
  if (!canManageOrganization(user, organization)) {
    return <Notice message="Akun Anda tidak memiliki wewenang untuk mengedit organisasi ini." {...back} />;
  }

  return <OrganizationEditor key={organization.id} organization={organization} />;
}
