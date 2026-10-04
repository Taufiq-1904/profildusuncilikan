"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Notice } from "@/components/dashboard/notice";
import {
  errorClass,
  fieldClass,
  hintClass,
  labelClass,
  panelClass,
  primaryButtonClass,
} from "@/components/dashboard/form-styles";
import { GalleryField, ImageField } from "@/components/dashboard/image-field";
import { TextListField, TimelineField } from "@/components/dashboard/list-fields";
import { LocationPicker, type PickedLocation } from "@/components/dashboard/location-picker";
import { useAuth } from "@/components/providers/auth-provider";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { isDusun } from "@/lib/auth";
import {
  MAX_ABOUT_PHOTOS,
  MAX_LIST_ITEMS,
  MAX_TIMELINE_ENTRIES,
  type SiteSettings,
} from "@/lib/data/siteSettingsData";
import { fetchSiteSettings, saveSiteSettings } from "@/lib/siteSettingsService";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "beranda", label: "Beranda" },
  { key: "profil", label: "Sejarah & Visi Misi" },
  { key: "geografis", label: "Geografis" },
  { key: "kontak", label: "Kontak" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const successClass = "rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800";

function TextField({
  id,
  label,
  value,
  onChange,
  hint,
  placeholder,
  maxLength,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  maxLength?: number;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  );
}

function AreaField({
  id,
  label,
  value,
  onChange,
  hint,
  rows = 4,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      />
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  );
}

function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const { apply } = useSiteSettings();
  const [saved, setSaved] = useState(initial);
  const [form, setForm] = useState(initial);
  const [tab, setTab] = useState<TabKey>("beranda");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSuccess("");
    setForm((f) => ({ ...f, [key]: value }));
  };

  function pickLocation(patch: Partial<PickedLocation>) {
    setSuccess("");
    setForm((f) => {
      const next = { ...f };
      if ("mapsUrl" in patch) next.mapsUrl = patch.mapsUrl ?? "";
      if ("lat" in patch) next.lat = patch.lat;
      if ("lng" in patch) next.lng = patch.lng;
      return next;
    });
  }

  async function save() {
    if (busy) return;
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const result = await saveSiteSettings(form, saved);
      setSaved(result.settings);
      setForm(result.settings);
      // Seluruh situs (beranda, profil, footer, kontak) langsung memakai nilai baru.
      apply(result);
      setSuccess("Tersimpan. Perubahan sudah tampil di situs.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Pengaturan gagal disimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-ink-500">Dashboard</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Beranda &amp; Profil</h1>
          <p className="mt-1 max-w-xl text-sm text-ink-500">
            Teks, foto, profil, dan kontak dusun. Hanya akun Dusun yang bisa mengubahnya. Kolom yang dikosongkan
            tidak ditampilkan di situs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-cream-100"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Lihat situs
          </Link>
          <button type="button" onClick={save} disabled={busy} className={primaryButtonClass}>
            {busy ? "Menyimpan..." : "Simpan semua"}
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Bagian konten">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls={`panel-${t.key}`}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              tab === t.key
                ? "bg-brand-700 text-white shadow-sm"
                : "border border-line bg-paper text-ink-600 hover:bg-brand-50 hover:text-brand-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className={cn(errorClass, "mb-4")}>{error}</p>}
      {success && <p role="status" className={cn(successClass, "mb-4")}>{success}</p>}

      {tab === "beranda" && (
        <div role="tabpanel" id="panel-beranda" aria-labelledby="tab-beranda" className="space-y-6">
          <section className={cn(panelClass, "space-y-5")}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Bagian atas (hero)</h2>
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <TextField id="tagline" label="Tagline" value={form.tagline} maxLength={100} onChange={(v) => set("tagline", v)} />
                <AreaField
                  id="short-desc"
                  label="Deskripsi singkat"
                  rows={3}
                  maxLength={300}
                  value={form.shortDescription}
                  onChange={(v) => set("shortDescription", v)}
                  hint="Tampil di beranda, footer, dan hasil pencarian Google."
                />
              </div>
              <ImageField
                label="Foto latar beranda"
                value={form.heroImage || undefined}
                onChange={(v) => set("heroImage", v ?? "")}
                onError={setError}
                folder="situs"
                maxWidth={1920}
                aspectClass="aspect-video"
                hint="Foto lanskap (mendatar) paling bagus. Kosong = gambar bawaan situs."
              />
            </div>
          </section>

          <section className={cn(panelClass, "space-y-5")}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Sambutan Dukuh</h2>
            <AreaField
              id="welcome"
              label="Isi sambutan"
              rows={6}
              maxLength={1500}
              value={form.welcomeMessage}
              onChange={(v) => set("welcomeMessage", v)}
              hint="Nama, jabatan, periode, dan foto Dukuh diambil dari Dashboard > Struktur (baris yang ditandai “Ini Dukuh”). Kosongkan untuk menyembunyikan bagian ini."
            />
          </section>

          <section className={cn(panelClass, "space-y-5")}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Tentang Dusun</h2>
            <TextField
              id="location-note"
              label="Keterangan lokasi"
              value={form.locationNote}
              onChange={(v) => set("locationNote", v)}
              hint="Contoh: Kalurahan Umbulmartani, Kapanewon Ngemplak, Sleman."
            />
            <TextListField
              idPrefix="excellence"
              label="Keunggulan dusun"
              noun="keunggulan"
              values={form.excellence}
              onChange={(v) => set("excellence", v)}
              max={MAX_LIST_ITEMS}
            />
            <GalleryField
              label="Foto bagian Tentang Dusun"
              values={form.aboutPhotos}
              onChange={(v) => set("aboutPhotos", v)}
              onError={setError}
              max={MAX_ABOUT_PHOTOS}
              folder="situs"
              maxWidth={1200}
            />
            <p className={hintClass}>Foto pertama tampil besar (tegak), dua lainnya kecil. Slot yang kosong menampilkan ikon.</p>
          </section>
        </div>
      )}

      {tab === "profil" && (
        <div role="tabpanel" id="panel-profil" aria-labelledby="tab-profil" className="space-y-6">
          <section className={cn(panelClass, "space-y-5")}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Sejarah</h2>
            <AreaField
              id="history-summary"
              label="Ringkasan sejarah"
              rows={5}
              value={form.historySummary}
              onChange={(v) => set("historySummary", v)}
              hint="Tampil di beranda dan di halaman Profil."
            />
            <TimelineField
              idPrefix="timeline"
              values={form.timeline}
              onChange={(v) => set("timeline", v)}
              max={MAX_TIMELINE_ENTRIES}
            />
          </section>

          <section className={cn(panelClass, "space-y-5")}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Visi &amp; Misi</h2>
            <AreaField id="vision" label="Visi" rows={3} value={form.vision} onChange={(v) => set("vision", v)} />
            <TextListField
              idPrefix="missions"
              label="Misi"
              noun="misi"
              values={form.missions}
              onChange={(v) => set("missions", v)}
              max={MAX_LIST_ITEMS}
            />
          </section>
        </div>
      )}

      {tab === "geografis" && (
        <div role="tabpanel" id="panel-geografis" aria-labelledby="tab-geografis" className="space-y-6">
          <section className={cn(panelClass, "space-y-5")}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Kondisi geografis</h2>
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Luas, ketinggian, iklim, dan batas yang sudah terisi berasal dari data resmi tingkat{" "}
              <strong>Kalurahan Umbulmartani</strong> (Peraturan Bupati Sleman No. 86 Tahun 2025 dan website
              kalurahan), bukan khusus Dusun Cilikan. Mohon ganti dengan angka dusun bila ada, atau biarkan
              keterangan “seluruh kalurahan”.
            </p>
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField id="geo-area" label="Luas wilayah" value={form.geoArea} onChange={(v) => set("geoArea", v)} />
              <TextField id="geo-alt" label="Ketinggian" value={form.geoAltitude} onChange={(v) => set("geoAltitude", v)} />
              <TextField id="geo-climate" label="Iklim" value={form.geoClimate} onChange={(v) => set("geoClimate", v)} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="geo-north" label="Batas utara" value={form.geoNorth} onChange={(v) => set("geoNorth", v)} placeholder="Padukuhan …" />
              <TextField id="geo-south" label="Batas selatan" value={form.geoSouth} onChange={(v) => set("geoSouth", v)} />
              <TextField id="geo-east" label="Batas timur" value={form.geoEast} onChange={(v) => set("geoEast", v)} />
              <TextField id="geo-west" label="Batas barat" value={form.geoWest} onChange={(v) => set("geoWest", v)} />
            </div>
            <p className={hintClass}>Batas dusun belum ada sumber publik, jadi dibiarkan kosong. Isi dengan nama padukuhan tetangga.</p>
            <AreaField
              id="geo-topography"
              label="Uraian wilayah"
              rows={8}
              value={form.geoTopography}
              onChange={(v) => set("geoTopography", v)}
            />
          </section>
        </div>
      )}

      {tab === "kontak" && (
        <div role="tabpanel" id="panel-kontak" aria-labelledby="tab-kontak" className="space-y-6">
          <section className={cn(panelClass, "space-y-5")}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Kontak dusun</h2>
            <p className={hintClass}>Kartu kontak yang dikosongkan tidak tampil di halaman Kontak maupun footer.</p>
            <AreaField id="address" label="Alamat" rows={2} value={form.address} onChange={(v) => set("address", v)} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="phone" label="Telepon" type="tel" value={form.phone} onChange={(v) => set("phone", v)} placeholder="0274 123456" />
              <TextField id="whatsapp" label="WhatsApp" type="tel" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} placeholder="0812 3456 7890" />
              <TextField id="email" label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} />
              <TextField id="service-hours" label="Jam pelayanan" value={form.serviceHours} onChange={(v) => set("serviceHours", v)} />
            </div>
          </section>

          <section className={cn(panelClass, "space-y-5")}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Lokasi di peta</h2>
            <p className={hintClass}>
              Dipakai tombol “Buka di Google Maps” dan data lokasi untuk mesin pencari. Klik titik di peta atau tempel
              link Google Maps.
            </p>
            <LocationPicker
              idPrefix="site-location"
              value={{ lat: form.lat, lng: form.lng, mapsUrl: form.mapsUrl }}
              onChange={pickLocation}
              clearable
            />
          </section>

          <section className={cn(panelClass, "space-y-5")}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Media sosial</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField id="instagram" label="Instagram" value={form.instagram} onChange={(v) => set("instagram", v)} placeholder="@akundusun" />
              <TextField id="facebook" label="Facebook" value={form.facebook} onChange={(v) => set("facebook", v)} placeholder="namahalaman" />
              <TextField id="youtube" label="YouTube" value={form.youtube} onChange={(v) => set("youtube", v)} placeholder="https://youtube.com/@…" />
            </div>
          </section>

          <section className={cn(panelClass, "space-y-5")}>
            <h2 className="font-display text-lg font-semibold text-ink-900">Kantor Kalurahan Umbulmartani</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="kal-address" label="Alamat kalurahan" value={form.kalurahanAddress} onChange={(v) => set("kalurahanAddress", v)} />
              <TextField id="kal-phone" label="Telepon kalurahan" type="tel" value={form.kalurahanPhone} onChange={(v) => set("kalurahanPhone", v)} />
            </div>
            <p className={hintClass}>Terisi dari website resmi kalurahan. Periksa kembali sebelum dipublikasikan.</p>
          </section>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        <button type="button" onClick={save} disabled={busy} className={primaryButtonClass}>
          {busy ? "Menyimpan..." : "Simpan semua"}
        </button>
        <p className={hintClass}>Semua tab disimpan sekaligus.</p>
      </div>
    </div>
  );
}

export default function DashboardBerandaPage() {
  const { user } = useAuth();
  const [initial, setInitial] = useState<SiteSettings | null>(null);
  const [loadError, setLoadError] = useState("");
  const allowed = isDusun(user);

  // Form diisi dari data terbaru di database (bukan cache server) supaya
  // menyimpan tidak menimpa perubahan yang baru dibuat.
  useEffect(() => {
    if (!allowed) return;
    let alive = true;
    fetchSiteSettings()
      .then((r) => {
        if (alive) setInitial(r.settings);
      })
      .catch((e) => {
        if (alive) setLoadError(e instanceof Error ? e.message : "Pengaturan situs gagal dimuat.");
      });
    return () => {
      alive = false;
    };
  }, [allowed]);

  if (!allowed) {
    return (
      <Notice
        message="Hanya akun Dusun yang dapat mengubah konten beranda, profil, dan kontak."
        backHref="/dashboard"
        backLabel="Kembali ke ringkasan"
      />
    );
  }
  if (loadError) {
    return <Notice message={loadError} backHref="/dashboard" backLabel="Kembali ke ringkasan" />;
  }
  if (!initial) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }
  return <SettingsEditor initial={initial} />;
}
