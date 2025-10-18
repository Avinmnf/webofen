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
}

export const ProductRecommendations = ({ scores }: ProductRecommendationsProps) => {
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // 📦 محصولات پیشنهادی mock
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
  ];

  useEffect(() => {
    const mappedScores = {
      performance: scores["performance"] ?? scores["عملکرد"],
      accessibility: scores["accessibility"] ?? scores["دسترس‌پذیری"],
      bestPractices: scores["bestPractices"] ?? scores["بهترین شیوه‌ها"],
      seo: scores["seo"] ?? scores["سئو"],
    };

    // فقط ۳ تا معیار اصلی بررسی میشه
    const { accessibility, bestPractices, seo } = mappedScores;
    const allMainAbove90 =
      Number(accessibility || 0) >= 0.9 &&
      Number(bestPractices || 0) >= 0.9 &&
      Number(seo || 0) >= 0.9;

    // اگه همه‌شون بالای ۹۰ بودن، هیچ محصولی پیشنهاد نده
    if (allMainAbove90) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const recommended: SimpleProduct[] = [];

    // اگر یکی از امتیازها کمتر از ۰.۸ بود، بسته بهینه‌سازی پیشنهاد بشه
    const hasLowScore = Object.values(mappedScores).some((s) => Number(s || 0) < 0.8);
    if (hasLowScore) recommended.push(mockProducts[0]);

    // اگر سئو کمتر از ۰.۹ بود، Screaming Frog پیشنهاد بشه
    if ((mappedScores.seo || 0) < 0.9) recommended.push(mockProducts[1]);

    // حذف تکراری‌ها
    const uniqueProducts = recommended.filter(
      (p, i, self) => i === self.findIndex((x) => x.id === p.id)
    );

    setProducts(uniqueProducts);
    setLoading(false);
  }, [scores]);

  if (loading || products.length === 0) return null;
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl text-gray-800">محصولات پیشنهادی برای بهبود وبسایت</h2>
        <div className="flex items-center space-x-2 space-x-reverse bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>بر اساس تحلیل امتیازها</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-green-200 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="flex flex-col h-full">
          {/* تصویر یا ویدیو محصول */}
            {product.imageUrl && (
            <video
                src={
                product.id === "1"
                    ? "/guidance/optimization.mp4"       // ویدیوی محصول اول
                    : "/guidance/screamingfrog.mp4"     // ویدیوی محصول دوم
                }
                className="object-cover rounded-lg mb-4"
                autoPlay
                loop
                muted
                playsInline
            />
            )}



              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-800  transition-colors">
                    {product.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.description}</p>

                {/* دلایل پیشنهاد */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {getProductReasons(product.id, scores).map((reason, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="text-green-600 font-medium text-sm">راه‌حل تخصصی</div>
                <Link 
                  href={`/products/${product.slug}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center group/btn"
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
    </div>
  );
};

// 🎯 تابع نمایش دلایل پیشنهاد محصول
function getProductReasons(productId: string, scores: Record<string, number>): string[] {
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
      break;

    case "2":
      if ((seo || 0) < 0.9) {
        reasons.push("سئو نیاز به بهبود دارد");
      }
      break;
  }

  return reasons;
}
