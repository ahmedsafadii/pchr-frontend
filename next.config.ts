import type { NextConfig } from "next";
import createNextGlobeGenPlugin from "next-globe-gen/plugin";

const withNextGlobeGen = createNextGlobeGenPlugin();

// Environment-specific configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.morebusiness.com" },
      { protocol: "https", hostname: "pchr-legal-documents-dev.s3.amazonaws.com" },
      // Add production S3 bucket if different
      ...(isProduction ? [
        { protocol: "https", hostname: "pchr-legal-documents.s3.amazonaws.com" },
      ] : []),
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
    // Reduce font preloading
    optimizeCss: true,
  },
  // Add production optimizations
  compress: isProduction,
  poweredByHeader: false,
  // Ensure proper error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Environment-specific optimizations
  ...(isProduction && {
    // Production-only optimizations
    swcMinify: true,
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: false,
    },
    typescript: {
      ignoreBuildErrors: false,
    },
  }),
  ...(isDevelopment && {
    // Development-only settings
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  }),
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          ...(isProduction ? [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains',
            },
          ] : []),
        ],
      },
    ];
  },
};

export default withNextGlobeGen(nextConfig);