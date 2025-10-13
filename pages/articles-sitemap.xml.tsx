import type { GetServerSideProps } from "next";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
const BASE_URL = (process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002").replace(/\/$/, "");

const fieldsByList = {
  posts: ["id", "title", "slug", "updatedAt", "includeInSitemap", "isIndexed"],
};

const formatDate = (dateString?: string) =>
  dateString ? new Date(dateString).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const query = `query {
      posts { ${fieldsByList.posts.join("\n")} }
    }`;

    const result = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then(r => r.json());

        const posts = (result.data?.posts || [])
      .filter((p: any) => p.includeInSitemap && p.isIndexed)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.updatedAt || a.publishedAt).getTime();
        const dateB = new Date(b.updatedAt || b.publishedAt).getTime();
        return dateB - dateA; // مرتب‌سازی از جدیدترین به قدیمی‌ترین
      });
    const categories = (result.data?.categories || []).filter((c: any) => c.includeInSitemap && c.isIndexed);
    const tags = (result.data?.tags || []).filter((t: any) => t.includeInSitemap && t.isIndexed);

    const urls = [
      ...posts.map((p: any) => ({ slug: `articles/${p.slug}`, lastmod: formatDate(p.updatedAt || p.publishedAt) })),
      ...categories.map((c: any) => ({ slug: `category/${c.slug}`, lastmod: formatDate(c.updatedAt) })),
      ...tags.map((t: any) => ({ slug: `tag/${t.slug}`, lastmod: formatDate(t.updatedAt) })),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
      .map(
        (u) => `  <url>
        <loc>${BASE_URL}/${u.slug}</loc>
        <lastmod>${u.lastmod}</lastmod>
      </url>`
      )
      .join("\n")}
      </urlset>`;

    res!.setHeader("Content-Type", "application/xml");
    res!.write(sitemap);
    res!.end();

    return { props: {} };
  } catch (err) {
    console.error(err);
    res!.statusCode = 500;
    res!.end();
    return { props: {} };
  }
};

export default function ArticlesSitemap() {
  return null;
}
