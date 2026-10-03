"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// The dashboard has its own sidebar and top bar. Rendering the public
// navbar there as well covered the dashboard's mobile menu button (both are
// fixed/sticky at the top), which made it impossible to tap.
export function HideOnDashboard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) return null;
  return <>{children}</>;
}
