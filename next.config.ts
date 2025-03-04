import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["resonancestorage.sfo2.digitaloceanspaces.com"], // ✅ Allow DigitalOcean Spaces
  },
  /* config options here */
};

export default nextConfig;
