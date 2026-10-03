import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { UmkmEditButton } from "@/components/cards/edit-links";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import type { UMKM } from "@/lib/data/umkmData";
import { getRTWithRWLabel } from "@/lib/data/wilayahData";

// A directory entry, not a shop listing: no prices, no cart, just who and
// where.
export function UmkmCard({ umkm }: { umkm: UMKM }) {
  const image = umkm.galeri[0] ?? umkm.logo;
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden hover:shadow-md">
      <Link href={`/umkm/${umkm.slug}`} className="flex h-full flex-col">
        <MediaImage
          src={image}
          alt={umkm.nama}
          icon="package"
          tone="gold"
          className="aspect-[16/10] w-full"
        />
        <div className="flex flex-1 flex-col p-5">
          <Badge variant="gold" className="self-start">
            {umkm.jenis}
          </Badge>
          <h3 className="mt-3 text-balance font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
            {umkm.nama}
          </h3>
          <p className="mt-1 text-xs text-ink-500">{getRTWithRWLabel(umkm.rtId)}</p>
          {umkm.deskripsi && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{umkm.deskripsi}</p>
          )}
          <div className="mt-4 flex flex-1 items-end justify-between gap-3">
            {umkm.alamat ? (
              <p className="flex min-w-0 items-center gap-1.5 text-xs text-ink-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{umkm.alamat}</span>
              </p>
            ) : (
              <span />
            )}
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700">
              Detail
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
      <UmkmEditButton umkm={umkm} />
    </Card>
  );
}
