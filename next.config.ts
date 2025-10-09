import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  async rewrites() {
    return [
      {
        source: '/:slug-sitemap.xml',      // URL که میخوای
        destination: '/sitemap/:slug',     // مسیر فایل [slug].ts داخل pages/sitemap
      },
    ]
  },
}

export default nextConfig;
