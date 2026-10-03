import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { Potential } from "@/lib/data/potentialsData";

export function PotentialCard({ potential }: { potential: Potential }) {
  return (
    <Card className="group flex flex-col overflow-hidden hover:shadow-md">
      <Link href={`/potensi/${potential.slug}`} className="flex h-full flex-col">
        <ImagePlaceholder
          tone={potential.imageTone}
          icon={potential.icon}
          label={potential.title}
          className="aspect-[4/3] w-full"
        />
        <div className="flex flex-1 flex-col p-5">
          <Badge variant="gold" className="w-fit">
            {potential.category}
          </Badge>
          <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
            {potential.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">
            {potential.summary}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
            Lihat detail
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
