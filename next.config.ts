import type { NextConfig } from "next";
import createNextGlobeGenPlugin from "next-globe-gen/plugin";

const withNextGlobeGen = createNextGlobeGenPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.morebusiness.com" },
    ],
  },
};

export default withNextGlobeGen(nextConfig);