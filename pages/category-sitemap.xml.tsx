import type { GetServerSideProps } from "next";

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
const BASE_URL = (process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002").replace(/\/$/, "");

// فیلدهای مورد نیاز برای category
const fieldsByList = {
  categories: [
    "id",
    "title",
    "slug",
    "createdAt", // اضافه شد برای مواقعی که updatedAt وجود نداره
    "updatedAt",
    "includeInSitemap",
    "isIndexed",
  ],
};

// تابع فرمت‌دهی تاریخ
const formatDate = (dateString?: string) =>
  dateString
    ? new Date(dateString).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // 📡 ساخت کوئری GraphQL
    const query = `query {
      categories {
        ${fieldsByList.categories.join("\n")}
      }
    }`;

    const result = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then((r) => r.json());

    // 🧩 فیلتر کردن فقط کتگوری‌های قابل ایندکس
    const categories = (result.data?.categories || []).filter(
      (c: any) => c.includeInSitemap && c.isIndexed
    );

    // 🕒 انتخاب تاریخ آخرین تغییر یا ساخت
    const urls = categories.map((c: any) => ({
      slug: `category/${c.slug}`,
      lastmod: formatDate(c.updatedAt || c.createdAt),
    }));

    // 🧾 ساخت sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
      .map(
        (u: any) => `  <url>
    <loc>${BASE_URL}/${u.slug}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
      )
      .join("\n")}
</urlset>`;

    // 📤 ارسال خروجی XML
    res!.setHeader("Content-Type", "application/xml");
    res!.write(sitemap);
    res!.end();

    return { props: {} };
  } catch (err) {
    console.error("❌ Category sitemap generation error:", err);
    res!.statusCode = 500;
    res!.end();
    return { props: {} };
  }
};

export default function CategoriesSitemap() {
  return null;
}
