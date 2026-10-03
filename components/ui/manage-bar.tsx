"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import type { Role } from "@/lib/data/authData";

// A visible strip near the top of a public page for signed-in managers, so
// the edit action is not buried at the bottom of the page.
export function ManageBar({ href, label, show }: { href: string; label: string; show: boolean }) {
  if (!show) return null;
  return (
    <div className="border-b border-brand-100 bg-brand-50">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="text-sm text-brand-800">Anda masuk sebagai pengelola.</p>
        <Link
          href={href}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          {label}
        </Link>
      </div>
    </div>
  );
}

// Same strip for pages that are not tied to one record, shown by account role.
export function RoleManageBar({ roles, href, label }: { roles: Role[]; href: string; label: string }) {
  const { user } = useAuth();
  return <ManageBar href={href} label={label} show={Boolean(user && roles.includes(user.role))} />;
}

// Small pencil pinned to the corner of a card. Rendered next to (never inside)
// the card's link, so links are not nested.
export function CardEditButton({ href, label, show }: { href: string; label: string; show: boolean }) {
  if (!show) return null;
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-brand-700 shadow-md ring-1 ring-black/5 transition-colors hover:bg-brand-600 hover:text-white"
    >
      <Pencil className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
