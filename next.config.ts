import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No inbound remote images (uploads are stored as data URLs, see
  // MediaImage), so there is nothing to add to images.remotePatterns yet.
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
