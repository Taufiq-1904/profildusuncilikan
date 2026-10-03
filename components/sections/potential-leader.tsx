"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useOrganizations } from "@/lib/hooks/use-directory";

// Ketua kelompok dibaca dari data organisasi, jadi pergantian ketua cukup
// diubah di Dashboard > Organisasi.
export function PotentialLeader({ organizationSlug }: { organizationSlug?: string }) {
  const organizations = useOrganizations();
  const org = organizationSlug ? organizations.find((o) => o.slug === organizationSlug) : undefined;
  if (!org?.leader) return null;

  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-700">
      <User className="h-4 w-4 text-brand-700" aria-hidden="true" />
      <span>
        Ketua kelompok: <span className="font-semibold text-ink-900">{org.leader}</span>
      </span>
      <Link href={`/organisasi/${org.slug}`} className="font-semibold text-brand-700 hover:text-brand-800">
        Lihat profil kelompok
      </Link>
    </p>
  );
}
