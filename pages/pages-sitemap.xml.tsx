import type { GetServerSideProps } from "next";

const BASE_URL = (process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002").replace(/\/$/, "");

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const urls = [
      { slug: "", lastmod: "2025-10-08" },          // صفحه اصلی
      { slug: "about-us", lastmod: "2025-10-07" },  // درباره ما
      { slug: "articles-sitemap.xml", lastmod: "2025-10-08" }, // لینک به sitemap articles
      { slug: "products-sitemap.xml", lastmod: "2025-10-08" }, // لینک به sitemap products
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

export default function PagesSitemap() {
  return null;
}
