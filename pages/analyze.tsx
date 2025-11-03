"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useproduct";

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
import { ExistingAnalysisChecker } from "@/components/ExistingAnalysisChecker";

// Import types
import { AnalyzeResult } from "@/lib/models/analyze";
import { Issue } from "@/lib/models/analyze";

// تعریف interface برای response API
interface ApiAnalysisResult {
  id: string;
  url: string;
  status: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  createdAt: string;
  result?: any;
  privateData?: any;
}

// base URL برای سرویس آنالیز
const ANALYZE_URL = process.env.ANALYZE_URL || 'http://localhost:4000';

export default function AnalyzePage() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [pendingResult, setPendingResult] = useState<AnalyzeResult | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string>("");
  
  // حالت‌های جدید برای مدیریت مودال
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{ name: string; phoneNumber: string } | null>(null);
  const [analysisStarted, setAnalysisStarted] = useState<boolean>(false);
  const [shouldCheckExisting, setShouldCheckExisting] = useState<boolean>(false);

  // تابع برای تبدیل ApiAnalysisResult به AnalyzeResult
  const convertApiResultToAnalyzeResult = (apiResult: ApiAnalysisResult): AnalyzeResult => {
    return {
      url: apiResult.url,
      title: apiResult.result?.title || apiResult.result?.metaTitle || "بدون عنوان",
      scores: {
        performance: apiResult.performance / 100,
        accessibility: apiResult.accessibility / 100,
        bestPractices: apiResult.bestPractices / 100,
        seo: apiResult.seo / 100,
      },
      issues: apiResult.privateData || apiResult.result?.issues || [],
      metrics: apiResult.result?.metrics || {},
    };
  };

  // تابع fetch با مدیریت خطا
  const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        }
      });
      clearTimeout(id);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  // تابع اصلی برای شروع آنالیز
  const startAnalysis = async (userData: { name: string; phoneNumber: string }) => {
    if (!url) return setError("لطفاً URL را وارد کنید");

    // اعتبارسنجی URL
    try {
      new URL(url);
    } catch {
      return setError("لطفاً یک URL معتبر وارد کنید");
    }

    console.log('🔍 Debug - Starting analysis with:', {
      url,
      userData,
      ANALYZE_URL
    });

    setUserInfo(userData);
    setError(null);
    setProgress(0);
    setElapsedTime(0);
    setLoading(true);
    setResult(null);
    setAnalysisStatus("🔄 در حال ارسال درخواست آنالیز...");
    setAnalysisStarted(true);

    try {
      // ارسال درخواست به سرویس آنالیز همراه با اطلاعات کاربر
      setProgress(20);
      
      const requestBody = {
        url,
        userInfo: userData
      };

      console.log('📤 Debug - Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetchWithTimeout(`${ANALYZE_URL}/analyze`, {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Debug - Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Debug - Server error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Debug - Success response:', data);
      
      if (!data.success) {
        throw new Error(data.error || "خطا در شروع آنالیز");
      }

      const analysisId = data.analysisId;
      
      setAnalysisStatus("✅ درخواست آنالیز ثبت شد. در حال پردازش...");
      setProgress(40);

      const startTime = Date.now();
      const timeInterval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // شروع polling برای بررسی وضعیت
      const checkInterval = 3000;
      const maxRetries = 60;
      let retries = 0;

      const pollAnalysisStatus = async () => {
        try {
          retries++;
          
          const statusResponse = await fetchWithTimeout(
            `${ANALYZE_URL}/analysis/${analysisId}?t=${Date.now()}`
          );
          
          if (!statusResponse.ok) {
            throw new Error(`Status check failed: ${statusResponse.status}`);
          }
          
          const statusData: ApiAnalysisResult = await statusResponse.json();
          console.log('🔄 Debug - Polling status:', statusData.status);

          if (statusData.status === "running") {
            setAnalysisStatus("📊 در حال آنالیز وبسایت...");
            setProgress(60);
          } else if (statusData.status === "completed") {
            clearInterval(intervalId);
            clearInterval(timeInterval);
            
            setAnalysisStatus("✅ آنالیز کامل شد!");
            setProgress(100);
            
            const analyzeResult = convertApiResultToAnalyzeResult(statusData);
            
            // ذخیره نتیجه و نمایش SuccessAlert
            setPendingResult(analyzeResult);
            setLoading(false);
            setAnalysisStatus("");
            setAnalysisStarted(false);
            setShowSuccessAlert(true);
            
            return;
          } else if (statusData.status === "failed") {
            clearInterval(intervalId);
            clearInterval(timeInterval);
            throw new Error("آنالیز با خطا مواجه شد");
          }

          if (retries >= maxRetries) {
            clearInterval(intervalId);
            clearInterval(timeInterval);
            throw new Error("زمان آنالیز بیش از حد طول کشید");
          }

        } catch (error) {
          console.error('Error polling analysis status:', error);
        }
      };

      const intervalId = setInterval(pollAnalysisStatus, checkInterval);
      pollAnalysisStatus();

    } catch (err: any) {
      console.error('❌ Analysis error:', err);
      setLoading(false);
      setAnalysisStatus("");
      setAnalysisStarted(false);
      
      if (err.name === 'AbortError') {
        setError("اتصال به سرور آنالیز timeout خورد");
      } else {
        setError(err.message || "خطایی در ارتباط با سرور آنالیز رخ داد");
      }
    }
  };

  // تابع جدید برای مدیریت کلیک روی دکمه شروع آنالیز
  const handleAnalyzeClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) {
      setError("لطفاً URL را وارد کنید");
      return;
    }

    // اعتبارسنجی URL
    try {
      new URL(url);
    } catch {
      setError("لطفاً یک URL معتبر وارد کنید");
      return;
    }

    // فعال کردن بررسی آنالیزهای موجود
    setShouldCheckExisting(true);
  };

  // تابع برای بستن مودال
  const handleCloseModal = () => {
    if (!loading) {
      setShowAnalysisModal(false);
    }
  };

  // تابع برای زمانی که آنالیز موجود پیدا شود
  const handleExistingResultFound = (existingResult: AnalyzeResult) => {
    console.log('✅ Showing existing analysis result');
    setResult(existingResult);
    setShouldCheckExisting(false);
  };

  // تابع برای زمانی که آنالیز موجود پیدا نشود
  const handleNoExistingResult = () => {
    console.log('📝 No existing analysis found, showing modal');
    setShowAnalysisModal(true);
    setShouldCheckExisting(false);
  };

  // تابع برای مدیریت خطاها
  const handleCheckError = (error: string) => {
    setError(error);
    setShouldCheckExisting(false);
  };

  // بستن مودال وقتی آنالیز شروع می‌شود
  useEffect(() => {
    if (analysisStarted && showAnalysisModal) {
      setShowAnalysisModal(false);
    }
  }, [analysisStarted, showAnalysisModal]);

  // Animated scores
  useEffect(() => {
    if (!result) return;
    const intervalIds: NodeJS.Timeout[] = [];

    Object.entries(result.scores).forEach(([key, score]) => {
      if (score === undefined) return;
      let current = 0;
      const target = Math.round((score || 0) * 100);

      const id = setInterval(() => {
        current += 1;
        setAnimatedScores((prev) => ({ ...prev, [key]: current }));
        if (current >= target) clearInterval(id);
      }, 20);
      intervalIds.push(id);
    });

    return () => intervalIds.forEach((id) => clearInterval(id));
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* SuccessAlert - نمایش پیام موفقیت */}
      <SuccessAlert
        isOpen={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        onViewResults={() => {
          setShowSuccessAlert(false);
          if (pendingResult) {
            setResult(pendingResult);
            setPendingResult(null);
          }
        }}
      />

      {/* کامپوننت بررسی آنالیزهای موجود */}
      {shouldCheckExisting && (
        <ExistingAnalysisChecker
          url={url}
          onExistingResultFound={handleExistingResultFound}
          onNoExistingResult={handleNoExistingResult}
          onError={handleCheckError}
        />
      )}

      {/* مودال دریافت اطلاعات کاربر */}
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
          loading={loading} 
          handleAnalyze={handleAnalyzeClick} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorDisplay error={error} />
          
          {loading && (
            <div className="space-y-6 animate-fade-in">
              <AnimatedLoading progress={progress} elapsedTime={elapsedTime} />
              {analysisStatus && (
                <div className="text-center text-lg text-gray-700">
                  {analysisStatus}
                </div>
              )}
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full lg:w-9/12 px-4 mt-4 lg:mt-0">
                  <WebsiteOverview result={result} />
                </div>
                <div className="w-full lg:w-3/12 px-4">
                  <ScoreGuide />
                </div>
              </div>

              <AnalysisScores result={result} animatedScores={animatedScores} />
              <ProductRecommendations scores={result.scores} />
              <CoreMetrics result={result} />
              <IssuesList result={result} />
            </div>
          )}

          {!result && !loading && !shouldCheckExisting && (
            <HowItWorks />
          )}
        </div>
      </div>

      <GlobalStyles />
    </div>
  );
}