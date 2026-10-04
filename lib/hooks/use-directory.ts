"use client";

import { useMemo, useSyncExternalStore } from "react";

import { findByPosition, findWilayahHead } from "@/lib/data/dusunOfficialsData";
import type { RemoteStore } from "@/lib/remoteStore";
import { demografiStore } from "@/lib/demografiService";
import { dusunOfficialStore } from "@/lib/dusunOfficialService";
import { galleryStore } from "@/lib/galleryService";
import { buildMapPlaces } from "@/lib/mapPlaces";
import { pinStore } from "@/lib/mapService";
import { organizationStore } from "@/lib/organizationService";
import { potensiStore } from "@/lib/potensiService";
import { umkmStore } from "@/lib/umkmService";

function useStore<T>(store: RemoteStore<T>) {
  return useSyncExternalStore(store.subscribe, store.getState, store.getServerState);
}

export function useOrganizations() {
  return useStore(organizationStore).items;
}
export function useOrganizationsReady() {
  return useStore(organizationStore).ready;
}

export function useUmkm() {
  return useStore(umkmStore).items;
}
export function useUmkmReady() {
  return useStore(umkmStore).ready;
}

export function useDusunOfficials() {
  return useStore(dusunOfficialStore).items;
}

export function useDusunOfficialsReady() {
  return useStore(dusunOfficialStore).ready;
}

// Kepala wilayah (dukuh / ketua RW / ketua RT) dibaca dari struktur dusun,
// jadi mengganti nama/periode di Dashboard > Struktur langsung berlaku di
// seluruh situs. `headOf("dusun" | "rw09" | "rt01")` mengembalikan orangnya
// (atau undefined bila belum ditandai).
export function useWilayahHeads() {
  const state = useStore(dusunOfficialStore);
  return useMemo(
    () => ({
      ready: state.ready,
      headOf: (wilayahId: string) => findWilayahHead(state.items, wilayahId),
      // Pengurus lain di struktur wilayah itu, mis. roleOf("rt01", "sekretaris").
      roleOf: (wilayahId: string, keyword: string) => findByPosition(state.items, wilayahId, keyword),
    }),
    [state.items, state.ready]
  );
}

export function useGallery() {
  return useStore(galleryStore).items;
}
export function useGalleryReady() {
  return useStore(galleryStore).ready;
}

export function useDemografi() {
  return useStore(demografiStore).items;
}
export function useDemografiReady() {
  return useStore(demografiStore).ready;
}

export function usePotensi() {
  return useStore(potensiStore).items;
}
export function usePotensiReady() {
  return useStore(potensiStore).ready;
}

// Pin peta dari Supabase.
export function usePins() {
  const state = useStore(pinStore);
  return {
    pins: state.items,
    loading: !state.ready,
    refresh: pinStore.refresh,
  };
}

// Pins + UMKM + organizations dengan lokasi, digabung menjadi satu daftar untuk peta.
export function useMapPlaces() {
  const { pins, loading, refresh } = usePins();
  const umkm = useUmkm();
  const organizations = useOrganizations();

  const places = useMemo(
    () => buildMapPlaces({ pins, umkm, organizations }),
    [pins, umkm, organizations]
  );

  return { places, pins, loading, refresh };
}
