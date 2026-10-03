// Helpers that turn user-entered contact details into safe outbound links.
// Anything typed into the dashboard ends up in an href on a public page, so
// only http(s) URLs are ever returned.

export function safeExternalUrl(value?: string): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  try {
    const url = new URL(v);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

const PHONE_PATTERN = /^[\d\s+()-]{8,}$/;

export function isPhoneLike(value?: string): boolean {
  return Boolean(value && PHONE_PATTERN.test(value.trim()));
}

export function whatsappUrl(phone?: string): string | undefined {
  if (!phone || !isPhoneLike(phone)) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  return digits.length >= 10 ? `https://wa.me/${digits}` : undefined;
}

export function googleMapsUrl(place: { mapsUrl?: string; lat?: number; lng?: number }): string | undefined {
  const explicit = safeExternalUrl(place.mapsUrl);
  if (explicit) return explicit;
  if (Number.isFinite(place.lat) && Number.isFinite(place.lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
  }
  return undefined;
}

// "Petunjuk arah" langsung ke tempat ini di aplikasi/situs Google Maps.
export function googleMapsDirectionsUrl(place: { lat?: number; lng?: number }): string | undefined {
  if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) return undefined;
  return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
}

// Host Google Maps yang boleh diikuti/diselesaikan oleh /api/resolve-maps.
const GOOGLE_MAPS_HOSTS = new Set([
  "maps.app.goo.gl",
  "goo.gl",
  "g.co",
  "maps.google.com",
  "google.com",
  "www.google.com",
  "consent.google.com",
]);

export function isGoogleMapsHost(hostname: string): boolean {
  return GOOGLE_MAPS_HOSTS.has(hostname.toLowerCase()) || /^(www\.)?google\.[a-z.]{2,6}$/i.test(hostname);
}

// Link pendek (maps.app.goo.gl/..., goo.gl/maps/...) tidak memuat koordinat di teksnya.
export function isShortMapsLink(value?: string): boolean {
  const safe = safeExternalUrl(value);
  if (!safe) return false;
  const u = new URL(safe);
  const host = u.hostname.toLowerCase();
  return host === "maps.app.goo.gl" || host === "g.co" || (host === "goo.gl" && u.pathname.startsWith("/maps"));
}

export function instagramUrl(value?: string): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  if (/^https?:\/\//i.test(v)) return safeExternalUrl(v);
  const handle = v.replace(/^@/, "");
  return /^[A-Za-z0-9._]+$/.test(handle) ? `https://instagram.com/${handle}` : undefined;
}

export function facebookUrl(value?: string): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  if (/^https?:\/\//i.test(v)) return safeExternalUrl(v);
  return /^[A-Za-z0-9.]+$/.test(v) ? `https://facebook.com/${v}` : undefined;
}

function inRange(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

// Pulls coordinates out of a full Google Maps URL (…/@-7.70,110.42,17z, …!3d-7.70!4d110.42, …?q=-7.70,110.42)
// or plain "lat, lng" text. Short links (maps.app.goo.gl) carry no coordinates here; the
// server route /api/resolve-maps expands them first.
export function parseCoordinatesFromUrl(value?: string): { lat: number; lng: number } | undefined {
  if (!value) return undefined;
  const num = "(-?\\d+(?:\\.\\d+)?)";
  const patterns = [
    new RegExp(`!3d${num}!4d${num}`),
    new RegExp(`@${num},${num}`),
    new RegExp(`[?&](?:q|query|ll|destination|center)=${num}(?:,|%2C)\\s*${num}`, "i"),
    new RegExp(`/maps/(?:search|place|dir)/${num},\\+?${num}`),
    // Teks koordinat polos, mis. "-7.7028, 110.4219" (yang disalin dari Google Maps).
    new RegExp(`^\\s*${num}\\s*,\\s*${num}\\s*$`),
  ];
  for (const re of patterns) {
    const m = value.match(re);
    if (m) {
      const lat = Number(m[1]);
      const lng = Number(m[2]);
      if (inRange(lat, lng)) return { lat, lng };
    }
  }
  return undefined;
}
