export function BarStat({
  data,
  total,
}: {
  data: { group: string; value: number }[];
  total: number;
}) {
  return (
    <div className="space-y-4">
      {data.map((row) => {
        const pct = Math.round((row.value / total) * 100);
        return (
          <div key={row.group}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-medium text-ink-900">{row.group}</span>
              <span className="text-ink-500">
                {row.value.toLocaleString("id-ID")} jiwa ({pct}%)
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-50">
              <div
                className="h-full rounded-full bg-brand-600"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
