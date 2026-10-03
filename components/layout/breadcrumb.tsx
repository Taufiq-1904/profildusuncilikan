import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Container } from "./container";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <div className="border-b border-line bg-cream-100/60">
      <Container>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 py-3 text-sm text-ink-500">
          <Link href="/" className="flex items-center gap-1 hover:text-brand-700" aria-label="Beranda">
            <Home className="h-3.5 w-3.5" />
          </Link>
          {items.map((item, i) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
              {item.href && i !== items.length - 1 ? (
                <Link href={item.href} className="hover:text-brand-700">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-ink-900" aria-current="page">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      </Container>
    </div>
  );
}
