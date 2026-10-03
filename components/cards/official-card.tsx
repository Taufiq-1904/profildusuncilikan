import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { Official } from "@/lib/data/officialsData";

export function OfficialCard({ official }: { official: Official }) {
  return (
    <div className="group text-center">
      <ImagePlaceholder
        tone="green"
        icon="users"
        label={official.name}
        className="mx-auto aspect-square w-full max-w-[200px] rounded-2xl"
      />
      <h3 className="mt-4 font-display text-base font-semibold text-ink-900">
        {official.name}
      </h3>
      <p className="mt-1 text-sm text-ink-500">{official.position}</p>
    </div>
  );
}
