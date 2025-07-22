import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'races.3000tfg.com',
      },
      {
        protocol: 'https',
        hostname: 'external-content.duckduckgo.com',
      },
    ],
  },
};

export default nextConfig;
