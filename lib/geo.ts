import { safeExternalUrl } from "./links";

export type LocationFields = {
  alamat?: string;
  mapsUrl?: string;
  lat?: number;
  lng?: number;
};

// Shared by UMKM, organizations and map pins so a location is validated the
// same way everywhere. Throws an Error with a message meant for the form.
export function validateLocation(input: LocationFields): void {
  if (input.mapsUrl?.trim() && !safeExternalUrl(input.mapsUrl)) {
    throw new Error("Link Google Maps harus diawali http:// atau https://.");
  }
  const hasLat = input.lat !== undefined;
  const hasLng = input.lng !== undefined;
  if (hasLat !== hasLng) throw new Error("Isi latitude dan longitude bersamaan, atau kosongkan keduanya.");
  if (input.lat !== undefined && !(input.lat >= -90 && input.lat <= 90)) {
    throw new Error("Latitude harus antara -90 dan 90.");
  }
  if (input.lng !== undefined && !(input.lng >= -180 && input.lng <= 180)) {
    throw new Error("Longitude harus antara -180 dan 180.");
  }
}

export function hasCoordinates(place: { lat?: number; lng?: number }): place is { lat: number; lng: number } {
  return Number.isFinite(place.lat) && Number.isFinite(place.lng);
}
