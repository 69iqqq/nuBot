import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore type errors during build
  },
  /* config options here */
};

export default nextConfig;
