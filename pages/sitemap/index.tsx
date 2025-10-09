import type { GetServerSideProps } from "next";

const BASE_URL = (
  process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002"
)
  .replace(/\/$/, "")
  .replace("website.", "");

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // 🔹 فقط URLهای مورد نظر
  const urls = [
    { slug: "", lastmod: "2025-10-08" }, // صفحه اصلی
    { slug: "articles/", lastmod: "2025-10-05" },
    { slug: "products/", lastmod: "2025-10-07" },
    { slug: "category/", lastmod: "2025-10-08" },
  ];

  // 🧩 ساخت XML
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

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
