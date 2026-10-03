"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { getManageableWilayah } from "@/lib/auth";
import {
  MAX_ORGANIZATION_GALLERY,
  organizationFields,
  type Organization,
} from "@/lib/data/organizationData";
import {
  createOrganization,
  updateOrganization,
  type OrganizationInput,
} from "@/lib/organizationService";
import { cn, slugify } from "@/lib/utils";
import {
  errorClass,
  fieldClass,
  hintClass,
  labelClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./form-styles";
import { GalleryField, ImageField } from "./image-field";
import { LocationFields, parseCoordinate, type LocationValues } from "./location-fields";

type MemberRow = { key: string; name: string; position: string };

export function OrganizationEditor({ organization }: { organization?: Organization }) {
  const router = useRouter();
  const { user } = useAuth();
  const destinations = useMemo(() => getManageableWilayah(user), [user]);

  const [name, setName] = useState(organization?.name ?? "");
  const [slug, setSlug] = useState(organization?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(organization));
  const [summary, setSummary] = useState(organization?.summary ?? "");
  const [description, setDescription] = useState(organization?.description.join("\n\n") ?? "");
  const [fieldId, setFieldId] = useState(organization?.fieldId ?? organizationFields[0].id);
  const [wilayahId, setWilayahId] = useState(organization?.wilayahId ?? destinations[0]?.id ?? "");
  const [foundedYear, setFoundedYear] = useState(organization?.foundedYear?.toString() ?? "");
  const [leader, setLeader] = useState(organization?.leader ?? "");
  const [contact, setContact] = useState(organization?.contact ?? "");
  const [instagram, setInstagram] = useState(organization?.instagram ?? "");
  const [facebook, setFacebook] = useState(organization?.facebook ?? "");
  const [website, setWebsite] = useState(organization?.website ?? "");
  const [location, setLocation] = useState<LocationValues>({
    alamat: organization?.alamat ?? "",
    mapsUrl: organization?.mapsUrl ?? "",
    lat: organization?.lat?.toString() ?? "",
    lng: organization?.lng?.toString() ?? "",
  });
  const [logo, setLogo] = useState(organization?.logo);
  const [gallery, setGallery] = useState<string[]>(organization?.gallery ?? []);
  // The management structure is optional: off means "profile only".
  const [hasStructure, setHasStructure] = useState(Boolean(organization?.members?.length));
  const [members, setMembers] = useState<MemberRow[]>(
    () => organization?.members?.map((m) => ({ key: m.id, name: m.name, position: m.position })) ?? []
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const effectiveSlug = slugTouched ? slug : slugify(name);
  const paragraphs = description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  function addMember() {
    setMembers((rows) => [
      ...rows,
      { key: `new-${Date.now().toString(36)}-${rows.length}`, name: "", position: "" },
    ]);
  }

  function updateMember(key: string, patch: Partial<MemberRow>) {
    setMembers((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function moveMember(index: number, direction: -1 | 1) {
    setMembers((rows) => {
      const target = index + direction;
      if (target < 0 || target >= rows.length) return rows;
      const next = [...rows];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function toggleStructure(on: boolean) {
    setHasStructure(on);
    if (on && members.length === 0) addMember();
  }

  function save() {
    setError("");
    const lat = parseCoordinate(location.lat);
    const lng = parseCoordinate(location.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError("Latitude dan longitude harus berupa angka, misalnya -7.7028 dan 110.4219.");
      return;
    }
    setBusy(true);
    const input: OrganizationInput = {
      name,
      slug: effectiveSlug,
      logo,
      summary,
      description: paragraphs,
      fieldId,
      wilayahId,
      foundedYear: foundedYear.trim() ? Number(foundedYear) : undefined,
      leader,
      contact,
      instagram,
      facebook,
      website,
      alamat: location.alamat,
      mapsUrl: location.mapsUrl,
      lat,
      lng,
      gallery,
      members: hasStructure ? members.map((m) => ({ name: m.name, position: m.position })) : undefined,
    };
    try {
      if (organization) updateOrganization(organization.id, input);
      else createOrganization(input);
      router.push("/dashboard/organisasi");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Organisasi gagal disimpan.");
      setBusy(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          {organization ? "Edit Organisasi" : "Organisasi Baru"}
        </h1>
      </div>

      {error && (
        <p role="alert" className={cn(errorClass, "mb-6")}>
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className={cn(panelClass, "space-y-5 p-6")}>
            <div>
              <label htmlFor="org-name" className={labelClass}>Nama organisasi</label>
              <input id="org-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Enggal Makmur" className={fieldClass} />
            </div>

            <div>
              <label htmlFor="org-slug" className={labelClass}>Slug</label>
              <input
                id="org-slug"
                type="text"
                value={effectiveSlug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugTouched(true);
                }}
                className={cn(fieldClass, "font-mono text-xs")}
              />
              <p className={hintClass}>Alamat halaman: /organisasi/{effectiveSlug || "..."}</p>
            </div>

            <div>
              <label htmlFor="org-summary" className={labelClass}>Ringkasan</label>
              <textarea id="org-summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} placeholder="Satu atau dua kalimat yang tampil di kartu dan pratinjau tautan" className={cn(fieldClass, "resize-none")} />
            </div>

            <div>
              <label htmlFor="org-description" className={labelClass}>Deskripsi</label>
              <textarea id="org-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={8} placeholder="Pisahkan paragraf dengan satu baris kosong." className={cn(fieldClass, "resize-y leading-relaxed")} />
            </div>
          </div>

          <div className={cn(panelClass, "p-6")}>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={hasStructure}
                onChange={(e) => toggleStructure(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500"
              />
              <span>
                <span className="block text-sm font-semibold text-ink-900">Tampilkan struktur kepengurusan</span>
                <span className="block text-sm text-ink-500">
                  Opsional. Biarkan mati jika organisasi hanya memiliki profil.
                </span>
              </span>
            </label>

            {hasStructure && (
              <div className="mt-5 space-y-3">
                {members.map((m, i) => (
                  <div key={m.key} className="flex flex-col gap-2 rounded-xl border border-line bg-cream p-3 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => updateMember(m.key, { name: e.target.value })}
                      placeholder="Nama"
                      aria-label={`Nama pengurus ${i + 1}`}
                      className={fieldClass}
                    />
                    <input
                      type="text"
                      value={m.position}
                      onChange={(e) => updateMember(m.key, { position: e.target.value })}
                      placeholder="Jabatan"
                      aria-label={`Jabatan pengurus ${i + 1}`}
                      className={fieldClass}
                    />
                    <div className="flex shrink-0 items-center gap-1">
                      <button type="button" onClick={() => moveMember(i, -1)} disabled={i === 0} aria-label={`Naikkan pengurus ${i + 1}`} className="rounded-lg p-2 text-ink-500 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30">
                        <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => moveMember(i, 1)} disabled={i === members.length - 1} aria-label={`Turunkan pengurus ${i + 1}`} className="rounded-lg p-2 text-ink-500 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30">
                        <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => setMembers((rows) => rows.filter((r) => r.key !== m.key))} aria-label={`Hapus pengurus ${i + 1}`} className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addMember} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Tambah pengurus
                </button>
              </div>
            )}
          </div>

          <div className={cn(panelClass, "space-y-5 p-6")}>
            <div>
              <h2 className="font-display text-base font-semibold text-ink-900">Lokasi sekretariat</h2>
              <p className="mt-1 text-sm text-ink-500">Opsional. Tandai lokasinya di peta agar organisasi tampil di halaman Peta.</p>
            </div>
            <LocationFields idPrefix="org" values={location} onChange={setLocation} kind="Organisasi" />
          </div>
        </div>

        <div className="space-y-5">
          <div className={panelClass}>
            <ImageField label="Logo / foto" value={logo} onChange={setLogo} onError={setError} maxWidth={500} hint="Diperkecil otomatis agar muat di penyimpanan browser." />
          </div>

          <div className={cn(panelClass, "space-y-4")}>
            <div>
              <label htmlFor="org-field" className={labelClass}>Bidang kegiatan</label>
              <select id="org-field" value={fieldId} onChange={(e) => setFieldId(e.target.value)} className={fieldClass}>
                {organizationFields.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="org-wilayah" className={labelClass}>Wilayah asal</label>
              <select id="org-wilayah" value={wilayahId} onChange={(e) => setWilayahId(e.target.value)} disabled={destinations.length <= 1} className={fieldClass}>
                {destinations.map((w) => (
                  <option key={w.id} value={w.id}>{w.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="org-year" className={labelClass}>Tahun berdiri <span className="font-normal text-ink-500">(opsional)</span></label>
              <input id="org-year" type="number" inputMode="numeric" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} placeholder="2020" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="org-leader" className={labelClass}>Ketua / penanggung jawab <span className="font-normal text-ink-500">(opsional)</span></label>
              <input id="org-leader" type="text" value={leader} onChange={(e) => setLeader(e.target.value)} className={fieldClass} />
            </div>
          </div>

          <div className={cn(panelClass, "space-y-4")}>
            <div>
              <label htmlFor="org-contact" className={labelClass}>Kontak <span className="font-normal text-ink-500">(opsional)</span></label>
              <input id="org-contact" type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="0812-3456-7890" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="org-instagram" className={labelClass}>Instagram</label>
              <input id="org-instagram" type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@namaakun" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="org-facebook" className={labelClass}>Facebook</label>
              <input id="org-facebook" type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="namahalaman atau link" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="org-website" className={labelClass}>Website</label>
              <input id="org-website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className={fieldClass} />
            </div>
          </div>

          <div className={panelClass}>
            <GalleryField label="Galeri kegiatan" values={gallery} onChange={setGallery} onError={setError} max={MAX_ORGANIZATION_GALLERY} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => router.push("/dashboard/organisasi")} disabled={busy} className={secondaryButtonClass}>
          Batal
        </button>
        <button type="button" onClick={save} disabled={busy} className={primaryButtonClass}>
          {organization ? "Simpan Perubahan" : "Simpan Organisasi"}
        </button>
      </div>
    </div>
  );
}
