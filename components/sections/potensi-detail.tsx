"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";
import { PotentialCard } from "@/components/cards/potential-card";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ManageBar } from "@/components/ui/manage-bar";
import { MediaImage } from "@/components/ui/media-image";
import { canManageWilayah } from "@/lib/auth";
import { getPotensiVisual } from "@/lib/data/potensiData";
import { getRTWithRWLabel } from "@/lib/data/wilayahData";
import { usePotensi, usePotensiReady } from "@/lib/hooks/use-directory";

export function PotensiDetail({ id }: { id: string }) {
  const { user } = useAuth();
  const ready = usePotensiReady();
  const all = usePotensi();
  const potential = all.find((p) => p.id === id);

  const title = potential?.judul;
  useEffect(() => {
    if (title) document.title = `${title} — Potensi Dusun`;
  }, [title]);

  if (!potential) {
    if (!ready) return <LoadingSpinner />;
    notFound();
  }

  const visual = getPotensiVisual(potential.kategori);
  const related = all.filter((p) => p.id !== potential.id).slice(0, 3);
  const paragraphs = potential.deskripsi.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <>
      <Breadcrumb
        items={[{ label: "Potensi Dusun", href: "/potensi" }, { label: potential.judul }]}
      />
      <ManageBar
        href={`/dashboard/rt/${potential.rtId}`}
        label="Kelola potensi"
        show={canManageWilayah(user, potential.rtId)}
      />

      <article className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <MediaImage
                src={potential.foto}
                alt={potential.judul}
                tone={visual.tone}
                icon={visual.icon}
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="aspect-[4/3] w-full rounded-3xl"
              />

              <Badge variant="gold" className="mt-8">
                {potential.kategori}
              </Badge>
              <h1 className="mt-4 text-balance font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
                {potential.judul}
              </h1>
              <p className="mt-4 text-sm text-ink-500">{getRTWithRWLabel(potential.rtId)}</p>

              <div className="mt-8 space-y-4">
                {paragraphs.map((para, i) => (
                  <p key={i} className="whitespace-pre-line text-base leading-relaxed text-ink-700">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="bg-brand-950 p-6 text-white">
                <h2 className="font-display text-base font-semibold">Tertarik Berkolaborasi?</h2>
                <p className="mt-2 text-sm text-brand-100/80">
                  Hubungi kantor dukuh untuk informasi lebih lanjut mengenai potensi ini.
                </p>
                <Link
                  href="/kontak"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-400 hover:text-gold-300"
                >
                  Hubungi Kami
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            </aside>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="bg-cream py-16 sm:py-20">
          <Container>
            <h2 className="mb-8 font-display text-2xl font-semibold text-ink-900">
              Potensi Lainnya
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PotentialCard key={p.id} potential={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
