import type { GetServerSideProps } from "next";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
const BASE_URL = (process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002").replace(/\/$/, "");

const fieldsByList = {
  posts: ["id", "slug", "includeInSitemap", "isIndexed", "tags { id slug includeInSitemap isIndexed }"],
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

    const posts = (result.data?.posts || []).filter((p: any) => p.includeInSitemap && p.isIndexed);

    // جمع کردن تمام تگ‌هایی که به پست‌ها تعلق دارند
    const tagMap: Record<string, any> = {};
    posts.forEach((p: any) => {
      (p.tags || []).forEach((t: any) => {
        if (t.includeInSitemap && t.isIndexed) {
          tagMap[t.id] = t;
        }
      });
    });

    const tags = Object.values(tagMap);

    const urls = tags.map((t: any) => ({ slug: `tag/${t.slug}`, lastmod: formatDate(new Date().toISOString()) }));

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

export default function TagsSitemap() {
  return null;
}
