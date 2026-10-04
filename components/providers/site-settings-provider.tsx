"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_HERO_IMAGE, type SiteSettings, type SiteSettingsResult } from "@/lib/data/siteSettingsData";
import { safeExternalUrl } from "@/lib/links";
import { fetchSiteSettings } from "@/lib/siteSettingsService";

type SiteSettingsContextType = {
  settings: SiteSettings;
  // false = belum ada baris di database, yang tampil adalah isi bawaan.
  stored: boolean;
  // Dipakai dashboard setelah menyimpan, supaya seluruh situs langsung ikut berubah.
  apply: (next: SiteSettingsResult) => void;
};

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

// `initial` dibaca di server (layout) supaya HTML pertama sudah berisi konten
// yang benar tanpa berkedip. Setelah halaman terbuka, browser memuat versi
// terbaru dari Supabase (cache server bisa tertinggal beberapa menit).
export function SiteSettingsProvider({
  initial,
  children,
}: {
  initial: SiteSettingsResult;
  children: ReactNode;
}) {
  const [state, setState] = useState<SiteSettingsResult>(initial);

  useEffect(() => {
    let alive = true;
    fetchSiteSettings()
      .then((fresh) => {
        if (alive) setState(fresh);
      })
      .catch((e) => {
        // Tetap memakai isi dari server/bawaan; situs tidak boleh rusak karena ini.
        console.error(e);
      });
    return () => {
      alive = false;
    };
  }, []);

  const apply = useCallback((next: SiteSettingsResult) => setState(next), []);

  const value = useMemo(
    () => ({ settings: state.settings, stored: state.stored, apply }),
    [state, apply]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettingsContextType {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
}

// Satu foto latar untuk beranda dan header semua halaman, supaya keduanya
// selalu sama. Diunggah Dukuh di Dashboard > Beranda & Profil; bila belum ada,
// dipakai gambar bawaan situs.
export function useHeroImage(): string {
  const { settings } = useSiteSettings();
  return safeExternalUrl(settings.heroImage) ?? DEFAULT_HERO_IMAGE;
}
