"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, MessageCircle, Package, Pencil, Phone, User } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ManageBar } from "@/components/ui/manage-bar";
import { Container } from "@/components/layout/container";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MediaImage } from "@/components/ui/media-image";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { getRTWithRWLabel } from "@/lib/data/wilayahData";
import { useUmkm } from "@/lib/hooks/use-directory";
import { useIsClient } from "@/lib/hooks/use-news";
import { googleMapsDirectionsUrl, googleMapsUrl, isPhoneLike, whatsappUrl } from "@/lib/links";
import { canManageUmkm, findUmkmBySlug } from "@/lib/umkmService";
import { cn } from "@/lib/utils";

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-ink-500">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wide text-ink-500">{label}</dt>
        <dd className="mt-0.5 break-words text-sm text-ink-900">{children}</dd>
      </div>
    </div>
  );
}

const actionClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors";

export function UmkmDetail({ slug }: { slug: string }) {
  const { user } = useAuth();
  const isClient = useIsClient();
  const umkm = findUmkmBySlug(useUmkm(), slug);

  const name = umkm?.nama;
  useEffect(() => {
    if (name) document.title = `${name} — UMKM Dusun`;
  }, [name]);

  if (!umkm) {
    if (!isClient) return <LoadingSpinner />;
    notFound();
  }

  const canEdit = canManageUmkm(user, umkm);
  // Inactive businesses are hidden from visitors but stay reachable for the
  // accounts that manage them.
  if (!umkm.aktif && !canEdit) {
    if (!isClient) return <LoadingSpinner />;
    notFound();
  }

  const heroImage = umkm.galeri[0] ?? umkm.logo;
  const moreImages = umkm.galeri.slice(1);
  const whatsapp = whatsappUrl(umkm.kontak);
  const maps = googleMapsUrl(umkm);
  const directions = googleMapsDirectionsUrl(umkm);

  return (
    <>
      <Breadcrumb items={[{ label: "UMKM", href: "/umkm" }, { label: umkm.nama }]} />
      <ManageBar href={`/dashboard/umkm/${umkm.id}`} label="Edit UMKM ini" show={canEdit} />

      {!umkm.aktif && (
        <div className="border-b border-amber-100 bg-amber-50">
          <Container>
            <p className="py-3 text-sm text-amber-700">
              UMKM ini sedang nonaktif dan hanya terlihat oleh pengelola. Pengunjung belum bisa membukanya.
            </p>
          </Container>
        </div>
      )}

      <article className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <div>
              <Badge variant="gold">{umkm.jenis}</Badge>
              <h1 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl">
                {umkm.nama}
              </h1>
              <p className="mt-2 text-sm text-ink-500">{getRTWithRWLabel(umkm.rtId)}</p>

              <MediaImage
                src={heroImage}
                alt={umkm.nama}
                icon="package"
                tone="gold"
                priority
                sizes="(min-width: 1024px) 720px, 100vw"
                className="mt-8 aspect-[16/9] w-full rounded-3xl"
              />

              {umkm.deskripsi && (
                <p className="mt-8 text-base leading-relaxed text-ink-700">{umkm.deskripsi}</p>
              )}

              {umkm.produk && (
                <section className="mt-8" aria-labelledby="produk-umkm">
                  <h2 id="produk-umkm" className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
                    <Package className="h-5 w-5 text-brand-700" aria-hidden="true" />
                    Produk & Layanan
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-ink-700">{umkm.produk}</p>
                </section>
              )}

              {moreImages.length > 0 && (
                <section className="mt-12" aria-labelledby="galeri-umkm">
                  <h2 id="galeri-umkm" className="mb-5 font-display text-xl font-semibold text-ink-900">
                    Galeri
                  </h2>
                  <PhotoGallery images={moreImages} title={umkm.nama} />
                </section>
              )}
            </div>

            <aside aria-label="Informasi usaha" className="h-fit rounded-2xl border border-line bg-paper p-6 shadow-sm">
              <h2 className="font-display text-lg font-semibold text-ink-900">Informasi Usaha</h2>
              <dl className="mt-5 space-y-4">
                {umkm.alamat && (
                  <InfoRow icon={<MapPin className="h-4 w-4" aria-hidden="true" />} label="Alamat">
                    {umkm.alamat}
                  </InfoRow>
                )}
                {umkm.jamOperasional && (
                  <InfoRow icon={<Clock className="h-4 w-4" aria-hidden="true" />} label="Jam operasional">
                    {umkm.jamOperasional}
                  </InfoRow>
                )}
                {umkm.kontak && (
                  <InfoRow icon={<Phone className="h-4 w-4" aria-hidden="true" />} label="Kontak">
                    {umkm.kontak}
                  </InfoRow>
                )}
                {umkm.tampilkanPemilik && umkm.pemilik && (
                  <InfoRow icon={<User className="h-4 w-4" aria-hidden="true" />} label="Pemilik">
                    {umkm.pemilik}
                  </InfoRow>
                )}
              </dl>

              {(maps || whatsapp || (umkm.kontak && isPhoneLike(umkm.kontak))) && (
                <div className="mt-6 space-y-3 border-t border-line pt-6">
                  {maps && (
                    <a
                      href={maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(actionClass, "bg-brand-700 text-white hover:bg-brand-800")}
                    >
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      Buka di Google Maps
                    </a>
                  )}
                  {directions && (
                    <a
                      href={directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(actionClass, "border border-line text-ink-700 hover:bg-cream-100")}
                    >
                      Petunjuk arah
                    </a>
                  )}
                  {whatsapp && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(actionClass, "border border-brand-700 text-brand-700 hover:bg-brand-50")}
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Hubungi via WhatsApp
                    </a>
                  )}
                </div>
              )}

              {canEdit && (
                <Link
                  href={`/dashboard/umkm/${umkm.id}`}
                  className="mt-6 inline-flex items-center gap-2 border-t border-line pt-5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit UMKM ini
                </Link>
              )}
            </aside>
          </div>
        </Container>
      </article>
    </>
  );
}
