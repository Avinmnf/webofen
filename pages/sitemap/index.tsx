'use client';
import { GetServerSideProps } from "next";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/api/graphql";
const BASE_URL = (process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002").replace(/\/$/, "");

type DataKey =
  | "pages"
  | "posts"
  | "category"
  | "products"
  | "productCategory"
  | "users"
  | "organizational"
  | "personalProfile"
  | "image"
  | "tag";

const mapKeyToList = (key: DataKey) => {
  switch (key) {
    case "pages": return "pages";
    case "posts": return "posts";
    case "category": return "categories";
    case "products": return "products";
    case "productCategory": return "productCategories";
    case "users": return "users";
    case "organizational": return "organizationals";
    case "personalProfile": return "personalProfiles";
    case "image": return "images";
    case "tag": return "tags";
    default: return "";
  }
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const ALL_KEYS: DataKey[] = [
    "pages","posts","category","products","productCategory","users",
    "organizational","personalProfile","image","tag"
  ];

  let urls: { slug: string; lastmod: string }[] = [];

  // اضافه کردن صفحات ثابت
  urls.push({
    slug: "articles",
    lastmod: new Date().toISOString(),
  });

  // اضافه کردن همه پست‌های داخل /articles
  try {
    const postsResult = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            posts {
              slug
              updatedAt
              includeInSitemap
              isIndexed
            }
          }
        `
      }),
    }).then(r => r.json());

    const posts = postsResult.data?.posts || [];
    posts.forEach((post: any) => {
      if (post.includeInSitemap && post.isIndexed) {
        urls.push({
          slug: `articles/${post.slug}`,
          lastmod: post.updatedAt || new Date().toISOString(),
        });
      }
    });
  } catch (err) {
    console.error("Error fetching posts for /articles:", err);
  }

  // حلقه روی بقیه کلیدها
  for (const key of ALL_KEYS) {
    const listKey = mapKeyToList(key);
    if (!listKey) continue;

    const fieldsByList: Record<string,string[]> = {
      posts: ["id","title","slug","updatedAt","includeInSitemap","isIndexed"],
      categories: ["id","title","slug","updatedAt","includeInSitemap","isIndexed"],
      products: ["id","title","slug","updatedAt","includeInSitemap","isIndexed"],
      productCategories: ["id","title","slug","updatedAt","includeInSitemap","isIndexed"],
      tags: ["id","name","updatedAt","includeInSitemap","isIndexed"],
      pages: ["id","title","slug","updatedAt","includeInSitemap","isIndexed"],
      users: ["id","name","updatedAt","includeInSitemap","isIndexed","role { name }"],
      organizationals: ["id","fullName","updatedAt","includeInSitemap","isIndexed"],
      personalProfiles: ["id","fullName","updatedAt","includeInSitemap","isIndexed"],
      images: ["id","slug","updatedAt","includeInSitemap","isIndexed"],
    };

    try {
      if (!fieldsByList[listKey] || !Array.isArray(fieldsByList[listKey])) continue;

      const query = `
        query {
          ${listKey} {
            ${fieldsByList[listKey].join("\n")}
          }
        }
      `;

      const result = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      }).then(r => r.json());

      let items = result.data?.[listKey] || [];
      items = items.filter((i:any) => i.includeInSitemap && i.isIndexed);

      urls.push(
        ...items.map((item: any) => ({
          slug: item.slug || item.name || item.title || item.id,
          lastmod: item.updatedAt || item.createdAt || new Date().toISOString(),
        }))
      );

    } catch (err) {
      console.error(`Error fetching ${key}:`, err);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `
  <url>
    <loc>${BASE_URL}/${u.slug}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join("")}
</urlset>`;

  res.setHeader("Content-Type","text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function SitemapIndex() { return null; }
