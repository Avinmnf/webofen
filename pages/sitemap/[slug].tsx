import type { GetServerSideProps } from "next";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/api/graphql";
const BASE_URL = (process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002").replace(/\/$/, "");

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const slug = params?.slug as string;
  if (!slug) return { notFound: true };

  const query = `
    query {
      posts(where: { slug: "${slug}" }) {
        id
        slug
        title
        updatedAt
        includeInSitemap
        isIndexed
      }
      categories {
        id
        slug
        title
        updatedAt
        includeInSitemap
        isIndexed
      }
      products(where: { slug: "${slug}" }) {
        id
        slug
        title
        updatedAt
        includeInSitemap
        isIndexed
      }
      productCategories {
        id
        slug
        title
        updatedAt
        includeInSitemap
        isIndexed
      }
      organizationals {
        id
        fullName
        updatedAt
        includeInSitemap
        isIndexed
      }
      personalProfiles {
        id
        fullName
        updatedAt
        includeInSitemap
        isIndexed
      }
    }
  `;

  const result = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then(r => r.json());

  const sources = [
    { items: result.data?.posts, fallbackKey: "title" },
    { items: result.data?.categories, fallbackKey: "title" },
    { items: result.data?.products, fallbackKey: "title" },
    { items: result.data?.productCategories, fallbackKey: "title" },
    { items: result.data?.organizational, fallbackKey: "fullName" },
    { items: result.data?.personalProfiles, fallbackKey: "fullName" },
  ];

  // پیدا کردن آیتمی که match کنه
  let matchedItem: any = null;
  for (const src of sources) {
    if (!Array.isArray(src.items)) continue;
    matchedItem = src.items.find(
      (i: any) => (i.slug || i[src.fallbackKey]) && i.includeInSitemap && i.isIndexed &&
                  ((i.slug && i.slug === slug) || encodeURIComponent(i[src.fallbackKey]) === slug)
    );
    if (matchedItem) {
      // اضافه کردن fallbackKey برای ساخت loc
      matchedItem._fallbackKey = src.fallbackKey;
      break;
    }
  }

  if (!matchedItem) return { notFound: true };

  const loc = matchedItem.slug
    ? `${BASE_URL}/${encodeURIComponent(matchedItem.slug)}`
    : `${BASE_URL}/${encodeURIComponent(matchedItem[matchedItem._fallbackKey])}`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${loc}</loc>
    <lastmod>${matchedItem.updatedAt || new Date().toISOString()}</lastmod>
  </url>
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function SitemapSlug() { return null; }
