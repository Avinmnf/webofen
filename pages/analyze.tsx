"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { useAnalyses } from "@/hooks/useAnalyses";
// Import components
import { HeroSection } from "@/components/HeroSection";
import { SuccessAlert } from "@/components/SuccessAlert";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { AnimatedLoading } from "@/components/AnimatedLoading";
import { AnalysisScores } from "@/components/AnalysisScores";
import { CoreMetrics } from "@/components/CoreMetrics";
import { IssuesList } from "@/components/IssuesList";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { HowItWorks } from "@/components/HowItWorks";
import { GlobalStyles } from "@/components/GlobalStyles";
import { WebsiteOverview } from "@/components/WebsiteOverview";
import { ScoreGuide } from "@/components/ScoreGuide";
import { AnalysisModal } from "@/components/AnalysisModal";
import SEO from "@/components/seo";

// Import types
import { AnalyzeResult, Analysis } from "@/lib/models/analyze";

// تبدیل API result به AnalyzeResult - نسخه بهبود یافته با پشتیبانی از سایت‌مپ، brokenLinksCount و securityAnalysis
const convertApiResultToAnalyzeResult = (apiResult: any): AnalyzeResult => {
  console.log('🔄 Converting API result to AnalyzeResult...', apiResult);
  
  // استخراج عنوان از مسیرهای مختلف با اولویت‌بندی
  let pageTitle = "بدون عنوان";
  let titleSource = "default";
  
  // اولویت ۱: عنوان از result.meta.title
  if (apiResult.result?.meta?.title && apiResult.result.meta.title.trim() && apiResult.result.meta.title !== "بدون عنوان") {
    pageTitle = apiResult.result.meta.title;
    titleSource = "result.meta.title";
  }
  // اولویت ۲: عنوان از result.title
  else if (apiResult.result?.title && apiResult.result.title.trim() && apiResult.result.title !== "بدون عنوان") {
    pageTitle = apiResult.result.title;
    titleSource = "result.title";
  }
  // اولویت ۳: عنوان از result.meta.ogTitle
  else if (apiResult.result?.meta?.ogTitle && apiResult.result.meta.ogTitle.trim()) {
    pageTitle = apiResult.result.meta.ogTitle;
    titleSource = "result.meta.ogTitle";
  }
  // اولویت ۴: عنوان مستقیم از apiResult.title
  else if (apiResult.title && apiResult.title.trim() && apiResult.title !== "بدون عنوان") {
    pageTitle = apiResult.title;
    titleSource = "apiResult.title";
  }
  // اولویت ۵: عنوان از result.metaTitle
  else if (apiResult.result?.metaTitle && apiResult.result.metaTitle.trim() && apiResult.result.metaTitle !== "بدون عنوان") {
    pageTitle = apiResult.result.metaTitle;
    titleSource = "result.metaTitle";
  }
  
  console.log(`🏷️ Title extracted from ${titleSource}: ${pageTitle}`);
  
  // استخراج issues از مسیرهای مختلف برای اطمینان
  let issues = [];
  let source = 'unknown';
  
  // اولویت ۱: مسیر اصلی سرور - analysisIssues در extra
  if (apiResult.result?.extra?.analysisIssues) {
    issues = apiResult.result.extra.analysisIssues;
    source = 'result.extra.analysisIssues';
    console.log('✅ Found issues in result.extra.analysisIssues:', issues.length);
  } 
  // اولویت ۲: مسیر مستقیم analysisIssues
  else if (apiResult.analysisIssues) {
    issues = apiResult.analysisIssues;
    source = 'analysisIssues';
    console.log('✅ Found issues in analysisIssues:', issues.length);
  }
  // اولویت ۳: مسیر مستقیم issues
  else if (apiResult.result?.issues) {
    issues = apiResult.result.issues;
    source = 'result.issues';
    console.log('✅ Found issues in result.issues:', issues.length);
  } 
  // اولویت ۴: مسیر ریشه issues
  else if (apiResult.issues) {
    issues = apiResult.issues;
    source = 'issues';
    console.log('✅ Found issues in apiResult.issues:', issues.length);
  } 
  // اولویت ۵: privateData (برای سازگاری با backward)
  else if (apiResult.privateData) {
    issues = apiResult.privateData;
    source = 'privateData';
    console.log('✅ Found issues in privateData:', issues.length);
  } 
  else {
    console.log('❌ No issues found in any path');
    console.log('🔍 Available paths:', {
      'result.extra.analysisIssues': apiResult.result?.extra?.analysisIssues,
      'analysisIssues': apiResult.analysisIssues,
      'result.issues': apiResult.result?.issues,
      'issues': apiResult.issues,
      'privateData': apiResult.privateData
    });
  }

  // استخراج اطلاعات سایت‌مپ از مسیرهای مختلف
  let sitemapData = null;
  let sitemapSource = 'unknown';
  
  // اولویت ۱: مسیر اصلی سرور - sitemapAnalysis در extra
  if (apiResult.result?.extra?.sitemapAnalysis) {
    sitemapData = apiResult.result.extra.sitemapAnalysis;
    sitemapSource = 'result.extra.sitemapAnalysis';
    console.log('✅ Found sitemap data in result.extra.sitemapAnalysis:', {
      totalLinks: sitemapData.totalLinks,
      sitemapExists: sitemapData.sitemapExists,
      sitemapUrls: sitemapData.sitemapUrls?.length || 0
    });
  }
  // اولویت ۲: مسیر مستقیم sitemapAnalysis
  else if (apiResult.sitemapAnalysis) {
    sitemapData = apiResult.sitemapAnalysis;
    sitemapSource = 'sitemapAnalysis';
    console.log('✅ Found sitemap data in sitemapAnalysis:', {
      totalLinks: sitemapData.totalLinks,
      sitemapExists: sitemapData.sitemapExists,
      sitemapUrls: sitemapData.sitemapUrls?.length || 0
    });
  }
  // اولویت ۳: مسیر result.sitemapAnalysis
  else if (apiResult.result?.sitemapAnalysis) {
    sitemapData = apiResult.result.sitemapAnalysis;
    sitemapSource = 'result.sitemapAnalysis';
    console.log('✅ Found sitemap data in result.sitemapAnalysis:', {
      totalLinks: sitemapData.totalLinks,
      sitemapExists: sitemapData.sitemapExists,
      sitemapUrls: sitemapData.sitemapUrls?.length || 0
    });
  }
  else {
    console.log('❌ No sitemap data found in any path');
  }

  // 🔥 استخراج brokenLinksCount از مسیرهای مختلف
  let brokenLinksCount = 0;
  let brokenLinksSource = 'unknown';
  
  // اولویت ۱: مسیر مستقیم brokenLinksCount
  if (typeof apiResult.brokenLinksCount === 'number') {
    brokenLinksCount = apiResult.brokenLinksCount;
    brokenLinksSource = 'apiResult.brokenLinksCount';
  }
  // اولویت ۲: مسیر result.extra.brokenLinksCount
  else if (typeof apiResult.result?.extra?.brokenLinksCount === 'number') {
    brokenLinksCount = apiResult.result.extra.brokenLinksCount;
    brokenLinksSource = 'result.extra.brokenLinksCount';
  }
  // اولویت ۳: مسیر result.brokenLinksCount
  else if (typeof apiResult.result?.brokenLinksCount === 'number') {
    brokenLinksCount = apiResult.result.brokenLinksCount;
    brokenLinksSource = 'result.brokenLinksCount';
  }
  // اولویت ۴: محاسبه از brokenLinksDetails
  else if (apiResult.result?.extra?.brokenLinksDetails) {
    brokenLinksCount = apiResult.result.extra.brokenLinksDetails.length;
    brokenLinksSource = 'calculated from brokenLinksDetails';
  }
  else if (apiResult.brokenLinksDetails) {
    brokenLinksCount = apiResult.brokenLinksDetails.length;
    brokenLinksSource = 'calculated from brokenLinksDetails (root)';
  }

  console.log(`🔗 Broken links count from ${brokenLinksSource}: ${brokenLinksCount}`);

  // 🔥 استخراج securityAnalysis از مسیرهای مختلف - بهبود یافته
  let securityAnalysis = null;
  let securitySource = 'unknown';
  
  // اولویت ۱: مسیر اصلی سرور - securityAnalysis در extra
  if (apiResult.result?.extra?.securityAnalysis) {
    securityAnalysis = apiResult.result.extra.securityAnalysis;
    securitySource = 'result.extra.securityAnalysis';
    console.log('✅ Found security analysis in result.extra.securityAnalysis:', {
      securityScore: securityAnalysis.securityScore,
      isHttps: securityAnalysis.isHttps,
      hasValidSSL: securityAnalysis.hasValidSSL,
      securityIssuesCount: securityAnalysis.securityIssues?.length || 0,
      productRecommendations: securityAnalysis.productRecommendations?.length || 0
    });
  }
  // اولویت ۲: مسیر مستقیم securityAnalysis
  else if (apiResult.securityAnalysis) {
    securityAnalysis = apiResult.securityAnalysis;
    securitySource = 'securityAnalysis';
    console.log('✅ Found security analysis in securityAnalysis:', {
      securityScore: securityAnalysis.securityScore,
      isHttps: securityAnalysis.isHttps,
      hasValidSSL: securityAnalysis.hasValidSSL,
      securityIssuesCount: securityAnalysis.securityIssues?.length || 0,
      productRecommendations: securityAnalysis.productRecommendations?.length || 0
    });
  }
  // اولویت ۳: مسیر result.securityAnalysis
  else if (apiResult.result?.securityAnalysis) {
    securityAnalysis = apiResult.result.securityAnalysis;
    securitySource = 'result.securityAnalysis';
    console.log('✅ Found security analysis in result.securityAnalysis:', {
      securityScore: securityAnalysis.securityScore,
      isHttps: securityAnalysis.isHttps,
      hasValidSSL: securityAnalysis.hasValidSSL,
      securityIssuesCount: securityAnalysis.securityIssues?.length || 0,
      productRecommendations: securityAnalysis.productRecommendations?.length || 0
    });
  }
  // اولویت ۴: بررسی دستی پروتکل اگر securityAnalysis وجود ندارد
  else {
    console.log('❌ No security analysis found in any path, checking protocol manually...');
    try {
      const urlObj = new URL(apiResult.url);
      const isHttps = urlObj.protocol === 'https:';
      
      securityAnalysis = {
        isHttps: isHttps,
        hasValidSSL: false,
        securityScore: isHttps ? 60 : 0,
        securityIssues: isHttps ? [] : [{
          type: 'https',
          severity: 'high',
          title: 'استفاده از پروتکل ناامن HTTP',
          description: 'وبسایت از پروتکل HTTP به جای HTTPS استفاده می‌کند که ارتباط را ناامن می‌سازد.',
          recommendation: 'فوراً به HTTPS مهاجرت کنید و از گواهی SSL معتبر استفاده نمایید.'
        }],
        recommendations: isHttps ? ['✅ وبسایت از پروتکل امن HTTPS استفاده می‌کند.'] : ['🛡️ نیاز فوری به مهاجرت به HTTPS دارید.'],
        productRecommendations: isHttps ? [] : [
          "🛡️ **محصول امنیتی پیشنهادی: مهاجرت به HTTPS**",
          "   - نصب گواهی SSL رایگان از Let's Encrypt",
          "   - پیکربندی هدر HSTS",
          "   - ریدایرکت تمام ترافیک HTTP به HTTPS"
        ]
      };
      securitySource = 'manual protocol check';
      console.log('✅ Manual security analysis created:', {
        isHttps: securityAnalysis.isHttps,
        securityScore: securityAnalysis.securityScore,
        securityIssuesCount: securityAnalysis.securityIssues.length
      });
    } catch (error) {
      console.log('❌ Could not create manual security analysis:', error);
    }
  }

  console.log(`📦 Conversion source: ${source}, issues count: ${issues.length}`);
  console.log(`🗺️ Sitemap source: ${sitemapSource}, total links: ${sitemapData?.totalLinks || 0}`);
  console.log(`🛡️ Security source: ${securitySource}, security score: ${securityAnalysis?.securityScore || 'N/A'}`);

  // ساخت result نهایی
  const result: AnalyzeResult = {
    url: apiResult.url,
    title: pageTitle, // استفاده از عنوان استخراج شده
    scores: { 
      performance: (apiResult.performance || 0) / 100,
      accessibility: (apiResult.accessibility || 0) / 100,
      bestPractices: (apiResult.bestPractices || 0) / 100,
      seo: (apiResult.seo || 0) / 100,
    },
    issues: issues,
    metrics: apiResult.result?.metrics || apiResult.metrics || {},
    brokenLinksCount: brokenLinksCount, // 🔥 اضافه کردن brokenLinksCount
  };

  // اضافه کردن meta data اگر وجود دارد
  if (apiResult.result?.meta) {
    result.meta = apiResult.result.meta;
  } else if (apiResult.meta) {
    result.meta = apiResult.meta;
  }

  // اضافه کردن extra اگر وجود دارد
  if (apiResult.result?.extra) {
    result.extra = apiResult.result.extra;
  } else if (apiResult.extra) {
    result.extra = apiResult.extra;
  }

  // اضافه کردن result اگر وجود دارد
  if (apiResult.result) {
    result.result = apiResult.result;
  }

  // اضافه کردن translations اگر وجود دارد
  if (apiResult.translations) {
    result.translations = apiResult.translations;
  }

  // اضافه کردن sitemap data اگر وجود دارد
  if (sitemapData) {
    result.sitemapAnalysis = sitemapData;
  }

  // 🔥 اضافه کردن security analysis اگر وجود دارد
  if (securityAnalysis) {
    result.securityAnalysis = securityAnalysis;
  }

  console.log('✅ Final converted result:', {
    title: result.title,
    titleSource: titleSource,
    issuesCount: result.issues.length,
    scores: result.scores,
    brokenLinksCount: result.brokenLinksCount,
    brokenLinksSource: brokenLinksSource,
    hasMeta: !!result.meta,
    hasExtra: !!result.extra,
    hasResult: !!result.result,
    hasTranslations: !!result.translations,
    hasSitemapAnalysis: !!result.sitemapAnalysis,
    sitemapLinks: result.sitemapAnalysis?.totalLinks || 0,
    hasSecurityAnalysis: !!result.securityAnalysis, // 🔥 اضافه شده
    securityScore: result.securityAnalysis?.securityScore || 'N/A', // 🔥 اضافه شده
    isHttps: result.securityAnalysis?.isHttps || 'N/A', // 🔥 اضافه شده
    securityIssuesCount: result.securityAnalysis?.securityIssues?.length || 0, // 🔥 اضافه شده
    productRecommendations: result.securityAnalysis?.productRecommendations?.length || 0 // 🔥 اضافه شده
  });

  return result;
};

