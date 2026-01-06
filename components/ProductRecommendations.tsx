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
  brokenLinksCount?: number;
  securityAnalysis?: {
    isHttps: boolean;
    hasValidSSL: boolean;
    securityScore: number;
    securityIssues: Array<{
      type: string;
      severity: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      recommendation: string;
    }>;
    recommendations: string[];
    productRecommendations?: string[];
  };
}
export const ProductRecommendations = ({ 
  scores, 
  sitemapData, 
  isDuplicate = false,
  brokenLinksCount = 0,
  securityAnalysis
}: ProductRecommendationsProps) => {
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [allMainAbove90, setAllMainAbove90] = useState(false);
  const [needsContentProduction, setNeedsContentProduction] = useState(false);
  const [needsLinkBuilding, setNeedsLinkBuilding] = useState(false);
  const [needsSecurity, setNeedsSecurity] = useState(false);
  const [securitySeverity, setSecuritySeverity] = useState<'low' | 'medium' | 'high'>('high');
  const [linkBuildingSeverity, setLinkBuildingSeverity] = useState<'low' | 'medium' | 'high'>('low');
  const mockProducts: SimpleProduct[] = [
    {
      id: "1",
      title: "قرص بهینه‌ سازی",
      description: "بهینه‌ سازی کامل سئو، عملکرد، دسترسی‌ پذیری و بهترین شیوه‌ها برای بهبود کلی وبسایت",
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
      title: "قرص کیوورد کلاسترینگ ",
      description: "قبل از انجام تولید محتوای جدید، برای دریافت موضوعات و ساختار مناسب، قرص کلاسترینگ را خریداری نمایید",
      imageUrl: "keywordcluster.mp4",
      slug: "keyword-cluster",
    },
    {
      id: "5",
      title: "قرص لینک‌ سازی داخلی",
      description: "ساخت بک‌لینک‌ های باکیفیت و بهبود اعتبار دامنه برای افزایش رتبه در موتور های جستجو",
      imageUrl: "internallink.mp4",
      slug: "internal-linking",
    },
    {
      id: "6",
      title: "قرص امنیت‌ سازی",
      description: "بررسی و رفع مشکلات امنیتی شامل HTTPS، گواهی SSL، هدرهای امنیتی و محافظت در برابر حملات",
      imageUrl: "security.mp4",
      slug: "security",
    },
  ];
  useEffect(() => {
    console.log("🔄 ProductRecommendations useEffect running...", {
      isDuplicate,
      hasSitemapData: !!sitemapData,
      totalLinks: sitemapData?.totalLinks,
      sitemapExists: sitemapData?.sitemapExists,
      scores,
      brokenLinksCount,
      securityAnalysis: !!securityAnalysis,
      securityScore: securityAnalysis?.securityScore,
      isHttps: securityAnalysis?.isHttps,
      hasValidSSL: securityAnalysis?.hasValidSSL,
      securityIssuesCount: securityAnalysis?.securityIssues?.length || 0
    });
    // 🔥 لاگ کامل برای دیباگ امنیتی
    if (securityAnalysis) {
      console.log("🔒 FULL SECURITY ANALYSIS DATA:", securityAnalysis);
      console.log("🔒 SECURITY CONDITIONS CHECK:", {
        noHttps: !securityAnalysis.isHttps,
        invalidSSL: !securityAnalysis.hasValidSSL,
        hasIssues: securityAnalysis.securityIssues.length > 0,
        securityScore: securityAnalysis.securityScore,
        shouldShowSecurity: !securityAnalysis.isHttps || !securityAnalysis.hasValidSSL || securityAnalysis.securityIssues.length > 0
      });
    }
    const mappedScores = {
      performance: scores["performance"] ?? scores["عملکرد"],
      accessibility: scores["accessibility"] ?? scores["دسترس‌ پذیری"],
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
    // محاسبات سایت‌مپ
    const hasValidSitemap = sitemapData && sitemapData.sitemapExists;
    const totalLinks = sitemapData?.totalLinks || 0;
    const hasLowLinks = totalLinks < 200;
    const shouldSuggestContent = hasValidSitemap && hasLowLinks;
    const wasSuggestingContentPreviously = isDuplicate && hasValidSitemap && hasLowLinks;
    // محاسبات لینک‌های شکسته
    let shouldSuggestLinkBuilding = false;
    let linkSeverity: 'low' | 'medium' | 'high' = 'low';
    if (brokenLinksCount > 10) {
      shouldSuggestLinkBuilding = true;
      if (brokenLinksCount <= 30) {
        linkSeverity = 'medium';
      } else {
        linkSeverity = 'high';
      }
    }
    // 🔥 منطق فوق العاده ساده برای امنیت
    let shouldSuggestSecurity = false;
    let securitySev: 'low' | 'medium' | 'high' = 'high';
    if (securityAnalysis) {
      // 🔥 شرط اصلی: اگر HTTPS نیست، حتما محصول امنیتی پیشنهاد شود
      shouldSuggestSecurity = !securityAnalysis.isHttps;
      console.log("🔒 ULTRA SIMPLIFIED SECURITY CHECK:", {
        url: window.location.href,
        hasSecurityAnalysis: !!securityAnalysis,
        isHttps: securityAnalysis.isHttps,
        shouldSuggestSecurity
      });
      // تعیین شدت بر اساس شرایط
      if (!securityAnalysis.isHttps) {
        securitySev = 'high';
        console.log("🚨 HIGH PRIORITY: Website is using HTTP instead of HTTPS");
      } else if (!securityAnalysis.hasValidSSL) {
        securitySev = 'high';
      } else if (securityAnalysis.securityIssues.some(issue => issue.severity === 'high')) {
        securitySev = 'high';
      } else if (securityAnalysis.securityIssues.length > 0 || securityAnalysis.securityScore < 70) {
        securitySev = 'medium';
      } else if (securityAnalysis.securityScore < 80) {
        securitySev = 'low';
      }
    }
    setNeedsContentProduction(!!shouldSuggestContent || !!wasSuggestingContentPreviously);
    setNeedsLinkBuilding(shouldSuggestLinkBuilding);
    setNeedsSecurity(shouldSuggestSecurity);
    setLinkBuildingSeverity(linkSeverity);
    setSecuritySeverity(securitySev);
    const recommended: SimpleProduct[] = [];
    // 1. محصولات بر اساس امتیازات
    if ((performance || 0) < 0.9) {
      recommended.push(mockProducts[0]);
    }
    const hasLowScore = Object.values(mappedScores).some((s) => Number(s || 0) < 0.8);
    if (hasLowScore && !recommended.some(p => p.id === "1")) {
      recommended.push(mockProducts[0]);
    }
    if ((seo || 0) < 0.9) {
      recommended.push(mockProducts[1]);
    }
    // 2. محصولات سایت‌مپ
    if (shouldSuggestContent || wasSuggestingContentPreviously) {
      if (!recommended.some(p => p.id === "3")) {
        recommended.push(mockProducts[2]);
      }
      if (!recommended.some(p => p.id === "4")) {
        recommended.push(mockProducts[3]);
      }
    }
    // 3. محصولات لینک‌سازی
    if (shouldSuggestLinkBuilding && !recommended.some(p => p.id === "5")) {
      recommended.push(mockProducts[4]);
    }
    // 4. 🔥 محصولات امنیتی - منطق فوق العاده ساده
    console.log("🛡️ ULTRA SIMPLE SECURITY PRODUCT CHECK:", {
      securityAnalysisExists: !!securityAnalysis,
      isHttps: securityAnalysis?.isHttps,
      shouldSuggestSecurity
    });
    // 🔥 شرط نهایی: اگر securityAnalysis وجود دارد و HTTPS نیست، محصول را اضافه کن
    if (securityAnalysis && !securityAnalysis.isHttps) {
      console.log("✅ ✅ ✅ ADDING SECURITY PRODUCT - Website is using HTTP");
      if (!recommended.some(p => p.id === "6")) {
        recommended.push(mockProducts[5]);
        console.log("✅ ✅ ✅ SECURITY PRODUCT SUCCESSFULLY ADDED FOR HTTP SITE");
      }
    } else {
      console.log("❌ Security product NOT added - Website is using HTTPS or no security analysis");
    }
    console.log("📦 FINAL RECOMMENDED PRODUCTS:", recommended.map(p => `${p.title} (${p.id})`));
    // حالت خاص: همه امتیازها بالا اما نیاز به محتوا، لینک‌سازی یا امنیت داریم
    const finalShouldSuggestContent = shouldSuggestContent || wasSuggestingContentPreviously;
    if (allAbove90 && (finalShouldSuggestContent || shouldSuggestLinkBuilding || shouldSuggestSecurity)) {
      console.log("🎯 All scores high - filtering to essential products");
      const essentialProducts = recommended.filter(p => 
        p.id === "3" || p.id === "4" || p.id === "5" || p.id === "6"
      );
      setProducts(essentialProducts);
      setLoading(false);
      return;
    }
    // حذف duplicates
    const uniqueProducts = recommended.filter(
      (p, i, self) => i === self.findIndex((x) => x.id === p.id)
    );
    console.log("🎯 FINAL UNIQUE PRODUCTS TO DISPLAY:", uniqueProducts.map(p => p.title));
    setProducts(uniqueProducts);
    setLoading(false);
  }, [scores, sitemapData, isDuplicate, brokenLinksCount, securityAnalysis]);
  if (loading) return <div className="text-center py-4">در حال بررسی محصولات پیشنهادی...</div>;
  if (products.length === 0 && allMainAbove90 && !needsContentProduction && !needsLinkBuilding && !needsSecurity) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-sm border border-green-100 text-center">
        <h2 className="font-bold text-xl text-green-700 mb-2">وضعیت وبسایت شما عالی است 🎉</h2>
        <p className="text-gray-700 text-sm">
          تمام بخش‌های اصلی وبسایت شما (عملکرد، سئو، بهترین شیوه‌ها، دسترسی‌ پذیری) امتیاز بالای ۹۰ دارند.
          <br />
          {sitemapData && sitemapData.totalLinks >= 200 && (
            <span className="text-green-600 font-medium mt-2 inline-block text-xs">
              ✅ تعداد لینک‌های سایت‌ مپ شما ({sitemapData.totalLinks}) نیز مناسب است.
            </span>
          )}
          {brokenLinksCount === 0 && (
            <span className="text-green-600 font-medium mt-2 inline-block text-xs">
              ✅ هیچ لینک شکسته‌ای در سایت شما شناسایی نشد.
            </span>
          )}
          {brokenLinksCount > 0 && brokenLinksCount <= 10 && (
            <span className="text-green-600 font-medium mt-2 inline-block text-xs">
              ✅ تعداد لینک‌ های شکسته ({brokenLinksCount}) کم است و نیاز به اقدام فوری ندارد.
            </span>
          )}
          {securityAnalysis && securityAnalysis.securityScore >= 80 && securityAnalysis.isHttps && securityAnalysis.hasValidSSL && securityAnalysis.securityIssues.length === 0 && (
            <span className="text-green-600 font-medium mt-2 inline-block text-xs">
              ✅ وضعیت امنیتی وبسایت شما مناسب است (امتیاز: {securityAnalysis.securityScore}).
            </span>
          )}
        </p>
      </div>
    );
  }
  // تابع برای دریافت رنگ‌ها بر اساس شدت مشکل
  const getSeverityColors = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-800',
          accent: 'text-purple-600',
          badge: 'bg-purple-100 text-purple-800'
        };
      case 'medium':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          accent: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-800'
        };
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          accent: 'text-red-600',
          badge: 'bg-red-100 text-red-800'
        };
      default:
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-800',
          accent: 'text-purple-600',
          badge: 'bg-purple-100 text-purple-800'
        };
    }
  };
  const linkSeverityColors = getSeverityColors(linkBuildingSeverity);
  const securitySeverityColors = getSeverityColors(securitySeverity);
  // 🔥 بررسی اینکه آیا محصول امنیتی در لیست وجود دارد
  const hasSecurityProduct = products.some(product => product.id === "6");
  // تابع برای ایجاد گرادیانت متناسب با هر محصول
  const getProductGradient = (productId: string) => {
    switch(productId) {
      case "1":
        return "bg-gradient-to-br from-red-50 ";
      case "2":
        return "bg-gradient-to-br from-green-50 ";
      case "3":
        return "bg-gradient-to-br from-blue-50";
      case "4":
        return "bg-gradient-to-br from-pink-50 to-violet-100";
      case "5":
        return "bg-gradient-to-br from-indigo-50 to-blue-50";
      case "6":
        return "bg-gradient-to-br from-red-50 to-pink-50";
      default:
        return "bg-gradient-to-br from-gray-50 to-white";
    }
  };
  // تابع برای دریافت رنگ پس‌زمینه ویدیو
  const getVideoBackground = (productId: string) => {
    switch(productId) {
      case "1":
        return "bg-red-100";
      case "2":
        return "bg-green-100";
      case "3":
        return "bg-blue-100";
      case "4":
        return "bg-purple-100";
      case "5":
        return "bg-indigo-100";
      case "6":
        return "bg-green-50";
      default:
        return "bg-gray-100";

    }
  };
  return (
    <div className="bg-gradient-to-br bg-gray-50 rounded-xl p-5 shadow-sm border border-green-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl text-gray-800">محصولات پیشنهادی برای بهبود وبسایت</h2>
        <div className="flex items-center space-x-2 space-x-reverse bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
          <span>
            {isDuplicate 
              ? "بر اساس تحلیل امتیازها و سایت ‌مپ موجود" 
              : "بر اساس تحلیل امتیازها و سایت ‌مپ"
            }
            {securityAnalysis && " و امنیت"}
          </span>
        </div>
      </div>
      {isDuplicate && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 text-yellow-600 mt-0.5">🔄</div>
            <div className="mr-2">
              <h4 className="font-bold text-yellow-800 text-s mb-1">تحلیل مجدد با لینک تکراری</h4>
              <p className="text-yellow-700 text-s">
                از آنجایی که این لینک قبلاً تحلیل شده، از داده‌های موجود استفاده می‌شود.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* نمایش اطلاعات سایت‌مپ، broken links و امنیت */}
      <div className="mb-4 space-y-3">
        {sitemapData && sitemapData.sitemapExists && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-blue-800 text-s mb-1">وضعیت سایت ‌مپ</h4>
                <p className="text-blue-700 text-s">
                  سایت‌مپ: ✅ موجود | 
                  تعداد لینک‌ها: <strong>{sitemapData.totalLinks}</strong>
                  {sitemapData.totalLinks < 200 && (
                    <span className="mr-2 text-orange-600 font-medium">(نیاز به بهبود - زیر ۲۰۰ لینک)</span>
                  )}
                </p>
              </div>
              {sitemapData.totalLinks < 200 && (
                <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  نیاز به تولید محتوا
                </div>
              )}
            </div>
          </div>
        )}
        {brokenLinksCount > 10 && (
          <div className={`p-3 border rounded-lg ${linkSeverityColors.bg} ${linkSeverityColors.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-bold text-s mb-1 ${linkSeverityColors.text}`}>
                  وضعیت لینک‌ های شکسته
                </h4>
                <p className={`text-s ${linkSeverityColors.text}`}>
                  تعداد لینک‌ های شکسته: <strong>{brokenLinksCount}</strong>
                  <span className="mr-2 font-medium">
                    {linkBuildingSeverity === 'medium' && "(نیاز به لینک‌ سازی)"}
                    {linkBuildingSeverity === 'high' && "(نیاز فوری به لینک‌ سازی)"}
                  </span>
                </p>
              </div>
              <div className={linkSeverityColors.badge + " px-2 py-1 rounded-full text-xs font-medium"}>
                {linkBuildingSeverity === 'medium' && "نیاز به لینک‌ سازی"}
                {linkBuildingSeverity === 'high' && "نیاز فوری"}
              </div>
            </div>
          </div>
        )}
        {brokenLinksCount > 0 && brokenLinksCount <= 10 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-green-800 text-s mb-1">وضعیت لینک‌ های شکسته</h4>
                <p className="text-green-700 text-s">
                  تعداد لینک‌های شکسته: <strong>{brokenLinksCount}</strong>
                  <span className="mr-2 font-medium text-green-600">(وضعیت قابل قبول)</span>
                </p>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                وضعیت خوب
              </div>
            </div>
          </div>
        )}
        {securityAnalysis && (
          <div className={`p-3 border rounded-lg ${securitySeverityColors.bg} ${securitySeverityColors.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-bold text-s mb-1 ${securitySeverityColors.text}`}>
                  وضعیت امنیتی
                </h4>
                <p className={`text-s ${securitySeverityColors.text}`}>
                  امتیاز امنیتی: <strong>{securityAnalysis.securityScore}/100</strong>
                  {!securityAnalysis.isHttps && (
                    <span className="mr-2 font-medium">(عدم استفاده از HTTPS)</span>
                  )}
                  {securityAnalysis.isHttps && !securityAnalysis.hasValidSSL && (
                    <span className="mr-2 font-medium">(گواهی SSL نامعتبر)</span>
                  )}
                  {securityAnalysis.securityIssues.length > 0 && (
                    <span className="mr-2 font-medium">({securityAnalysis.securityIssues.length} مشکل امنیتی)</span>
                  )}
                </p>
              </div>
              <div className={securitySeverityColors.badge + " px-2 py-1 rounded-full text-xs font-medium"}>
                {securitySeverity === 'low' && "نیاز به بهبود امنیت"}
                {securitySeverity === 'medium' && "نیاز به امنیت‌ سازی"}
                {securitySeverity === 'high' && "نیاز فوری به امنیت"}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 🔥 پیام هشدار اگر مشکلات امنیتی داریم اما محصول امنیتی نمایش داده نمی‌شود */}
      {securityAnalysis && !hasSecurityProduct && needsSecurity && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 text-red-600 mt-0.5">🚨</div>
            <div className="mr-2">
              <h4 className="font-bold text-red-800 text-xs mb-1">مشکل در نمایش محصول امنیتی</h4>
              <p className="text-red-700 text-xs">
                مشکلات امنیتی شناسایی شده است اما محصول امنیتی نمایش داده نمی‌شود. 
                این ممکن است به دلیل مشکل در منطق نمایش باشد.
              </p>
              <div className="mt-1 text-xs text-red-600">
                <strong>لطفاً کنسول مرورگر را بررسی کنید (F12) و لاگ‌ های مربوطه را ببینید.</strong>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className={`rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300 group ${getProductGradient(product.id)}`}
          >
            <div className="flex flex-col h-full">
              {product.imageUrl && (
                <div className="relative mb-3">
                  {/* ویدیو مربعی */}
                  <div className={`w-full h-48 mx-auto overflow-hidden rounded-lg shadow-sm ${getVideoBackground(product.id)} flex items-center justify-center`}>
                    <video
                      src={
                        product.id === "1" ? "/guidance/optimization.mp4" :
                        product.id === "2" ? "/guidance/screamingfrog.mp4" :
                        product.id === "3" ? "/guidance/content.mp4" :
                        product.id === "4" ? "/guidance/keywordcluster.mp4" :
                        product.id === "5" ? "/guidance/internallink.mp4" :
                        "/guidance/security.mp4"
                      }
                      className="w-auto h-full max-w-full object-contain"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  {/* دایره رنگی پشت ویدیو */}
                  <div className="absolute inset-0 -z-10">
                    <div className="w-28 h-28 mx-auto bg-gradient-to-br from-white/80 to-gray-100/50 rounded-full blur-sm"></div>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-base text-gray-800 mb-2 text-center">{product.title}</h3>
                <p className="text-gray-600 text-xs mb-3 leading-normal text-center line-clamp-2">{product.description}</p>
                {/* نمایش اطلاعات سایت‌مپ برای محصول تولید محتوا */}
                {product.id === "3" && sitemapData && sitemapData.totalLinks < 200 && (
                  <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-blue-700 font-medium">لینک‌ های فعلی:</span>
                      <span className="text-blue-800 font-bold">{sitemapData.totalLinks}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span className="text-blue-700 font-medium">هدف پیشنهادی:</span>
                      <span className="text-blue-600 font-bold">200+ لینک</span>
                    </div>
                  </div>
                )}
                {/* نمایش اطلاعات امنیتی برای محصول امنیت */}
                {product.id === "6" && securityAnalysis && (
                  <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-700 font-medium">امتیاز امنیتی:</span>
                      <span className="text-red-800 font-bold">{securityAnalysis.securityScore}/100</span>
                    </div>
                    {!securityAnalysis.isHttps && (
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-red-700 font-medium">مشکل اصلی:</span>
                        <span className="text-red-600 font-bold">عدم استفاده از HTTPS</span>
                      </div>
                    )}
                    {!securityAnalysis.hasValidSSL && (
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-red-700 font-medium">مشکل امنیتی:</span>
                        <span className="text-red-600 font-bold">گواهی SSL نامعتبر</span>
                      </div>
                    )}
                    {securityAnalysis.securityIssues.length > 0 && (
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-red-700 font-medium">مشکلات شناسایی شده:</span>
                        <span className="text-red-600 font-bold">{securityAnalysis.securityIssues.length} مورد</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1 justify-center">
                  {getProductReasons(product.id, scores, sitemapData, isDuplicate, brokenLinksCount, securityAnalysis).map((reason, index) => (
                    <span 
                      key={index}
                      className="inline-block text-xs px-2 py-0.5 rounded-full border bg-white/70 text-gray-700 border-gray-300 backdrop-blur-sm"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
              {/* بخش دکمه‌ها */}
              <div className="flex flex-col items-center justify-between mt-auto pt-3 border-t border-gray-200/50">
                <div className="text-xs font-medium text-gray-700 mb-3">
                  {product.id === "3" ? "" : 
                   product.id === "4" ? "" : 
                   product.id === "5" ? " " : 
                   product.id === "6" ? " " : ""}
                </div>
                <div className="flex items-center gap-2 w-full">
                  {/* دکمه تماس بگیرید */}
                  <Link 
                    href="tel:02188515914"
                    className="flex-1 px-3 py-2 rounded-lg text-s font-medium transition-colors duration-200 flex items-center justify-center group/contact-btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-sm"
                  >
                    <span>تماس بگیرید</span>
                    <svg className="w-3 h-3 mr-1 group-hover/contact-btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </Link>
                  {/* دکمه خرید محصول */}
                  <Link 
                    href={`/products/${product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 rounded-lg text-s font-medium transition-colors duration-200 flex items-center justify-center group/btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
                  >
                    <span>خرید محصول</span>
                    <svg className="w-3 h-3 mr-1 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && !allMainAbove90 && (
        <div className="text-center py-4 text-gray-600 text-sm">
          هیچ محصولی برای نمایش وجود ندارد. وضعیت وبسایت شما در همه زمینه‌ها مناسب است.
        </div>
      )}
      {needsContentProduction && sitemapData && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 text-orange-600 mt-0.5">📈</div>
            <div className="mr-2">
              <h4 className="font-bold text-blue-800 text-s mb-1">نیاز به تولید محتوای بیشتر و ساختار دهی</h4>
              <p className="text-blue-700 text-s">
                تعداد لینک‌های سایت‌مپ شما ({sitemapData.totalLinks}) کمتر از ۲۰۰ است.
                برای بهبود رتبه سئو و افزایش visibility در موتورهای جستجو، 
                تولید محتوای بیشتر و ساختاردهی مناسب محتواها (کلاسترینگ) ضروری است.
                {isDuplicate && (
                  <span className="block mt-1 text-blue-800 font-medium text-s">
                    🔄 این پیشنهاد بر اساس تحلیل تکراری و داده‌ های موجود ارائه می‌شود.
                  </span>
                )}
                <strong className="block mt-1 text-s">توصیه: ابتدا قرص کلاسترینگ را خریداری کنید سپس تولید محتوا را آغاز نمایید.</strong>
              </p>
            </div>
          </div>
        </div>
      )}
      {needsLinkBuilding && (
        <div className={`mt-4 p-3 border rounded-lg ${linkSeverityColors.bg} ${linkSeverityColors.border}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 mt-0.5">
              {linkBuildingSeverity === 'medium' && "⚠️"}
              {linkBuildingSeverity === 'high' && "🚨"}
            </div>
            <div className="mr-2">
              <h4 className={`font-bold text-s mb-1 ${linkSeverityColors.text}`}>
                {linkBuildingSeverity === 'medium' && "نیاز به لینک‌ سازی"}
                {linkBuildingSeverity === 'high' && "نیاز فوری به لینک‌ سازی"}
              </h4>
              <p className={`text-s ${linkSeverityColors.text}`}>
                {linkBuildingSeverity === 'medium' && 
                  `تعداد لینک‌های شکسته سایت شما (${brokenLinksCount}) بین ۱۱ تا ۳۰ است. نیاز به اقدام برای لینک‌ سازی خارجی دارید.`
                }
                {linkBuildingSeverity === 'high' && 
                  `تعداد لینک‌های شکسته سایت شما (${brokenLinksCount}) بیشتر از ۳۰ است که نیاز به لینک‌سازی فوری دارد. این لینک‌ های شکسته می‌ توانند بر رتبه سئوی شما تأثیر منفی بگذارند.`
                }
                <strong className="block mt-1 text-s">
                  {linkBuildingSeverity === 'medium' && "توصیه: با استفاده از قرص لینک‌ سازی، بک ‌لینک‌ های باکیفیت و مرتبط بسازید."}
                  {linkBuildingSeverity === 'high' && "توصیه: فوراً قرص لینک‌ سازی را خریداری کنید تا بک‌ لینک‌های باکیفیت بسازید."}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}
      {needsSecurity && securityAnalysis && (
        <div className={`mt-4 p-3 border rounded-lg ${securitySeverityColors.bg} ${securitySeverityColors.border}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 mt-0.5">
              {securitySeverity === 'medium' && "⚠️"}
              {securitySeverity === 'high' && "🚨"}
            </div>
            <div className="mr-2">
              <h4 className={`font-bold text-s mb-1 ${securitySeverityColors.text}`}>
                {securitySeverity === 'low' && "نیاز به بهبود امنیت"}
                {securitySeverity === 'medium' && "نیاز به امنیت‌ سازی"}
                {securitySeverity === 'high' && "نیاز فوری به امنیت‌ سازی"}
              </h4>
              <p className={`text-xs ${securitySeverityColors.text}`}>
                {!securityAnalysis.isHttps && 
                  "وبسایت شما از پروتکل ناامن HTTP استفاده می‌کند که می‌ تواند برای کاربران و اطلاعات آن‌ها خطرناک باشد."
                }
                {securityAnalysis.isHttps && !securityAnalysis.hasValidSSL && 
                  "گواهی SSL وبسایت شما معتبر نیست که می‌ تواند باعث کاهش اعتماد کاربران و مشکلات امنیتی شود."
                }
                {securityAnalysis.securityScore < 70 && 
                  `امتیاز امنیتی وبسایت شما (${securityAnalysis.securityScore}) بسیار پایین است و نیاز به اقدام فوری دارد.`
                }
                {securityAnalysis.securityIssues.length > 0 && 
                  `تعداد ${securityAnalysis.securityIssues.length} مشکل امنیتی در وبسایت شما شناسایی شده است.`
                }
                <strong className="block mt-1 text-s">
                  {securitySeverity === 'high' && "توصیه: فوراً قرص امنیت‌ سازی را خریداری کنید تا مشکلات امنیتی برطرف شوند."}
                  {securitySeverity === 'medium' && "توصیه: با خرید قرص امنیت‌ سازی، امنیت وبسایت خود را ارتقا دهید."}
                  {securitySeverity === 'low' && "توصیه: برای بهبود وضعیت امنیتی، قرص امنیت‌ سازی را خریداری کنید."}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
function getProductReasons(
  productId: string, 
  scores: Record<string, number>, 
  sitemapData?: ProductRecommendationsProps['sitemapData'],
  isDuplicate?: boolean,
  brokenLinksCount?: number,
  securityAnalysis?: ProductRecommendationsProps['securityAnalysis']
): string[] {
  const reasons: string[] = [];
  const seo = scores["seo"] ?? scores["سئو"]; 
  const performance = scores["performance"] ?? scores["عملکرد"];
  const accessibility = scores["accessibility"] ?? scores["دسترس ‌پذیری"];
  const bestPractices = scores["bestPractices"] ?? scores["بهترین شیوه‌ها"];
  switch (productId) {
    case "1":
      if ([seo, performance, accessibility, bestPractices].some((s) => (s || 0) < 0.8)) {
        reasons.push("امتیاز های پایین در چند بخش");
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
        reasons.push(`فقط ${sitemapData.totalLinks} لینک در سایت‌ مپ`);
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
      break;
    case "5":
      if (brokenLinksCount && brokenLinksCount > 10) {
        reasons.push(`${brokenLinksCount} لینک شکسته`);
        reasons.push("نیاز به لینک ‌سازی");
      }
      if ((seo || 0) < 0.9) {
        reasons.push("بهبود سئو با بک‌ لینک");
      }
      break;
    case "6":
      if (securityAnalysis) {
        if (!securityAnalysis.isHttps) {
          reasons.push("عدم استفاده از HTTPS");
        }
        if (!securityAnalysis.hasValidSSL) {
          reasons.push("گواهی SSL نامعتبر");
        }
        if (securityAnalysis.securityScore < 80) {
          reasons.push("امتیاز امنیتی پایین");
        }
        if (securityAnalysis.securityIssues.length > 0) {
          reasons.push(`${securityAnalysis.securityIssues.length} مشکل امنیتی`);
        }
      }
      break;
  }
  return reasons;
}