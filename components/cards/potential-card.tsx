import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { getPotensiVisual, type RTPotensi } from "@/lib/data/potensiData";
import { getRTWithRWLabel } from "@/lib/data/wilayahData";

export function PotentialCard({ potential }: { potential: RTPotensi }) {
  const visual = getPotensiVisual(potential.kategori);

  return (
    <Card className="group flex flex-col overflow-hidden hover:shadow-md">
      <Link href={`/potensi/${potential.id}`} className="flex h-full flex-col">
        <ImagePlaceholder
          tone={visual.tone}
          icon={visual.icon}
          label={potential.judul}
          className="aspect-[4/3] w-full"
        />
        <div className="flex flex-1 flex-col p-5">
          <Badge variant="gold" className="w-fit">
            {potential.kategori}
          </Badge>
          <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
            {potential.judul}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">
            {potential.deskripsi}
          </p>
          <p className="mt-3 text-xs text-ink-500">{getRTWithRWLabel(potential.rtId)}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
            Lihat detail
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
