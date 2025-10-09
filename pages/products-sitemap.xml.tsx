import type { GetServerSideProps } from "next";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
const BASE_URL = (process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002").replace(/\/$/, "");

const fieldsByList = {
  products: ["id", "title", "slug", "updatedAt", "includeInSitemap", "isIndexed"],
};

const formatDate = (dateString?: string) =>
  dateString ? new Date(dateString).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const query = `query {
      products { ${fieldsByList.products.join("\n")} }
    }`;

    const result = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then(r => r.json());

    const products = (result.data?.products || []).filter((p: any) => p.includeInSitemap && p.isIndexed);
    const categories = (result.data?.categories || []).filter((c: any) => c.includeInSitemap && c.isIndexed);

    const urls = [
      ...products.map((p: any) => ({ slug: `products/${p.slug}`, lastmod: formatDate(p.updatedAt) })),
      ...categories.map((c: any) => ({ slug: `category/${c.slug}`, lastmod: formatDate(c.updatedAt) })),
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

export default function ProductsSitemap() {
  return null;
}
