import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.webofen.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cdn-api.webofen.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
