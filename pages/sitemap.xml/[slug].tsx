import type { GetServerSideProps } from "next";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
const BASE_URL = (process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002").replace(/\/$/, "");

const fieldsByList = {
  posts: ["slug","updatedAt","includeInSitemap","isIndexed"]
};

const formatDate = (dateString: string | undefined) =>
  dateString ? new Date(dateString).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const slugParam = params?.slug as string;
  if (!slugParam) return { notFound: true };

  const slug = slugParam.replace(".xml", "").replace("-sitemap", "");

  let urls: { slug: string; lastmod: string }[] = [];

  if(slug === "articles") {
    const query = `query { posts { ${fieldsByList.posts.join("\n")} } }`;
    const result = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then(r => r.json());

    const posts = (result.data?.posts || []).filter((p:any) => p.includeInSitemap && p.isIndexed);

    urls.push(...posts.map((p:any) => ({
      slug: `articles/${p.slug}`,
      lastmod: formatDate(p.updatedAt)
    })));
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
