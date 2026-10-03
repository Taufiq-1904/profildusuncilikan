"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ExternalLink, Globe, MapPin, MessageCircle, Pencil, User } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ManageBar } from "@/components/ui/manage-bar";
import { Container } from "@/components/layout/container";
import { PersonCard } from "@/components/cards/person-card";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MediaImage } from "@/components/ui/media-image";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { getOrganizationFieldName } from "@/lib/data/organizationData";
import { getWilayahLabel } from "@/lib/data/wilayahData";
import { useOrganizations, useOrganizationsReady } from "@/lib/hooks/use-directory";
import { facebookUrl, googleMapsDirectionsUrl, googleMapsUrl, instagramUrl, safeExternalUrl, whatsappUrl } from "@/lib/links";
import { canManageOrganization, findOrganizationBySlug } from "@/lib/organizationService";

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

const linkClass = "font-medium text-brand-700 hover:text-brand-800 hover:underline";

export function OrganizationDetail({ slug }: { slug: string }) {
  const { user } = useAuth();
  const isClient = useOrganizationsReady();
  const org = findOrganizationBySlug(useOrganizations(), slug);

  // Keeps the tab title right once the organization has loaded.
  const name = org?.name;
  useEffect(() => {
    if (name) document.title = `${name} — Organisasi & Komunitas`;
  }, [name]);

  // Only give up on a slug after the list has been loaded from Supabase.
  if (!org) {
    if (!isClient) return <LoadingSpinner />;
    notFound();
  }

  const canEdit = canManageOrganization(user, org);
  const members = org.members ?? [];
  const whatsapp = whatsappUrl(org.contact);
  const instagram = instagramUrl(org.instagram);
  const facebook = facebookUrl(org.facebook);
  const website = safeExternalUrl(org.website);
  const maps = googleMapsUrl(org);
  const directions = googleMapsDirectionsUrl(org);

  return (
    <>
      <Breadcrumb
        items={[{ label: "Organisasi & Komunitas", href: "/organisasi" }, { label: org.name }]}
      />
      <ManageBar href={`/dashboard/organisasi/${org.id}`} label="Edit organisasi ini" show={canEdit} />

      <article className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <div>
              <div className="flex items-center gap-5">
                <MediaImage
                  src={org.logo}
                  alt={`Logo ${org.name}`}
                  icon="users"
                  fit="contain"
                  priority
                  sizes="96px"
                  className="h-24 w-24 shrink-0 rounded-3xl border border-line"
                />
                <div className="min-w-0">
                  <Badge variant="brand">{getOrganizationFieldName(org.fieldId)}</Badge>
                  <h1 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl">
                    {org.name}
                  </h1>
                </div>
              </div>

              <p className="mt-8 text-lg leading-relaxed text-ink-700">{org.summary}</p>
              <div className="mt-6 space-y-5">
                {org.description.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-ink-700">
                    {p}
                  </p>
                ))}
              </div>

              {org.gallery.length > 0 && (
                <section className="mt-12" aria-labelledby="galeri-kegiatan">
                  <h2 id="galeri-kegiatan" className="mb-5 font-display text-xl font-semibold text-ink-900">
                    Galeri Kegiatan
                  </h2>
                  <PhotoGallery images={org.gallery} title={org.name} />
                </section>
              )}

              {members.length > 0 && (
                <section className="mt-12" aria-labelledby="struktur-organisasi">
                  <h2 id="struktur-organisasi" className="mb-5 font-display text-xl font-semibold text-ink-900">
                    Struktur Kepengurusan
                  </h2>
                  <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[...members]
                      .sort((a, b) => a.order - b.order)
                      .map((m) => (
                        <li key={m.id} className="flex">
                          <PersonCard name={m.name} position={m.position} />
                        </li>
                      ))}
                  </ul>
                </section>
              )}
            </div>

            <aside aria-label="Informasi organisasi" className="h-fit rounded-2xl border border-line bg-paper p-6 shadow-sm">
              <h2 className="font-display text-lg font-semibold text-ink-900">Informasi</h2>
              <dl className="mt-5 space-y-4">
                <InfoRow icon={<MapPin className="h-4 w-4" aria-hidden="true" />} label="Wilayah asal">
                  {getWilayahLabel(org.wilayahId)}
                </InfoRow>
                {org.alamat && (
                  <InfoRow icon={<MapPin className="h-4 w-4" aria-hidden="true" />} label="Alamat">
                    {org.alamat}
                  </InfoRow>
                )}
                {org.foundedYear && (
                  <InfoRow icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />} label="Tahun berdiri">
                    {org.foundedYear}
                  </InfoRow>
                )}
                {org.leader && (
                  <InfoRow icon={<User className="h-4 w-4" aria-hidden="true" />} label="Ketua / penanggung jawab">
                    {org.leader}
                  </InfoRow>
                )}
                {org.contact && (
                  <InfoRow icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />} label="Kontak">
                    {whatsapp ? (
                      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {org.contact}
                      </a>
                    ) : (
                      org.contact
                    )}
                  </InfoRow>
                )}
                {instagram && (
                  <InfoRow icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />} label="Instagram">
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {org.instagram}
                    </a>
                  </InfoRow>
                )}
                {facebook && (
                  <InfoRow icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />} label="Facebook">
                    <a href={facebook} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {org.facebook}
                    </a>
                  </InfoRow>
                )}
                {website && (
                  <InfoRow icon={<Globe className="h-4 w-4" aria-hidden="true" />} label="Website">
                    <a href={website} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {org.website}
                    </a>
                  </InfoRow>
                )}
              </dl>

              {maps && (
                <div className="mt-6 space-y-3 border-t border-line pt-6">
                  <a
                    href={maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Buka di Google Maps
                    <span className="sr-only"> (tab baru)</span>
                  </a>
                  {directions && (
                    <a
                      href={directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-700 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                    >
                      Petunjuk arah
                      <span className="sr-only"> (tab baru)</span>
                    </a>
                  )}
                </div>
              )}

              {canEdit && (
                <Link
                  href={`/dashboard/organisasi/${org.id}`}
                  className="mt-6 inline-flex items-center gap-2 border-t border-line pt-5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit organisasi ini
                </Link>
              )}
            </aside>
          </div>
        </Container>
      </article>
    </>
  );
}
