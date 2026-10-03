export function Timeline({
  items,
}: {
  items: { year: string; title: string; description: string }[];
}) {
  return (
    <ol className="relative border-l border-line pl-8">
      {items.map((item) => (
        <li key={item.year} className="mb-10 last:mb-0">
          <span className="absolute -left-[9px] mt-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-paper bg-gold-500" />
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {item.year}
          </span>
          <h3 className="mt-1 font-display text-lg font-semibold text-ink-900">
            {item.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
            {item.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
