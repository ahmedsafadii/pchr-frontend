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
  // Enable experimental features for better i18n support
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default withNextGlobeGen(nextConfig);