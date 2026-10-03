"use client";

import { useMemo, useSyncExternalStore } from "react";
import { dusunOfficialStore } from "@/lib/dusunOfficialService";
import { buildMapPlaces } from "@/lib/mapPlaces";
import { pinStore } from "@/lib/mapService";
import { organizationStore } from "@/lib/organizationService";
import { umkmStore } from "@/lib/umkmService";

// Server render and hydration get the seed data; after that these follow
// localStorage and update live when a dashboard form saves.

export function useOrganizations() {
  return useSyncExternalStore(
    organizationStore.subscribe,
    organizationStore.getSnapshot,
    organizationStore.getServerSnapshot
  );
}

export function useUmkm() {
  return useSyncExternalStore(umkmStore.subscribe, umkmStore.getSnapshot, umkmStore.getServerSnapshot);
}

export function useDusunOfficials() {
  return useSyncExternalStore(
    dusunOfficialStore.subscribe,
    dusunOfficialStore.getSnapshot,
    dusunOfficialStore.getServerSnapshot
  );
}

export function usePins() {
  return useSyncExternalStore(pinStore.subscribe, pinStore.getSnapshot, pinStore.getServerSnapshot);
}

// Pins + UMKM + organizations with a location, merged into one list for the map.
export function useMapPlaces() {
  const pins = usePins();
  const umkm = useUmkm();
  const organizations = useOrganizations();
  return useMemo(() => buildMapPlaces({ pins, umkm, organizations }), [pins, umkm, organizations]);
}
