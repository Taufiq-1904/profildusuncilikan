"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Container } from "./container";
import { VillageMark } from "./village-mark";
import { siteConfig, type NavLink } from "@/lib/data/siteConfig";
import { cn } from "@/lib/utils";

function matches(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

// Inside a group, the most specific matching sibling wins, so "/profil" is
// not also lit up while the visitor is on "/profil/struktur".
function isChildActive(pathname: string, child: NavLink, siblings: NavLink[]): boolean {
  if (!matches(pathname, child.href)) return false;
  return !siblings.some(
    (s) => s.href !== child.href && s.href.startsWith(`${child.href}/`) && matches(pathname, s.href)
  );
}

function isItemActive(pathname: string, item: NavLink): boolean {
  if (matches(pathname, item.href)) return true;
  return item.children?.some((c) => matches(pathname, c.href)) ?? false;
}

export function Navbar() {
  const pathname = usePathname();
  return <NavbarInner key={pathname} pathname={pathname} />;
}

function NavbarInner({ pathname }: { pathname: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    setOpen(false);
    await signOut();
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-brand-700/40 bg-brand-950/95 shadow-sm backdrop-blur-md transition-all duration-300",
        scrolled || open ? "shadow-brand-950/20" : "shadow-transparent"
      )}
    >
      <Container>
        <div className="flex h-[72px] items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`Beranda ${siteConfig.villageName}`}>
            <VillageMark />
            <span className="font-display text-lg font-semibold leading-none text-brand-50">
              {siteConfig.villageName}
            </span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden min-w-0 flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
            {siteConfig.navigation.map((item) => {
              const active = isItemActive(pathname, item);
              const linkClass = cn(
                "relative inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium transition-colors",
                "text-brand-100/90 hover:text-amber-400",
                active && "text-amber-400"
              );
              const underline = active && (
                <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-amber-400" />
              );

              if (!item.children) {
                return (
                  <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={linkClass}>
                    {item.label}
                    {underline}
                  </Link>
                );
              }

              // Dropdown is pure CSS (hover or keyboard focus inside), so it
              // costs no JavaScript and works with Tab.
              return (
                <div key={item.href} className="group relative">
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
                    {underline}
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-4 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="rounded-xl border border-brand-700/40 bg-brand-950 p-2 shadow-lg shadow-brand-950/30">
                      {item.children.map((child) => {
                        const childActive = isChildActive(pathname, child, item.children!);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={childActive ? "page" : undefined}
                              className={cn(
                                "block rounded-lg px-3 py-2.5 text-sm text-brand-100 transition-colors hover:bg-brand-800 hover:text-amber-400",
                                childActive && "bg-brand-800 text-amber-400"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <Link
              href="/kontak"
              className="inline-flex h-10 items-center rounded-full bg-amber-500 px-5 text-sm font-semibold text-brand-950 transition-colors hover:bg-amber-400"
            >
              Layanan Dusun
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-100/40 px-5 text-sm font-semibold text-brand-100/90 transition-colors hover:bg-brand-800 hover:text-white"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-red-300/50 px-5 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20 hover:text-white"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Keluar
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-100/40 px-5 text-sm font-semibold text-brand-100/90 transition-colors hover:bg-brand-800 hover:text-white"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Masuk
              </Link>
            )}
          </div>

          {(
            <Link
              href={user ? "/dashboard" : "/login"}
              aria-label={user ? "Buka dashboard" : "Masuk ke panel pengelola"}
              className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full border border-brand-100/40 px-3.5 text-sm font-semibold text-brand-100/90 transition-colors hover:bg-brand-800 hover:text-white lg:hidden"
            >
              {user ? <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> : <LogIn className="h-4 w-4" aria-hidden="true" />}
              {user ? "Dashboard" : "Masuk"}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-50 lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <div id="menu-mobile" className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-brand-700/40 bg-brand-950 lg:hidden">
          <Container className="py-4">
            <nav aria-label="Navigasi mobile" className="flex flex-col gap-1">
              {siteConfig.navigation.map((item) =>
                item.children ? (
                  <div key={item.href} className="py-1">
                    <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-brand-100/60">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block rounded-lg px-3 py-3 text-base font-medium text-brand-100 hover:bg-brand-800 hover:text-amber-400",
                          isChildActive(pathname, child, item.children!) && "bg-brand-800 text-amber-400"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-3 text-base font-medium text-brand-100 hover:bg-brand-800 hover:text-amber-400",
                      matches(pathname, item.href) && "bg-brand-800 text-amber-400"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <Link href="/kontak" className="mt-2 rounded-full bg-brand-700 px-4 py-3 text-center text-sm font-semibold text-white">
                Layanan Dusun
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="mt-1 flex items-center justify-center gap-2 rounded-full border border-brand-100/40 px-4 py-3 text-sm font-semibold text-brand-100 hover:bg-brand-800 hover:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-1 flex items-center justify-center gap-2 rounded-full border border-red-300/50 px-4 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/20 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Keluar
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="mt-1 flex items-center justify-center gap-2 rounded-full border border-brand-100/40 px-4 py-3 text-sm font-semibold text-brand-100 hover:bg-brand-800 hover:text-white"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Masuk ke Panel
                </Link>
              )}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