// تابع برای نرمالایز کردن URL - بهبود یافته
const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // حذف پروتکل، www، اسلش انتها و پارامترهای کوئری
    let normalized = urlObj.hostname.replace(/^www\./, '') + urlObj.pathname;
    normalized = normalized.replace(/\/$/, ''); // حذف اسلش انتها
    normalized = normalized.replace(/\/+/g, '/'); // حذف اسلش‌های تکراری
    return normalized.toLowerCase();
  } catch {
    // اگر URL نامعتبر است، ساده‌سازی کنیم
    let normalized = url.toLowerCase().replace(/^www\./, '').replace(/\/$/, '');
    normalized = normalized.replace(/\/+/g, '/');
    return normalized;
  }
};

export default function AnalyzePage() {
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [pendingResult, setPendingResult] = useState<AnalyzeResult | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string>("");
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);
  const [analysisStarted, setAnalysisStarted] = useState<boolean>(false);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [resultsViewed, setResultsViewed] = useState<boolean>(false);
  const [isDuplicateAnalysis, setIsDuplicateAnalysis] = useState<boolean>(false);

  const resultsSectionRef = useRef<HTMLDivElement>(null);

  const { analyses: allAnalyses, analysis: apiAnalysis, loading, error, startAnalysis: hookStartAnalysis, resetError, checkExistingAnalysis } = useAnalyses();

  const convertedResult = useMemo(() => {
    if (apiAnalysis) {
      return convertApiResultToAnalyzeResult(apiAnalysis);
    }
    return null;
  }, [apiAnalysis]);

  // یافتن آنالیز موجود - بهبود یافته
  const findExistingAnalysis = useMemo(() => {
    if (!url || !allAnalyses || allAnalyses.length === 0) {
      console.log('❌ No URL or analyses to check');
      return null;
    }
    
    const normalizedUrl = normalizeUrl(url);
    console.log('🔍 Checking for existing analysis for:', normalizedUrl);
    
    // بررسی در همه آنالیزها برای URL نرمالایز شده
    const existing = allAnalyses.find(analysis => {
      const analysisNormalized = normalizeUrl(analysis.url);
      const isMatch = analysisNormalized === normalizedUrl;
      console.log(`   Comparing: ${analysisNormalized} === ${normalizedUrl} -> ${isMatch}`);
      return isMatch;
    });
    
    if (existing) {
      console.log('✅ Found existing analysis:', existing.id, 'Status:', existing.status);
    } else {
      console.log('❌ No existing analysis found');
    }
    
    return existing || null;
  }, [url, allAnalyses]);

  // بررسی وجود آنالیز تکراری
  const hasExistingAnalysis = useMemo(() => {
    return !!findExistingAnalysis;
  }, [findExistingAnalysis]);

  // مدیریت وضعیت آنالیزهای موجود
  useEffect(() => {
    if (findExistingAnalysis && findExistingAnalysis.status === 'completed' && url && !pendingResult && !analysisStarted) {
      console.log("🔄 Automatically loading existing analysis for:", url);
      const convertedExisting = convertApiResultToAnalyzeResult(findExistingAnalysis);
      setPendingResult(convertedExisting);
      setIsDuplicateAnalysis(true);
      setResultsViewed(true);
    }
  }, [findExistingAnalysis, url, pendingResult, analysisStarted]);

  // SEO Props با useMemo برای بهینه‌سازی
  const seoProps = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_WEBOFEN || "https://webofen.com";
    const currentUrl =
  typeof window !== "undefined"
    ? window.location.href
    : `${baseUrl}${router.asPath}`;

    
    if (pendingResult) {
      const seoScore = Math.round((pendingResult.scores.seo || 0) * 100);
      const performanceScore = Math.round((pendingResult.scores.performance || 0) * 100);
      const accessibilityScore = Math.round((pendingResult.scores.accessibility || 0) * 100);
      const bestPracticesScore = Math.round((pendingResult.scores.bestPractices || 0) * 100);
      
      // اطلاعات سایت‌مپ برای SEO
      const sitemapInfo = pendingResult.sitemapAnalysis ? 
        ` | لینک‌های سایت‌مپ: ${pendingResult.sitemapAnalysis.totalLinks}` : '';
      
      // اطلاعات broken links برای SEO
      const brokenLinksInfo = pendingResult.brokenLinksCount ? 
        ` | لینک‌های شکسته: ${pendingResult.brokenLinksCount}` : '';
      
      // 🔥 اطلاعات امنیتی برای SEO
      const securityInfo = pendingResult.securityAnalysis ? 
        ` | امنیت: ${pendingResult.securityAnalysis.securityScore}% | HTTPS: ${pendingResult.securityAnalysis.isHttps ? 'بله' : 'خیر'}` : '';
      
      return {
        title: `نتایج آنالیز ${pendingResult.title || url} | وبوفن`,
        description: `آنالیز کامل سایت ${url} - سئو: ${seoScore}% | عملکرد: ${performanceScore}% | دسترسی: ${accessibilityScore}% | بهترین روش‌ها: ${bestPracticesScore}%${sitemapInfo}${brokenLinksInfo}${securityInfo}`,
        keywords: `آنالیز سایت, سئو, عملکرد, دسترسی, بهترین روش‌ها, ${url}, بهینه سازی, وبوفن, سایت‌مپ, تولید محتوا, لینک‌های شکسته, امنیت سایت, HTTPS, SSL, محصول امنیتی`,
        canonical: currentUrl,
        ogType: "website" as const,
        tags: ["آنالیز سایت", "سئو", "عملکرد", "دسترسی", "بهترین روش‌ها", "بهینه سازی", "سایت‌مپ", "تولید محتوا", "لینک‌های شکسته", "امنیت سایت", "HTTPS", "SSL", "محصول امنیتی"],
        author: "وبوفن",
        structuredData: {
          "@context": "https://schema.org",
          "@type": "AnalysisPage",
          "name": `نتایج آنالیز ${pendingResult.title || url}`,
          "description": `نتایج کامل آنالیز سئو و عملکرد سایت ${url}`,
          "url": currentUrl,
          "mainEntity": {
            "@type": "WebSite",
            "name": pendingResult.title || url,
            "url": url,
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": seoScore,
                "bestRating": 100,
                "worstRating": 0
              },
              "author": {
                "@type": "Organization",
                "name": "وبوفن"
              }
            }
          }
        }
      };
    }

    // حالت پیش‌فرض - وقتی آنالیزی نمایش داده نمی‌شود
    return {
      title: "آنالیز رایگان سایت | وبوفن",
      description: "آنالیز تخصصی سئو و عملکرد وبسایت به صورت رایگان. بررسی مشکلات سئو، سرعت سایت، امنیت و استانداردهای وب. آنالیز کامل سئو، عملکرد، دسترسی و بهترین روش‌های توسعه وب",
      keywords: "آنالیز سایت, سئو, عملکرد, بهینه سازی, سرعت سایت, امنیت سایت, دسترسی پذیری, بهترین روش‌ها, وبوفن, سایت‌مپ, تولید محتوا, لینک‌های شکسته, HTTPS, SSL, محصول امنیتی",
      canonical: currentUrl,
      ogType: "website" as const,
      tags: ["آنالیز سایت", "سئو", "عملکرد", "بهینه سازی", "سرعت سایت", "امنیت", "سایت‌مپ", "تولید محتوا", "لینک‌های شکسته", "HTTPS", "SSL", "محصول امنیتی"],
      author: "وبوفن",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "آنالیز رایگان سایت | وبوفن",
        "description": "آنالیز تخصصی سئو و عملکرد وبسایت به صورت رایگان",
        "url": currentUrl,
        "isPartOf": {
          "@type": "WebSite",
          "name": "وبوفن",
          "url": baseUrl
        }
      }
    };
  }, [pendingResult, url, router.asPath]);

  // دیباگ برای ردیابی issues و سایت‌مپ و brokenLinksCount و securityAnalysis
  useEffect(() => {
    if (pendingResult) {
      console.log('📋 PendingResult issues:', pendingResult.issues);
      console.log('📊 PendingResult issues count:', pendingResult.issues.length);
      console.log('🗺️ PendingResult sitemap analysis:', pendingResult.sitemapAnalysis);
      console.log('🔗 PendingResult broken links count:', pendingResult.brokenLinksCount);
      console.log('🛡️ PendingResult security analysis:', pendingResult.securityAnalysis);
      console.log('🔍 PendingResult structure:', {
        hasExtra: !!pendingResult.extra,
        hasResult: !!pendingResult.result,
        hasSitemapAnalysis: !!pendingResult.sitemapAnalysis,
        hasSecurityAnalysis: !!pendingResult.securityAnalysis,
        brokenLinksCount: pendingResult.brokenLinksCount,
        securityScore: pendingResult.securityAnalysis?.securityScore || 'N/A',
        isHttps: pendingResult.securityAnalysis?.isHttps || 'N/A',
        securityIssuesCount: pendingResult.securityAnalysis?.securityIssues?.length || 0,
        productRecommendations: pendingResult.securityAnalysis?.productRecommendations?.length || 0,
        extraKeys: pendingResult.extra ? Object.keys(pendingResult.extra) : [],
        resultKeys: pendingResult.result ? Object.keys(pendingResult.result) : [],
        sitemapLinks: pendingResult.sitemapAnalysis?.totalLinks || 0
      });
    }
  }, [pendingResult]);

  // لاگ برای apiAnalysis
  useEffect(() => {
    if (apiAnalysis) {
      console.log('🔍 API Analysis structure:', {
        hasResult: !!apiAnalysis.result,
        hasExtra: !!apiAnalysis.result?.extra,
        hasAnalysisIssues: !!apiAnalysis.result?.extra?.analysisIssues,
        analysisIssuesCount: apiAnalysis.result?.extra?.analysisIssues?.length || 0,
        hasSitemapAnalysis: !!apiAnalysis.result?.extra?.sitemapAnalysis,
        sitemapLinks: apiAnalysis.result?.extra?.sitemapAnalysis?.totalLinks || 0,
        hasSecurityAnalysis: !!apiAnalysis.result?.extra?.securityAnalysis,
        securityScore: apiAnalysis.result?.extra?.securityAnalysis?.securityScore || 'N/A',
        isHttps: apiAnalysis.result?.extra?.securityAnalysis?.isHttps || 'N/A',
        brokenLinksCount: apiAnalysis.brokenLinksCount,
        hasBrokenLinksCount: typeof apiAnalysis.brokenLinksCount === 'number'
      });
    }
  }, [apiAnalysis]);

  // مدیریت وضعیت پیشرفت - بهبود یافته برای پشتیبانی از آنالیزهای موجود
  useEffect(() => {
    if (!apiAnalysis) {
      // اگر apiAnalysis نداریم اما آنالیز موجود داریم، وضعیت را تنظیم نکنیم
      if (!findExistingAnalysis) {
        setProgress(0);
        setAnalysisStatus("");
      }
      return;
    }

    if (apiAnalysis.id && apiAnalysis.id !== currentAnalysisId) {
      setCurrentAnalysisId(apiAnalysis.id);
      setAnalysisStarted(true);
      setResultsViewed(false);
      setIsDuplicateAnalysis(false);
    }

    switch (apiAnalysis.status) {
      case "pending":
        setProgress(20);
        setAnalysisStatus("🔄 درخواست آنالیز در صف قرار گرفت...");
        break;
      case "running":
        setProgress(60);
        setAnalysisStatus("📊 در حال آنالیز وبسایت...");
        break;
      case "completed":
        setProgress(100);
        setAnalysisStatus("✅ آنالیز کامل شد!");

        if (convertedResult) {
          setPendingResult(convertedResult);
          setShowSuccessAlert(true);
          setAnalysisStarted(false);
          setShowAnalysisModal(false);
          setCurrentAnalysisId(null);
          setIsDuplicateAnalysis(false);
          
          // اسکرول به نتایج پس از تکمیل آنالیز جدید
          setTimeout(() => {
            setResultsViewed(true);
          }, 500);
        }
        break;
      case "failed":
        setProgress(0);
        setAnalysisStatus("❌ آنالیز با خطا مواجه شد");
        setAnalysisStarted(false);
        setCurrentAnalysisId(null);
        setIsDuplicateAnalysis(false);
        break;
    }
  }, [apiAnalysis, convertedResult, currentAnalysisId, findExistingAnalysis]);

  // مدیریت زمان سپری شده
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (analysisStarted && (apiAnalysis?.status === 'pending' || apiAnalysis?.status === 'running')) {
      const startTime = Date.now();
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [analysisStarted, apiAnalysis?.status]);

  // انیمیشن نمرات
  useEffect(() => {
    if (!pendingResult) return;

    const intervalIds: NodeJS.Timeout[] = [];
    Object.entries(pendingResult.scores).forEach(([key, score]) => {
      if (score === undefined) return;
      let current = 0;
      const target = Math.round(score * 100);

      const id = setInterval(() => {
        current += 1;
        setAnimatedScores((prev) => ({ ...prev, [key]: current }));
        if (current >= target) clearInterval(id);
      }, 20);
      intervalIds.push(id);
    });

    return () => intervalIds.forEach(clearInterval);
  }, [pendingResult]);

  // اسکرول به بخش نتایج وقتی نمایش داده می‌شوند
  useEffect(() => {
    if (pendingResult && resultsViewed && resultsSectionRef.current) {
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [pendingResult, resultsViewed]);

  const startAnalysis = async (userData: { name: string; phoneNumber: string }) => {
    setAnalysisStarted(true);
    setAnalysisStatus("🔄 در حال ارسال درخواست آنالیز...");
    setPendingResult(null);
    setShowAnalysisModal(false);
    setResultsViewed(false);
    setIsDuplicateAnalysis(false);

    try {
      await hookStartAnalysis(url, userData);
    } catch (err) {
      setAnalysisStarted(false);
      setAnalysisStatus("");
      setCurrentAnalysisId(null);
    }
  };

  const handleAnalyzeClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
      resetError();
      return;
    }
    
    try { 
      new URL(url); 
    } catch { 
      resetError();
      return;
    }

    // بررسی وجود آنالیز قبلی - بهبود یافته
    const existingAnalysis = findExistingAnalysis;
    
    if (existingAnalysis) {
      console.log("🔍 Existing analysis found:", existingAnalysis.status);
      
      if (existingAnalysis.status === 'completed') {
        console.log("✅ استفاده از آنالیز موجود:", existingAnalysis.id);
        const convertedExisting = convertApiResultToAnalyzeResult(existingAnalysis);
        
        setPendingResult(convertedExisting);
        setShowSuccessAlert(false);
        setAnalysisStarted(false);
        setShowAnalysisModal(false);
        setResultsViewed(true);
        setIsDuplicateAnalysis(true);
        
        // اسکرول به نتایج
        setTimeout(() => {
          resultsSectionRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 300);
        return;
      } else {
        // Existing analysis but not completed (pending or running)
        console.log("⏳ آنالیز در حال انجام است:", existingAnalysis.id);
        // Set the current analysis id to let the hook poll for updates
        setCurrentAnalysisId(existingAnalysis.id);
        setAnalysisStarted(true);
        setShowAnalysisModal(false);
        setResultsViewed(false);
        setIsDuplicateAnalysis(false);
        return;
      }
    }
    
    // If no existing analysis, show the modal to start a new one
    console.log('🆕 No existing analysis found, showing modal');
    setShowAnalysisModal(true);
    setIsDuplicateAnalysis(false);
  };

  const handleCloseModal = () => {
    setShowAnalysisModal(false);
    if (!analysisStarted) {
      setAnalysisStatus("");
    }
  };

  // تابع برای مشاهده نتایج
  const handleViewResults = () => {
    setShowSuccessAlert(false);
    setResultsViewed(true);
  };

  // تابع برای شروع آنالیز جدید
  const handleNewAnalysis = () => {
    setPendingResult(null);
    setAnalysisStarted(false);
    setAnalysisStatus("");
    setProgress(0);
    setElapsedTime(0);
    setAnimatedScores({});
    setCurrentAnalysisId(null);
    setShowAnalysisModal(false);
    setShowSuccessAlert(false);
    setResultsViewed(false);
    setIsDuplicateAnalysis(false);
    setUrl("");
    resetError();
  };

  const showLoading = analysisStarted && !pendingResult;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* کامپوننت SEO */}
      <SEO {...seoProps} />

      <SuccessAlert
        isOpen={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        onViewResults={handleViewResults}
      />

      <AnalysisModal
        isOpen={showAnalysisModal && !analysisStarted}
        onClose={handleCloseModal}
        onStartAnalysis={startAnalysis}
        loading={loading}
      />

      <div className="w-full">
        <HeroSection 
          url={url} 
          setUrl={setUrl} 
          loading={loading && analysisStarted} 
          handleAnalyze={handleAnalyzeClick}
        />

        {hasExistingAnalysis && !pendingResult && url && !analysisStarted && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <span className="text-blue-600 text-sm sm:text-base">
                ✅ آنالیز قبلی برای این آدرس موجود است - برای مشاهده نتایج دکمه "آنالیز سایت" را بزنید
              </span>
            </div>
          </div>
        )}

        {isDuplicateAnalysis && pendingResult && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <span className="text-green-600 text-sm sm:text-base">
                ✅ در حال نمایش نتایج آنالیز قبلی - برای آنالیز جدید دکمه "آنالیز جدید" را بزنید
              </span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <ErrorDisplay error={error} />
          {showLoading && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <AnimatedLoading progress={progress} elapsedTime={elapsedTime} />
              {analysisStatus && (
                <div className="text-center px-2">
                  <div className="text-base sm:text-lg text-gray-700 mb-2">{analysisStatus}</div>
                  {elapsedTime > 0 && (
                    <div className="text-xs sm:text-sm text-gray-500">
                      زمان سپری شده: {elapsedTime} ثانیه
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* بخش نتایج - همیشه نمایش داده شود اگر pendingResult وجود دارد */}
          <div ref={resultsSectionRef}>
            {pendingResult && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 px-2 sm:px-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-right w-full sm:w-auto">نتایج آنالیز</h2>
                  {isDuplicateAnalysis && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm w-full sm:w-auto text-center">
                      🔄 نمایش از آنالیز قبلی
                    </div>
                  )}
                  {/* دکمه آنالیز جدید برای دسکتاپ */}
                  <div className="hidden lg:block">
                    <button
                      onClick={handleNewAnalysis}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                      🔄 آنالیز جدید
                    </button>
                  </div>
                </div>

                {/* Layout ریسپانسیو برای WebsiteOverview و ScoreGuide */}
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 px-2 sm:px-0">
                  <div className="w-full lg:w-9/12 order-2 lg:order-1">
                    <WebsiteOverview result={pendingResult} />
                  </div>
                  <div className="w-full lg:w-3/12 order-1 lg:order-2">
                    <ScoreGuide />
                  </div>
                </div>

                <AnalysisScores result={pendingResult} animatedScores={animatedScores} />
                
                {/* 🔥 ProductRecommendations با پشتیبانی کامل از brokenLinksCount و securityAnalysis */}
                <ProductRecommendations 
                  scores={pendingResult.scores} 
                  sitemapData={pendingResult.sitemapAnalysis}
                  isDuplicate={isDuplicateAnalysis}
                  brokenLinksCount={pendingResult.brokenLinksCount || 0}
                  securityAnalysis={pendingResult.securityAnalysis}
                />
                
                <CoreMetrics result={pendingResult} />
                
                {/* IssuesList همیشه نمایش داده شود */}
                <div className="mt-6 sm:mt-8 px-2 sm:px-0">
                  <IssuesList 
                    result={pendingResult} 
                    isDuplicate={isDuplicateAnalysis}
                  />
                </div>

                {/* دکمه آنالیز جدید برای موبایل */}
                <div className="lg:hidden px-4 pb-6">
                  <button
                    onClick={handleNewAnalysis}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    🔄 آنالیز جدید
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* نمایش HowItWorks فقط وقتی که هیچ آنالیزی در حال نمایش نیست */}
          {!pendingResult && !showLoading && !url && (
            <div className="px-2 sm:px-0">
              <HowItWorks />
            </div>
          )}
        </div>
      </div>
      <GlobalStyles />
    </div>
  );
}