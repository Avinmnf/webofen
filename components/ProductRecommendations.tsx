"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SimpleProduct {
  id: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  slug?: string;
  categories?: string[]; // دسته‌بندی یا تگ مرتبط با امتیاز
}

interface ProductRecommendationsProps {
  scores: Record<string, number>;
}

export const ProductRecommendations = ({ scores }: ProductRecommendationsProps) => {
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // تابع گرفتن محصولات از GraphQL
  const fetchProducts = async (): Promise<SimpleProduct[]> => {
    const query = `
      query {
        products {
          id
          title
          description
          slug
          categories
        }
      }
    `;
    const res = await fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const json = await res.json();
    return json.data.products;
  };

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await fetchProducts();

      // 🎯 Map فارسی → انگلیسی
      const mappedScores = {
        performance: scores.performance ?? scores["عملکرد"],
        accessibility: scores.accessibility ?? scores["دسترس‌پذیری"],
        bestPractices: scores.bestPractices ?? scores["بهترین شیوه‌ها"],
        seo: scores.seo ?? scores["سئو"],
      };

      const scoreEntries = Object.entries(mappedScores || {});

      // 🔹 شرط جدید: همه امتیازها >= 0.9 → هیچ محصولی نشون نده
      const allAbove90 = scoreEntries.every(([_, score]) => (score || 0) >= 0.9);
      if (allAbove90) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // 🔹 انتخاب محصولات مرتبط با امتیازهای پایین
      const recommended: SimpleProduct[] = [];
      scoreEntries.forEach(([key, score]) => {
        if ((score || 0) < 0.9) {
          const matched = allProducts.filter(p => p.categories?.includes(key));
          recommended.push(...matched);
        }
      });

      // حذف محصولات تکراری
      const uniqueProducts = recommended.filter(
        (p, i, self) => i === self.findIndex(x => x.id === p.id)
      );

      setProducts(uniqueProducts);
      setLoading(false);
    };

    loadProducts();
  }, [scores]);

  if (loading) return null;
  if (products.length === 0) return null;

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
        {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-green-200 p-6 hover:shadow-lg transition-all duration-300 group">
            <div className="flex flex-col h-full">
            {/* تصویر یا ویدیو محصول */}
            {product.imageUrl && (
            product.imageUrl.endsWith(".mp4") ? (
                <video
                src="https://cdn-api.webofen.com/uploads/animate/optimization-1759061786206-295792419.mp4"
                className=" object-cover rounded-lg mb-4"
                autoPlay
                loop
                muted
                />
            ) : (
                <video
                src="https://cdn-api.webofen.com/uploads/animate/screamingfrog-1759061805797-760158552.mp4"
                className=" object-cover rounded-lg mb-4"
                autoPlay
                loop
                muted
                />
            )
            )}

            <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-700 transition-colors">
                {product.title}
                </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>

            {/* دلایل پیشنهاد */}
            <div className="mt-3 flex flex-wrap gap-2">
                {getProductReasons(product, scores).map((reason, index) => (
                <span key={index} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                    {reason}
                </span>
                ))}
            </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="text-green-600 font-medium text-sm">راه‌حل تخصصی</div>
            <Link 
                href={`/products/${product.slug}`}
                className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center group/btn"
            >
                <span>خرید محصول</span>
            </Link>
            </div>
        </div>
        </div>

        ))}
      </div>
    </div>
  );
};

// تابع نمایش دلایل پیشنهاد محصول
function getProductReasons(product: SimpleProduct, scores: Record<string, number>): string[] {
  const reasons: string[] = [];

  const seo = scores["seo"] ?? scores["سئو"];
  const performance = scores["performance"] ?? scores["عملکرد"];
  const accessibility = scores["accessibility"] ?? scores["دسترس‌پذیری"];
  const bestPractices = scores["bestPractices"] ?? scores["بهترین شیوه‌ها"];

  if (product.categories?.includes("seo") && (seo || 0) < 0.9) {
    reasons.push("سئو نیاز به بهبود دارد");
  }
  if (product.categories?.includes("performance") && (performance || 0) < 0.8) {
    reasons.push("عملکرد نیاز به بهبود دارد");
  }
  if (product.categories?.includes("accessibility") && (accessibility || 0) < 0.8) {
    reasons.push("دسترسی‌پذیری نیاز به بهبود دارد");
  }
  if (product.categories?.includes("bestPractices") && (bestPractices || 0) < 0.8) {
    reasons.push("بهترین روش‌ها نیاز به بهبود دارد");
  }
  if ([seo, performance, accessibility, bestPractices].some(s => (s || 0) < 0.8) && product.categories?.includes("optimization")) {
    reasons.push("امتیازهای پایین در چند بخش");
  }

  return reasons;
}
