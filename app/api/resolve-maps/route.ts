import { NextResponse, type NextRequest } from "next/server";
import { isGoogleMapsHost, parseCoordinatesFromUrl, safeExternalUrl } from "@/lib/links";

// Mengurai link pendek Google Maps (maps.app.goo.gl/...) menjadi koordinat.
// Browser tidak bisa mengikuti redirect lintas-domain (CORS), jadi ini dikerjakan di server.
//
// Keamanan (SSRF): hanya https, hanya host Google Maps, tiap lompatan redirect
// diperiksa ulang, dan jumlah lompatan serta waktu tunggu dibatasi.

const MAX_HOPS = 6;
const TIMEOUT_MS = 6000;

function allowed(raw: string): URL | undefined {
  const safe = safeExternalUrl(raw);
  if (!safe) return undefined;
  const url = new URL(safe);
  return url.protocol === "https:" && isGoogleMapsHost(url.hostname) ? url : undefined;
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("url") ?? "";
  let current = allowed(input);
  if (!current) {
    return NextResponse.json({ error: "Link harus berupa link Google Maps (https)." }, { status: 400 });
  }

  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    const found = parseCoordinatesFromUrl(current.toString());
    if (found) return NextResponse.json({ ...found, url: current.toString() });

    // Halaman persetujuan cookie Google membungkus tujuan aslinya di ?continue=.
    if (current.hostname === "consent.google.com") {
      const next = allowed(current.searchParams.get("continue") ?? "");
      if (!next) break;
      current = next;
      continue;
    }

    let res: Response;
    try {
      res = await fetch(current.toString(), {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "user-agent": "Mozilla/5.0 (compatible; CilikanBot/1.0)", accept: "text/html" },
        cache: "no-store",
      });
    } catch {
      return NextResponse.json({ error: "Link tidak bisa dibuka. Coba lagi atau klik lokasi di peta." }, { status: 502 });
    }

    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      const next = allowed(new URL(location, current).toString());
      if (!next) break;
      current = next;
      continue;
    }
    break;
  }

  return NextResponse.json(
    { error: "Koordinat tidak ditemukan pada link ini. Klik lokasi langsung di peta." },
    { status: 422 }
  );
}
