"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronRight,
  Map,
  Newspaper,
  Home,
  Store,
  Network,
  Menu,
  X,
  KeyRound,
  Globe,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { rwList, getRTsByRW, getRWById } from "@/lib/data/wilayahData";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  dusunOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard, exact: true },
  // Berita, Organisasi and UMKM are shared by every role; each list is scoped
  // to what the signed-in account may manage. Peta is dusun-wide for now, RW/RT reach
  // their pinpoints through /dashboard/rt/[id]/peta.
  { href: "/dashboard/berita", label: "Berita", icon: Newspaper },
  { href: "/dashboard/organisasi", label: "Organisasi", icon: Users },
  { href: "/dashboard/umkm", label: "UMKM", icon: Store },
  // Struktur: tiap akun mengisi bagan wilayahnya sendiri. Peta dusun khusus akun Dusun.
  { href: "/dashboard/struktur", label: "Struktur", icon: Network },
  { href: "/dashboard/peta", label: "Peta Dusun", icon: Map, dusunOnly: true },
  { href: "/dashboard/akun", label: "Akun & Password", icon: KeyRound },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  const role = user?.role;
  const isDusun = role === "dusun";
  const isRW = role === "rw";
  const isRT = role === "rt";

  // Dusun sees every RW/RT; an RW account sees only its own RTs; an RT
  // account only sees its own detail link.
  const visibleRTs = isDusun
    ? null // rendered grouped by RW below
    : isRW
    ? getRTsByRW(user!.wilayahId)
    : isRT
    ? [{ id: user!.wilayahId, label: user!.wilayahId.toUpperCase() }]
    : [];

  // Closed by default; opened only on mobile via the hamburger button below.
  // Remember which page the drawer was opened on; it counts as closed as soon
  // as the pathname changes, so navigating never leaves it open.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean) => setOpenOn(next ? pathname : null);

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar: the sidebar itself is an off-canvas drawer below lg. */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-paper px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu dashboard"
          aria-expanded={open}
          aria-controls="dashboard-sidebar"
          className="rounded-lg p-2 text-ink-700 hover:bg-cream-100"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <p className="font-display text-sm font-semibold text-ink-900">Panel Pengelola</p>
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Keluar"
          className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-ink-900/40 lg:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-line bg-paper transition-transform duration-200 ease-out",
          "lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 lg:flex-shrink-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-end px-3 pt-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu dashboard"
            className="rounded-lg p-2 text-ink-500 hover:bg-cream-100"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      {/* Brand */}
      <div className="border-b border-line px-6 py-5"
        style={{ background: "linear-gradient(135deg, #052e16 0%, #0e4f5c 100%)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">Panel Pengelola</p>
        <p className="mt-1 font-display text-base font-semibold text-white">Dusun Cilikan</p>
      </div>

      {/* User */}
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {user?.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{user?.displayName}</p>
            <p className="text-xs text-ink-500 capitalize">
              {isDusun ? "Admin Dusun" : isRW ? `Ketua ${user?.wilayahId.toUpperCase()}` : `Ketua ${user?.wilayahId.toUpperCase()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          if (item.dusunOnly && !isDusun) return null;
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-700 hover:bg-cream-100 hover:text-ink-900"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-brand-600" : "text-ink-400")} />
              {item.label}
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-brand-500" />}
            </Link>
          );
        })}

        {/* Dusun: full wilayah tree grouped by RW */}
        {isDusun && (
          <>
            <div className="my-3 border-t border-line" />
            <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
              Data per Wilayah
            </p>
            {rwList.map((rw) => (
              <div key={rw.id} className="mb-2">
                <p className="px-3 py-1 text-xs font-semibold text-ink-500">{rw.label}</p>
                {getRTsByRW(rw.id).map((rt) => {
                  const href = `/dashboard/rt/${rt.id}`;
                  const active = pathname.startsWith(href);
                  return (
                    <Link
                      key={rt.id}
                      href={href}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink-700 hover:bg-cream-100 hover:text-ink-900"
                      )}
                    >
                      <Home className={cn("h-4 w-4 shrink-0", active ? "text-brand-600" : "text-ink-400")} />
                      {rt.label}
                      {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-brand-500" />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </>
        )}

        {/* RW: its own RTs only */}
        {isRW && (
          <>
            <div className="my-3 border-t border-line" />
            <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
              {getRWById(user!.wilayahId)?.label ?? "RT di Wilayah Saya"}
            </p>
            {visibleRTs!.map((rt) => {
              const href = `/dashboard/rt/${rt.id}`;
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={rt.id}
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-700 hover:bg-cream-100 hover:text-ink-900"
                  )}
                >
                  <Home className={cn("h-4 w-4 shrink-0", active ? "text-brand-600" : "text-ink-400")} />
                  {rt.label}
                  {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-brand-500" />}
                </Link>
              );
            })}
          </>
        )}

        {/* RT: only its own section */}
        {isRT && (
          <>
            <div className="my-3 border-t border-line" />
            <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
              Area Saya
            </p>
            {[
              { href: `/dashboard/rt/${user!.wilayahId}`, label: "Detail RT", icon: Users },
              { href: `/dashboard/rt/${user!.wilayahId}/peta`, label: "Pinpoint Saya", icon: Map },
            ].map((item) => {
              const active = item.href.endsWith(user!.wilayahId)
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-700 hover:bg-cream-100 hover:text-ink-900"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-brand-600" : "text-ink-400")} />
                  {item.label}
                  {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-brand-500" />}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="space-y-0.5 border-t border-line px-3 py-4">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-cream-100 hover:text-ink-900"
        >
          <Globe className="h-4 w-4" />
          Lihat Situs
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
      </aside>
    </>
  );
}
