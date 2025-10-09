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
        source: '/articles-sitemap.xml',
        destination: '/api/sitemap/articles-sitemap',
      },
      {
        source: '/products-sitemap.xml',
        destination: '/api/sitemap/products-sitemap',
      },
      {
        source: '/category-sitemap.xml',
        destination: '/api/sitemap/category-sitemap',
      },
    ];
  },
};

module.exports = nextConfig;