import Link from "next/link";

export function Notice({ message, backHref, backLabel }: { message: string; backHref: string; backLabel: string }) {
  return (
    <div className="p-8">
      <p className="text-sm text-ink-700">{message}</p>
      <Link href={backHref} className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline">
        {backLabel}
      </Link>
    </div>
  );
}
