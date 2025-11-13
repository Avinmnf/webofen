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

// تبدیل API result به AnalyzeResult
const convertApiResultToAnalyzeResult = (apiResult: any): AnalyzeResult => {
  console.log('🔄 Converting API result to AnalyzeResult...', apiResult);
  
  // استخراج issues از مسیرهای مختلف برای اطمینان
  let issues = [];
  if (apiResult.result?.issues) {
    issues = apiResult.result.issues;
  } else if (apiResult.issues) {
    issues = apiResult.issues;
  } else if (apiResult.privateData) {
    issues = apiResult.privateData;
  }

  const result: AnalyzeResult = {
    url: apiResult.url,
    title: apiResult.result?.title || apiResult.result?.metaTitle || apiResult.title || "بدون عنوان",
    scores: { 
      performance: (apiResult.performance || 0) / 100,
      accessibility: (apiResult.accessibility || 0) / 100,
      bestPractices: (apiResult.bestPractices || 0) / 100,
      seo: (apiResult.seo || 0) / 100,
    },
    issues: issues,
    metrics: apiResult.result?.metrics || apiResult.metrics || {},
  };

  // اضافه کردن extra اگر وجود دارد
  if (apiResult.result?.extra) {
    result.extra = apiResult.result.extra;
  } else if (apiResult.extra) {
    result.extra = apiResult.extra;
  }

  console.log('✅ Converted result with issues:', result.issues.length);
  return result;
};

// تابع برای نرمالایز کردن URL
const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // حذف پروتکل، www و اسلش انتها
    let normalized = urlObj.hostname.replace(/^www\./, '') + urlObj.pathname;
    normalized = normalized.replace(/\/$/, ''); // حذف اسلش انتها
    return normalized.toLowerCase();
  } catch {
    return url.toLowerCase().replace(/^www\./, '').replace(/\/$/, '');
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
      console.log('✅ Found existing analysis:', existing.id);
    } else {
      console.log('❌ No existing analysis found');
    }
    
    return existing || null;
  }, [url, allAnalyses]);

  // بررسی وجود آنالیز تکراری
  const hasExistingAnalysis = useMemo(() => {
    return !!findExistingAnalysis;
  }, [findExistingAnalysis]);

  // SEO Props با useMemo برای بهینه‌سازی
  const seoProps = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_WEBOFEN || "https://webofen.com/";
    const currentUrl = typeof window !== "undefined" ? window.location.href : `${baseUrl}${router.asPath}`;
    
    if (pendingResult) {
      const seoScore = Math.round((pendingResult.scores.seo || 0) * 100);
      const performanceScore = Math.round((pendingResult.scores.performance || 0) * 100);
      const accessibilityScore = Math.round((pendingResult.scores.accessibility || 0) * 100);
      const bestPracticesScore = Math.round((pendingResult.scores.bestPractices || 0) * 100);
      
      return {
        title: `نتایج آنالیز ${pendingResult.title || url} | وبوفن`,
        description: `آنالیز کامل سایت ${url} - سئو: ${seoScore}% | عملکرد: ${performanceScore}% | دسترسی: ${accessibilityScore}% | بهترین روش‌ها: ${bestPracticesScore}%`,
        keywords: `آنالیز سایت, سئو, عملکرد, دسترسی, بهترین روش‌ها, ${url}, بهینه سازی, وبوفن`,
        canonical: currentUrl,
      
        ogType: "website" as const,
        tags: ["آنالیز سایت", "سئو", "عملکرد", "دسترسی", "بهترین روش‌ها", "بهینه سازی"],
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
      keywords: "آنالیز سایت, سئو, عملکرد, بهینه سازی, سرعت سایت, امنیت سایت, دسترسی پذیری, بهترین روش‌ها, وبوفن",
      canonical: currentUrl,
      ogImage: undefined,
      ogType: "website" as const,
      tags: ["آنالیز سایت", "سئو", "عملکرد", "بهینه سازی", "سرعت سایت", "امنیت"],
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

  // دیباگ برای ردیابی issues
  useEffect(() => {
    if (pendingResult) {
      console.log('📋 PendingResult issues:', pendingResult.issues);
      console.log('📊 PendingResult issues count:', pendingResult.issues.length);
    }
  }, [pendingResult]);

  // مدیریت وضعیت پیشرفت
  useEffect(() => {
    if (!apiAnalysis) {
      setProgress(0);
      setAnalysisStatus("");
      return;
    }

    if (apiAnalysis.id && apiAnalysis.id !== currentAnalysisId) {
      setCurrentAnalysisId(apiAnalysis.id);
      setAnalysisStarted(true);
      setResultsViewed(false);
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
        }
        break;
      case "failed":
        setProgress(0);
        setAnalysisStatus("❌ آنالیز با خطا مواجه شد");
        setAnalysisStarted(false);
        setCurrentAnalysisId(null);
        break;
    }
  }, [apiAnalysis, convertedResult, currentAnalysisId]);

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
    
    if (existingAnalysis && existingAnalysis.status === 'completed') {
      console.log("✅ استفاده از آنالیز موجود:", existingAnalysis.id);
      const convertedExisting = convertApiResultToAnalyzeResult(existingAnalysis);
      console.log('📦 Converted existing analysis issues:', convertedExisting.issues);
      
      setPendingResult(convertedExisting);
      setShowSuccessAlert(false); // مستقیماً نمایش بده بدون آلرت
      setAnalysisStarted(false);
      setShowAnalysisModal(false);
      setResultsViewed(true);
      return;
    }
    
    // اگر آنالیز موجود نبود، مدال را نمایش بده
    console.log('🆕 No existing analysis found, showing modal');
    setShowAnalysisModal(true);
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

        {hasExistingAnalysis && !pendingResult && url && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <span className="text-green-600">✅ آنالیز قبلی برای این آدرس موجود است - نتایج در حال نمایش</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorDisplay error={error} />

          {showLoading && (
            <div className="space-y-6 animate-fade-in">
              <AnimatedLoading progress={progress} elapsedTime={elapsedTime} />
              {analysisStatus && (
                <div className="text-center">
                  <div className="text-lg text-gray-700 mb-2">{analysisStatus}</div>
                  {elapsedTime > 0 && (
                    <div className="text-sm text-gray-500">
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
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">نتایج آنالیز</h2>
                  {hasExistingAnalysis && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      🔄 نمایش از آنالیز قبلی
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap -mx-4">
                  <div className="w-full lg:w-9/12 px-4 mt-4 lg:mt-0">
                    <WebsiteOverview result={pendingResult} />
                  </div>
                  <div className="w-full lg:w-3/12 px-4">
                    <ScoreGuide />
                  </div>
                </div>

                <AnalysisScores result={pendingResult} animatedScores={animatedScores} />
                <ProductRecommendations scores={pendingResult.scores} />
                <CoreMetrics result={pendingResult} />
                
                {/* IssuesList همیشه نمایش داده شود */}
                <div className="mt-8">
                  <IssuesList result={pendingResult} />
                </div>

                {/* دکمه برای آنالیز جدید */}
                <div className="text-center mt-8">
                  <button
                    onClick={handleNewAnalysis}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    🔄 آنالیز جدید
                  </button>
                </div>
              </div>
            )}
          </div>

          {!pendingResult && !showLoading && !url && <HowItWorks />}
        </div>
      </div>

      <GlobalStyles />
    </div>
  );
}