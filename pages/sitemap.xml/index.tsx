import type { GetServerSideProps } from "next";

const BASE_URL = (process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002").replace(/\/$/, "");

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // گرفتن پست‌ها از API یا GraphQL
  const posts = await fetch(`${BASE_URL}/api/posts`)
    .then((res) => res.json())
    .catch(() => []);

  // ساخت آرایه‌ی URLها با در نظر گرفتن updatedAt
  const urls = [
    { slug: "", lastmod: new Date().toISOString().split("T")[0], priority: 1.0 },
    { slug: "articles-sitemap.xml", lastmod: "2025-10-05", priority: 0.9 },
    { slug: "products-sitemap.xml", lastmod: "2025-10-07", priority: 0.9 },
    { slug: "category-sitemap.xml", lastmod: "2025-10-08", priority: 0.7 },
    { slug: "tag-sitemap.xml", lastmod: "2025-10-08", priority: 0.6 },
    { slug: "pages-sitemap.xml", lastmod: "2025-10-08", priority: 0.8 },

    // اضافه کردن پست‌ها
    ...posts.map((post: any) => {
      // انتخاب تاریخ آخرین تغییر یا انتشار
      const lastmodDate = post.updatedAt || post.publishedAt || new Date().toISOString();
      return {
        slug: `blog/${post.slug}`,
        lastmod: lastmodDate.split("T")[0],
        priority: 0.7,
      };
    }),
  ];

  // تولید XML نهایی
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      (u) => `  <url>
    <loc>${BASE_URL}${u.slug ? `/${u.slug}` : ""}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority ?? 0.5}</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
