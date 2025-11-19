"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SimpleProduct {
  id: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  slug?: string;
}

interface ProductRecommendationsProps {
  scores: Record<string, number>;
  sitemapData?: {
    totalLinks: number;
    sitemapExists: boolean;
    sitemapUrls: string[];
    sitemapLinks: Array<{ url: string; sitemap: string }>;
  };
  isDuplicate?: boolean;
}

export const ProductRecommendations = ({ 
  scores, 
  sitemapData, 
  isDuplicate = false 
}: ProductRecommendationsProps) => {
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [allMainAbove90, setAllMainAbove90] = useState(false);
  const [needsContentProduction, setNeedsContentProduction] = useState(false);

  const mockProducts: SimpleProduct[] = [
    {
      id: "1",
      title: "قرص بهینه‌سازی",
      description: "بهینه‌سازی کامل سئو، عملکرد، دسترسی‌پذیری و بهترین شیوه‌ها برای بهبود کلی وبسایت",
      imageUrl: "optimization.mp4",
      slug: "optimization",
    },
    {
      id: "2",
      title: "ابزار Screaming Frog",
      description: "تحلیل فنی سئو و بررسی کامل ساختار سایت برای شناسایی مشکلات فنی سئو",
      imageUrl: "screamingfrog.mp4",
      slug: "screaming-frog",
    },
    {
      id: "3",
      title: "قرص تولید محتوا",
      description: "تولید محتوای سئو شده و با کیفیت برای افزایش صفحات سایت و بهبود رتبه در گوگل",
      imageUrl: "content.mp4",
      slug: "content",
    },
    {
      id: "4",
      title: "قرص کلاسترینگ محتوا",
      description: "قبل از انجام تولید محتوای جدید، برای دریافت موضوعات و ساختار مناسب، قرص کلاسترینگ را خریداری نمایید",
      imageUrl: "keywordcluster.mp4",
      slug: "keyword-cluster",
    },
  ];

  useEffect(() => {
    console.log("🔄 ProductRecommendations useEffect running...", {
      isDuplicate,
      hasSitemapData: !!sitemapData,
      totalLinks: sitemapData?.totalLinks,
      sitemapExists: sitemapData?.sitemapExists,
      scores
    });

    const mappedScores = {
      performance: scores["performance"] ?? scores["عملکرد"],
      accessibility: scores["accessibility"] ?? scores["دسترس‌پذیری"],
      bestPractices: scores["bestPractices"] ?? scores["بهترین شیوه‌ها"],
      seo: scores["seo"] ?? scores["سئو"],
    };

    const { performance, accessibility, bestPractices, seo } = mappedScores;
    const allAbove90 =
      Number(performance || 0) >= 0.9 &&
      Number(accessibility || 0) >= 0.9 &&
      Number(bestPractices || 0) >= 0.9 &&
      Number(seo || 0) >= 0.9;

    setAllMainAbove90(allAbove90);

    // 🔥 منطق بهبود یافته برای سایت‌مپ
    const hasValidSitemap = sitemapData && sitemapData.sitemapExists;
    const totalLinks = sitemapData?.totalLinks || 0;
    const hasLowLinks = totalLinks > 0 && totalLinks < 200;
    
    // 🔥 تغییر مهم: برای آنالیز تکراری، اگر سایت‌مپ وجود دارد و لینک‌ها کم هستند، محصولات سایت‌مپ را نمایش بده
    const shouldSuggestContent = hasValidSitemap && hasLowLinks;

    console.log("📊 Sitemap analysis:", {
      hasValidSitemap,
      totalLinks,
      hasLowLinks,
      isDuplicate,
      shouldSuggestContent
    });

    setNeedsContentProduction(!!shouldSuggestContent);

    const recommended: SimpleProduct[] = [];

    // 1. محصولات بر اساس امتیازات (همیشه)
    console.log("🎯 Adding score-based products...");
    
    if ((performance || 0) < 0.9) {
      recommended.push(mockProducts[0]);
      console.log("➕ Added optimization pill (low performance)");
    }

    const hasLowScore = Object.values(mappedScores).some((s) => Number(s || 0) < 0.8);
    if (hasLowScore && !recommended.some(p => p.id === "1")) {
      recommended.push(mockProducts[0]);
      console.log("➕ Added optimization pill (very low scores)");
    }

    if ((seo || 0) < 0.9) {
      recommended.push(mockProducts[1]);
      console.log("➕ Added Screaming Frog (low SEO)");
    }

    // 2. 🔥 محصولات سایت‌مپ - فقط اگر شرایط اصلی برقرار باشد
    console.log("📝 Checking sitemap-based products...", {
      shouldSuggestContent,
      hasValidSitemap,
      totalLinks,
      hasLowLinks,
      isDuplicate
    });

    if (shouldSuggestContent) {
      console.log("✅ Adding sitemap-based products (low link count)");
      
      // قرص تولید محتوا
      if (!recommended.some(p => p.id === "3")) {
        recommended.push(mockProducts[2]);
        console.log("➕ Added content production pill");
      }

      // قرص کلاسترینگ
      if (!recommended.some(p => p.id === "4")) {
        recommended.push(mockProducts[3]);
        console.log("➕ Added content clustering pill");
      }
    } else {
      console.log("❌ Not adding sitemap products - conditions not met:", {
        hasValidSitemap,
        totalLinks,
        hasLowLinks,
        isDuplicate
      });
    }

    // 3. حالت خاص: همه امتیازها بالا اما نیاز به محتوا داریم
    if (allAbove90 && shouldSuggestContent) {
      console.log("🎯 All scores high - keeping only content products");
      const contentProducts = recommended.filter(p => p.id === "3" || p.id === "4");
      setProducts(contentProducts);
      setLoading(false);
      return;
    }

    // حذف duplicates
    const uniqueProducts = recommended.filter(
      (p, i, self) => i === self.findIndex((x) => x.id === p.id)
    );

    console.log("🎯 FINAL products:", uniqueProducts.map(p => `${p.title} (${p.id})`));
    setProducts(uniqueProducts);
    setLoading(false);
  }, [scores, sitemapData, isDuplicate]);

  if (loading) return <div className="text-center py-4">در حال بررسی محصولات پیشنهادی...</div>;

  // ✅ اگر هیچ محصولی نیست و امتیازها همگی بالای ۹۰ هستن و نیازی به تولید محتوا نیست
  if (products.length === 0 && allMainAbove90 && !needsContentProduction) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-100 text-center">
        <h2 className="font-bold text-2xl text-green-700 mb-2">وضعیت وبسایت شما عالی است 🎉</h2>
        <p className="text-gray-700">
          تمام بخش‌های اصلی وبسایت شما (عملکرد، سئو، بهترین شیوه‌ها، دسترسی‌پذیری) امتیاز بالای ۹۰ دارند.
          <br />
          {sitemapData && sitemapData.totalLinks >= 200 && (
            <span className="text-green-600 font-medium mt-2 inline-block">
              ✅ تعداد لینک‌های سایت‌مپ شما ({sitemapData.totalLinks}) نیز مناسب است.
            </span>
          )}
        </p>
      </div>
    );
  }



  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl text-gray-800">محصولات پیشنهادی برای بهبود وبسایت</h2>
        <div className="flex items-center space-x-2 space-x-reverse bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          <span>
            {isDuplicate 
              ? "بر اساس تحلیل امتیازها و سایت‌مپ موجود" 
              : "بر اساس تحلیل امتیازها و سایت‌مپ"
            }
          </span>
        </div>
      </div>

      {/* پیام ویژه برای لینک‌های تکراری */}
      {isDuplicate && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 text-yellow-600 mt-0.5">🔄</div>
            <div className="mr-3">
              <h4 className="font-bold text-yellow-800 text-sm mb-1">تحلیل مجدد با لینک تکراری</h4>
              <p className="text-yellow-700 text-sm">
                از آنجایی که این لینک قبلاً تحلیل شده، از داده‌های موجود استفاده می‌شود.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 نمایش اطلاعات سایت‌مپ در بالای لیست محصولات */}
      {sitemapData && sitemapData.sitemapExists && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-blue-800 text-sm mb-1">وضعیت سایت‌مپ</h4>
              <p className="text-blue-700 text-sm">
                سایت‌مپ: ✅ موجود | 
                تعداد لینک‌ها: <strong>{sitemapData.totalLinks}</strong>
                {sitemapData.totalLinks < 200 && (
                  <span className="mr-3 text-orange-600 font-medium">(نیاز به بهبود)</span>
                )}
              </p>
            </div>
            {sitemapData.totalLinks < 200 && (
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                نیاز به تولید محتوا
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-green-200 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="flex flex-col h-full">
              {product.imageUrl && (
                <video
                  src={
                    product.id === "1" ? "/guidance/optimization.mp4" :
                    product.id === "2" ? "/guidance/screamingfrog.mp4" :
                    product.id === "3" ? "/guidance/content.mp4" :
                    "/guidance/keywordcluster.mp4"
                  }
                  className="object-cover rounded-lg mb-4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}

              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.description}</p>
                
                {/* نمایش اطلاعات سایت‌مپ فقط برای محصول تولید محتوا */}
                {product.id === "3" && sitemapData && sitemapData.totalLinks < 200 && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700 font-medium">لینک‌ های فعلی:</span>
                      <span className="text-blue-800 font-bold">{sitemapData.totalLinks}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-blue-700 font-medium">هدف پیشنهادی:</span>
                      <span className="text-blue-600 font-bold">200+ لینک</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {getProductReasons(product.id, scores, sitemapData, isDuplicate).map((reason, index) => (
                    <span 
                      key={index}
                      className="inline-block text-xs px-2 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-blue-800">
                  {product.id === "3" ? "راه‌ حل افزایش محتوا" : 
                   product.id === "4" ? "اولویت قبل از تولید محتوا" : "راه‌ حل تخصصی"}
                </div>
                <Link 
                  href={`/products/${product.slug}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center group/btn bg-blue-700 hover:bg-blue-800 text-white"
                >
                  <span>خرید محصول</span>
                  <svg className="w-4 h-4 mr-1 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* پیام ویژه برای تولید محتوا */}
      {needsContentProduction && sitemapData && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 text-orange-600 mt-0.5">📈</div>
            <div className="mr-3">
              <h4 className="font-bold text-blue-800 text-sm mb-1">نیاز به تولید محتوای بیشتر و ساختاردهی</h4>
              <p className="text-blue-700 text-sm">
                تعداد لینک‌ های سایت‌ مپ شما ({sitemapData.totalLinks}) کمتر از ۲۰۰ است. 
                برای بهبود رتبه سئو و افزایش visibility در موتور های جستجو، 
                تولید محتوای بیشتر و ساختاردهی مناسب محتواها (کلاسترینگ) ضروری است.
                <strong className="block mt-1">توصیه: ابتدا قرص کلاسترینگ را خریداری کنید سپس تولید محتوا را آغاز نمایید.</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 🎯 دلایل پیشنهاد محصول
function getProductReasons(
  productId: string, 
  scores: Record<string, number>, 
  sitemapData?: ProductRecommendationsProps['sitemapData'],
  isDuplicate?: boolean
): string[] {
  const reasons: string[] = [];

  const seo = scores["seo"] ?? scores["سئو"]; 
  const performance = scores["performance"] ?? scores["عملکرد"];
  const accessibility = scores["accessibility"] ?? scores["دسترس‌پذیری"];
  const bestPractices = scores["bestPractices"] ?? scores["بهترین شیوه‌ها"];

  switch (productId) {
    case "1":
      if ([seo, performance, accessibility, bestPractices].some((s) => (s || 0) < 0.8)) {
        reasons.push("امتیازهای پایین در چند بخش");
      }
      if ((performance || 0) < 0.9) {
        reasons.push("عملکرد نیاز به بهبود دارد");
      }
      break;
    
    case "2":
      if ((seo || 0) < 0.9) {
        reasons.push("سئو نیاز به بهبود دارد");
      }
      break;
    
    case "3":
      if (sitemapData && sitemapData.totalLinks < 200) {
        reasons.push(`فقط ${sitemapData.totalLinks} لینک در سایت‌مپ`);
        reasons.push("نیاز به تولید محتوای بیشتر");
      }
      if ((seo || 0) < 0.9) {
        reasons.push("بهبود سئو با محتوای بیشتر");
      }
      break;
    
    case "4":
      reasons.push("اولویت قبل از تولید محتوا");
      reasons.push("دریافت موضوعات مناسب");
      reasons.push("تعیین ساختار محتوایی");
      reasons.push("ضروری قبل از تولید محتوا");
      break;
  }

  return reasons;
}