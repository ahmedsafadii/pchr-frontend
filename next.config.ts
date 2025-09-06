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
  // Use server mode for better PM2 compatibility
  // output: 'standalone', // Commented out to use default server mode
  // Move serverComponentsExternalPackages to the correct location
  serverExternalPackages: [],
  // Ensure proper handling of dynamic routes
  experimental: {
    // Enable static optimization for better performance
    optimizePackageImports: ['next-globe-gen'],
  },
  // Add production optimizations
  compress: true,
  poweredByHeader: false,
  // Ensure proper error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default withNextGlobeGen(nextConfig);