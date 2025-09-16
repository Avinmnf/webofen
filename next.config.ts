import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['cdn-api.webofen.com'], // ← اینجا دامنه CDN خودت رو اضافه کن
  },
};

export default nextConfig;
