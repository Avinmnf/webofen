import type { GetServerSideProps } from "next";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
const BASE_URL = ((process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002")
  .replace(/\/$/, "")
  .replace("website.", ""));

const fieldsByList = {
  posts: ["id","title","slug","updatedAt","includeInSitemap","isIndexed"],
  categories: ["id","title","slug","updatedAt","includeInSitemap","isIndexed"],
  products: ["id","title","slug","updatedAt","includeInSitemap","isIndexed"],
  tags: ["id","name","slug","updatedAt","includeInSitemap","isIndexed"],
};

// فرمت تاریخ YYYY-MM-DD
const formatDate = (dateString: string | undefined) =>
  dateString ? new Date(dateString).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const slugParam = params?.slug as string;
  if (!slugParam) return { notFound: true };

  const slug = slugParam.replace(".xml", "").replace("-sitemap", "");
  let urls: { slug: string; lastmod: string }[] = [];

  if (slug === "articles") {
    const query = `
      query {
        posts { ${fieldsByList.posts.join("\n")} }
      }
    `;
    const result = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then(r => r.json());

    const posts = (result.data?.posts || []).filter((p: any) => p.includeInSitemap && p.isIndexed);
    const categories = (result.data?.categories || []).filter((c: any) => c.includeInSitemap && c.isIndexed);
    const tags = (result.data?.tags || []).filter((t: any) => t.includeInSitemap && t.isIndexed);

    urls.push(
      ...posts.map((p: any) => ({ slug: `articles/${p.slug}`, lastmod: formatDate(p.updatedAt) })),
      ...categories.map((c: any) => ({ slug: `category/${c.slug}`, lastmod: formatDate(c.updatedAt) })),
      ...tags.map((t: any) => ({ slug: `tag/${t.slug}`, lastmod: formatDate(t.updatedAt) }))
    );

  } else if (slug === "products") {
    const query = `
      query {
        products { ${fieldsByList.products.join("\n")} }
      }
    `;
    const result = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then(r => r.json());

    const products = (result.data?.products || []).filter((p: any) => p.includeInSitemap && p.isIndexed);
    const categories = (result.data?.categories || []).filter((c: any) => c.includeInSitemap && c.isIndexed);

    urls.push(
      ...products.map((p: any) => ({ slug: `products/${p.slug}`, lastmod: formatDate(p.updatedAt) })),
      ...categories.map((c: any) => ({ slug: `category/${c.slug}`, lastmod: formatDate(c.updatedAt) }))
    );

  } else if (slug === "category") {
    const query = `
      query {
        categories { ${fieldsByList.categories.join("\n")} }
      }
    `;
    const result = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then(r => r.json());

    const categories = (result.data?.categories || []).filter((c: any) => c.includeInSitemap && c.isIndexed);
    urls.push(
      ...categories.map((c: any) => ({ slug: `category/${c.slug}`, lastmod: formatDate(c.updatedAt) }))
    );

  } else {
    return { notFound: true };
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE_URL}/${u.slug}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function SitemapSlug() { return null; }
