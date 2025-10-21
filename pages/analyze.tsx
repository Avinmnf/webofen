"use client";

import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useProducts } from "@/hooks/useproduct";
import Link from "next/link";

// Import components
import { LoadingSteps } from "@/components/LoadingSteps";
import { EncouragementMessages } from "@/components/EncouragementMessages";
import { ProgressWithTime } from "@/components/ProgressWithTime";
import { AnimatedLoading } from "@/components/AnimatedLoading";
import { MetricChart } from "@/components/MetricChart";
import { AnimatedScoreCard } from "@/components/AnimatedScoreCard";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { WaveBackground } from "@/components/WaveBackground";
import { HeroSection } from "@/components/HeroSection";


// Import types
import { AnalyzeResult } from "@/lib/models/analyze";
import { Issue } from "@/lib/models/analyze";
import { tabLabels } from "@/lib/models/analyze";
import { scoreDescriptions } from "@/lib/models/analyze";

export default function AnalyzePage() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  const analyzeUrl = process.env.NEXT_PUBLIC_ANALYZE_URL || "http://localhost:4000";
  
  const groupedIssues = result
    ? result.issues.reduce<Record<string, Issue[]>>((acc: Record<string, Issue[]>, issue: Issue) => {
        const key = issue.impact || "other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(issue);
        return acc;
      }, {})
    : {};

  const tabs = result ? ["all", ...Object.keys(groupedIssues)] : [];

  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setProgress(0);
    setElapsedTime(0);

    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const minLoadingTime = new Promise<void>((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, Math.floor((elapsed / 30000) * 100));
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    try {
      const response = await fetch(`${analyzeUrl}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`خطا در آنالیز سایت: ${response.status} - ${text}`);
      }

      const data = await response.json();
      await minLoadingTime;
      setResult(data);
    } catch (err: any) {
      console.error("Error analyzing site:", err);
      setError(err.message || "خطایی در ارتباط با سرور آنالایزر رخ داد");
    } finally {
      setLoading(false);
      setProgress(100);
      clearInterval(timeInterval);
    }
  };
  
  useEffect(() => {
    if (!result) return;
    const intervalIds: NodeJS.Timeout[] = [];

    Object.entries(result.scores).forEach(([key, score]) => {
      if (score === undefined) return;
      let current = 0;
      const target = Math.round((score || 0) * 100);

      const id = setInterval(() => {
        current += 1;
        setAnimatedScores(prev => ({ ...prev, [key]: current }));
        if (current >= target) clearInterval(id);
      }, 20);
      intervalIds.push(id);
    });

    return () => intervalIds.forEach(id => clearInterval(id));
  }, [result]);

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "critical":
        return "bg-red-50 border-red-400 text-red-800";
      case "serious":
        return "bg-orange-50 border-orange-400 text-orange-800";
      case "moderate":
        return "bg-yellow-50 border-yellow-400 text-yellow-800";
      case "minor":
        return "bg-blue-50 border-blue-400 text-blue-800";
      default:
        return "bg-gray-50 border-gray-400 text-gray-800";
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "serious":
        return "bg-orange-100 text-orange-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "minor":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="w-full">
        <HeroSection url={url} setUrl={setUrl} loading={loading} handleAnalyze={handleAnalyze} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && <AnimatedLoading progress={progress} elapsedTime={elapsedTime} />}

          {result && (
            <div className="space-y-8 animate-fade-in">
              {/* اطلاعات کلی */}
              <div className="flex flex-wrap -mx-4">
                <div className="w-full lg:w-9/12 px-4">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up">
                    <h2 className="font-bold text-2xl text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      اطلاعات کلی وبسایت
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl border border-blue-100 transition-all hover:shadow-md">
                        <div className="bg-blue-100 p-3 rounded-lg ml-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">آدرس وبسایت</p>
                          <p className="font-semibold text-gray-800 truncate">{result.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl border border-blue-100 transition-all hover:shadow-md">
                        <div className="bg-blue-100 p-3 rounded-lg ml-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-500 font-medium">عنوان صفحه</p>
                            <p className="font-semibold text-gray-800 line-clamp-2">{result.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-3/12 px-4 mt-4 lg:mt-0">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-2xl p-6 h-auto sticky top-6 border border-blue-100 animate-slide-up" style={{animationDelay: '0.1s'}}>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      راهنمای امتیاز ها
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 ml-2"></div>
                        <span>امتیاز بالای 90%: عالی</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 ml-2"></div>
                        <span>امتیاز 70% تا 90%: خوب</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 ml-2"></div>
                        <span>امتیاز 50% تا 70%: متوسط</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 ml-2"></div>
                        <span>امتیاز زیر 50%: نیاز به بهبود</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* کارت‌های امتیاز */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <h2 className="font-bold text-2xl text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  امتیاز های آنالیز
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(result.scores).map(([key, score], index) => {
                    if (score === undefined) return null;
                    
                    const labels: Record<string, string> = {
                      performance: "عملکرد",
                      accessibility: "دسترسی",
                      bestPractices: "بهترین روش‌ ها",
                      seo: "سئو"
                    };

                    return (
                      <div 
                        key={key} 
                        className="animate-fade-in" 
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <AnimatedScoreCard
                          score={score}
                          label={labels[key] || key}
                          description={scoreDescriptions[key] || ""}
                          animatedValue={animatedScores[key] || 0}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <ProductRecommendations scores={result.scores} />

              {/* Core Web Vitals */}
              {result.metrics && Object.keys(result.metrics).length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.4s'}}>
                  <h2 className="font-bold text-2xl text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    علائم حیاتی وبسایت
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(result.metrics).map(([key, value], index) => {
                      const labels: Record<string, string> = {
                        FCP: "اولین نمایش محتوا",
                        LCP: "بزرگ ترین نمایش محتوا",
                        TBT: "مسدود سازی کل",
                        CLS: "تغییر چیدمان تجمعی",
                        SI: "سرعت نشانگر"
                      };
                      
                      

                      return (
                        <div 
                          key={key} 
                          className="animate-fade-in p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center justify-center text-center"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <span className="text-3xl font-bold text-gray-800">{value}</span>
                          <span className="text-sm text-gray-500">{labels[key] || key}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Issues / Alerts با تب */}
              {result.issues && result.issues.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.5s'}}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 pb-4 border-b border-gray-100">
                    <h2 className="font-bold text-2xl text-gray-800 flex items-center mb-4 lg:mb-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      لیست خطا های وبسایت
                    </h2>
                    
                    <div className="flex gap-2 flex-wrap">
                      {tabs.map((tab, index) => {
                        const count = tab === "all" 
                          ? result.issues.length 
                          : (groupedIssues[tab] || []).length;
                        
                        return (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg flex items-center transition-all ${activeTab === tab
                              ? "bg-red-100 text-red-700 font-medium shadow-sm transform scale-105"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } animate-fade-in`}
                            style={{animationDelay: `${index * 0.05}s`}}
                          >
                            {tabLabels[tab] || tab}
                            <span className={`mr-1 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-red-200" : "bg-gray-300"}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(activeTab === "all"
                      ? result.issues
                      : groupedIssues[activeTab] || []
                    ).map((issue: Issue, idx: number) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-xl border-l-4 ${getImpactColor(issue.impact)} transition-all hover:shadow-sm animate-fade-in-up`}
                        style={{animationDelay: `${idx * 0.05}s`}}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <p className="font-medium text-lg">{issue.title}</p>
                            </div>
                            <p className="text-gray-700 mt-2 pr-7">{issue.description}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactBadgeColor(issue.impact)} transform transition-transform hover:scale-105`}>
                            {issue.impact}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.issues && result.issues.length === 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
                  <div className="text-center py-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xl font-medium">هیچ خطایی یافت نشد</p>
                    <p className="mt-2">عالی! وبسایت شما هیچ مشکلی ندارد.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div className="max-w-4xl mx-auto py-12">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">چگونه آنالیز کار می‌ کند؟</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">ابزار آنالیز ما بیش از ۵۰ پارامتر مختلف را بررسی می‌کند تا گزارش کاملی از وضعیت وبسایت شما ارائه دهد</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: "بررسی عملکرد",
                    description: "سرعت لود، بهینه‌سازی تصاویر و رندرینگ صفحه را تحلیل می‌کند",
                    color: "blue",
                    delay: "0s"
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ),
                    title: "آنالیز سئو", 
                    description: "ساختار سایت، متا تگ‌ها، سرعت و بهینه‌سازی موتورهای جستجو",
                    color: "green",
                    delay: "0.1s"
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ),
                    title: "بررسی امنیت",
                    description: "HTTPS، هدرهای امنیتی و آسیب‌پذیری‌های احتمالی را بررسی می‌کند", 
                    color: "blue",
                    delay: "0.2s"
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in-up hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    style={{animationDelay: item.delay}}
                  >
                    <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from { 
            transform: translateY(30px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from { 
            transform: scale(0.9);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-pulse { animation: pulse 2s infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 8s linear infinite; }
        .animate-shine { animation: shine 2s infinite; }
      `}</style>
    </div>
  );
}