"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { getManageableWilayah } from "@/lib/auth";
import { MAX_UMKM_GALLERY, umkmSuggestedCategories, type UMKM } from "@/lib/data/umkmData";
import { createUmkm, updateUmkm, type UmkmInput } from "@/lib/umkmService";
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

export function UmkmEditor({ umkm, defaultRtId }: { umkm?: UMKM; defaultRtId?: string }) {
  const router = useRouter();
  const { user } = useAuth();
  // A business always belongs to an RT, so only RTs are offered here.
  const rtOptions = useMemo(() => getManageableWilayah(user).filter((w) => w.level === "rt"), [user]);
  const initialRt =
    umkm?.rtId ??
    (defaultRtId && rtOptions.some((r) => r.id === defaultRtId) ? defaultRtId : rtOptions[0]?.id) ??
    "";

  const [nama, setNama] = useState(umkm?.nama ?? "");
  const [slug, setSlug] = useState(umkm?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(umkm));
  const [jenis, setJenis] = useState(umkm?.jenis ?? umkmSuggestedCategories[0]);
  const [rtId, setRtId] = useState(initialRt);
  const [deskripsi, setDeskripsi] = useState(umkm?.deskripsi ?? "");
  const [produk, setProduk] = useState(umkm?.produk ?? "");
  const [pemilik, setPemilik] = useState(umkm?.pemilik ?? "");
  const [tampilkanPemilik, setTampilkanPemilik] = useState(umkm?.tampilkanPemilik ?? false);
  const [kontak, setKontak] = useState(umkm?.kontak ?? "");
  const [jamOperasional, setJamOperasional] = useState(umkm?.jamOperasional ?? "");
  const [location, setLocation] = useState<LocationValues>({
    alamat: umkm?.alamat ?? "",
    mapsUrl: umkm?.mapsUrl ?? "",
    lat: umkm?.lat?.toString() ?? "",
    lng: umkm?.lng?.toString() ?? "",
  });
  const [logo, setLogo] = useState(umkm?.logo);
  const [galeri, setGaleri] = useState<string[]>(umkm?.galeri ?? []);
  const [aktif, setAktif] = useState(umkm?.aktif ?? true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const effectiveSlug = slugTouched ? slug : slugify(nama);

  async function save() {
    setError("");
    const latitude = parseCoordinate(location.lat);
    const longitude = parseCoordinate(location.lng);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setError("Latitude dan longitude harus berupa angka, misalnya -7.7028 dan 110.4219.");
      return;
    }

    setBusy(true);
    const input: UmkmInput = {
      slug: effectiveSlug,
      nama,
      jenis,
      pemilik,
      tampilkanPemilik,
      kontak,
      deskripsi,
      produk,
      alamat: location.alamat,
      jamOperasional,
      mapsUrl: location.mapsUrl,
      lat: latitude,
      lng: longitude,
      logo,
      galeri,
      aktif,
      rtId,
    };
    try {
      if (umkm) await updateUmkm(umkm.id, input);
      else await createUmkm(input);
      router.push("/dashboard/umkm");
    } catch (e) {
      setError(e instanceof Error ? e.message : "UMKM gagal disimpan.");
      setBusy(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900">{umkm ? "Edit UMKM" : "UMKM Baru"}</h1>
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
              <label htmlFor="umkm-nama" className={labelClass}>Nama UMKM</label>
              <input id="umkm-nama" type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Warung Bu Siti" className={fieldClass} />
            </div>

            <div>
              <label htmlFor="umkm-slug" className={labelClass}>Slug</label>
              <input
                id="umkm-slug"
                type="text"
                value={effectiveSlug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugTouched(true);
                }}
                className={cn(fieldClass, "font-mono text-xs")}
              />
              <p className={hintClass}>Alamat halaman: /umkm/{effectiveSlug || "..."}</p>
            </div>

            <div>
              <label htmlFor="umkm-deskripsi" className={labelClass}>Deskripsi</label>
              <textarea id="umkm-deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={4} placeholder="Ceritakan singkat tentang usaha ini" className={cn(fieldClass, "resize-y leading-relaxed")} />
            </div>

            <div>
              <label htmlFor="umkm-produk" className={labelClass}>Produk & layanan</label>
              <input id="umkm-produk" type="text" value={produk} onChange={(e) => setProduk(e.target.value)} placeholder="Contoh: Sembako, Jajanan, Servis Motor" className={fieldClass} />
            </div>
          </div>

          <div className={cn(panelClass, "space-y-5 p-6")}>
            <h2 className="font-display text-base font-semibold text-ink-900">Lokasi & kontak</h2>

            <LocationFields idPrefix="umkm" values={location} onChange={setLocation} kind="UMKM" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="umkm-kontak" className={labelClass}>Nomor kontak / WhatsApp <span className="font-normal text-ink-500">(opsional)</span></label>
                <input id="umkm-kontak" type="tel" value={kontak} onChange={(e) => setKontak(e.target.value)} placeholder="0812-3456-7890" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="umkm-jam" className={labelClass}>Jam operasional <span className="font-normal text-ink-500">(opsional)</span></label>
                <input id="umkm-jam" type="text" value={jamOperasional} onChange={(e) => setJamOperasional(e.target.value)} placeholder="Setiap hari, 07.00 – 17.00" className={fieldClass} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className={panelClass}>
            <ImageField label="Logo / foto utama" value={logo} onChange={setLogo} onError={setError} maxWidth={700} aspectClass="aspect-[4/3]" hint="Diperkecil otomatis agar muat di penyimpanan browser." />
          </div>

          <div className={cn(panelClass, "space-y-4")}>
            <div>
              <label htmlFor="umkm-jenis" className={labelClass}>Kategori usaha</label>
              <input id="umkm-jenis" type="text" list="umkm-kategori" value={jenis} onChange={(e) => setJenis(e.target.value)} className={fieldClass} />
              <datalist id="umkm-kategori">
                {umkmSuggestedCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <p className={hintClass}>Pilih dari saran atau ketik kategori sendiri.</p>
            </div>

            <div>
              <label htmlFor="umkm-rt" className={labelClass}>RT</label>
              <select id="umkm-rt" value={rtId} onChange={(e) => setRtId(e.target.value)} disabled={rtOptions.length <= 1} className={fieldClass}>
                {rtOptions.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="umkm-pemilik" className={labelClass}>Nama pemilik</label>
              <input id="umkm-pemilik" type="text" value={pemilik} onChange={(e) => setPemilik(e.target.value)} className={fieldClass} />
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" checked={tampilkanPemilik} onChange={(e) => setTampilkanPemilik(e.target.checked)} className="h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500" />
                Tampilkan nama pemilik di halaman publik
              </label>
            </div>
          </div>

          <div className={panelClass}>
            <GalleryField label="Galeri foto" values={galeri} onChange={setGaleri} onError={setError} max={MAX_UMKM_GALLERY} />
          </div>

          <div className={panelClass}>
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={aktif} onChange={(e) => setAktif(e.target.checked)} className="mt-1 h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500" />
              <span>
                <span className="block text-sm font-semibold text-ink-900">Usaha aktif</span>
                <span className="block text-sm text-ink-500">Usaha nonaktif tidak tampil di direktori publik.</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => router.push("/dashboard/umkm")} disabled={busy} className={secondaryButtonClass}>
          Batal
        </button>
        <button type="button" onClick={save} disabled={busy} className={primaryButtonClass}>
          {umkm ? "Simpan Perubahan" : "Simpan UMKM"}
        </button>
      </div>
    </div>
  );
}
