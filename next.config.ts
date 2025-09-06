import type { NextConfig } from "next";
import createNextGlobeGenPlugin from "next-globe-gen/plugin";

const withNextGlobeGen = createNextGlobeGenPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.morebusiness.com" },
      { protocol: "https", hostname: "pchr-legal-documents-dev.s3.amazonaws.com" },
    ],
  },
  // Ensure proper handling of redirects in production
  trailingSlash: false,
  // Enable static export for better production performance
  output: 'standalone',
  // Move serverComponentsExternalPackages to the correct location
  serverExternalPackages: [],
  // Ensure proper handling of dynamic routes
  experimental: {
    // Enable static optimization for better performance
    optimizePackageImports: ['next-globe-gen'],
  },
};

export default withNextGlobeGen(nextConfig);