import type { NextConfig } from "next";

// Gambar yang diunggah pengelola disimpan di Supabase Storage (bucket "media"),
// jadi host Supabase harus diizinkan untuk next/image.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
