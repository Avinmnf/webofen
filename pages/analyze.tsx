"use client";

import { useState, useEffect, useMemo } from "react";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";

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

// Import types
import { AnalyzeResult } from "@/lib/models/analyze";

// تبدیل API result به AnalyzeResult
const convertApiResultToAnalyzeResult = (apiResult: any): AnalyzeResult => ({
  url: apiResult.url,
  title: apiResult.result?.title || apiResult.result?.metaTitle || "بدون عنوان",
  scores: {
    performance: (apiResult.performance || 0) / 100,
    accessibility: (apiResult.accessibility || 0) / 100,
    bestPractices: (apiResult.bestPractices || 0) / 100,
    seo: (apiResult.seo || 0) / 100,
  },
  issues: apiResult.privateData || apiResult.result?.issues || [],
  metrics: apiResult.result?.metrics || {},
});

export default function AnalyzePage() {
  const [url, setUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [pendingResult, setPendingResult] = useState<AnalyzeResult | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string>("");
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);
  const [analysisStarted, setAnalysisStarted] = useState<boolean>(false);

  const { analysis: apiAnalysis, loading, error, startAnalysis: hookStartAnalysis, resetError } = useWebsiteAnalysis();

  const convertedResult = useMemo(() => (apiAnalysis ? convertApiResultToAnalyzeResult(apiAnalysis) : null), [apiAnalysis]);

  // مدیریت وضعیت پیشرفت
  useEffect(() => {
    if (!apiAnalysis) {
      setProgress(0);
      setAnalysisStatus("");
      return;
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
        }
        break;
      case "failed":
        setProgress(0);
        setAnalysisStatus("❌ آنالیز با خطا مواجه شد");
        setAnalysisStarted(false);
        break;
        
    }
  }, [apiAnalysis, convertedResult]);
  console.log('🔄 Changing analysis status to:', apiAnalysis.status);


  // مدیریت زمان سپری شده هنگام آنالیز
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (loading && analysisStarted) {
      const startTime = Date.now();
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [loading, analysisStarted]);

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

  // شروع آنالیز
  const startAnalysis = async (userData: { name: string; phoneNumber: string }) => {
    console.log("🔹 User clicked start analysis:", url, userData);
    console.log("✅ Analysis request sent successfully");

    setAnalysisStarted(true);
    setAnalysisStatus("🔄 در حال ارسال درخواست آنالیز...");

    try {
      await hookStartAnalysis(url, userData);
      console.log("✅ Analysis request sent successfully");
    } catch (err) {
      console.error("❌ Analysis error:", err);
      setAnalysisStarted(false);
      setAnalysisStatus("");
    }
  };

  // مدیریت دکمه آنالیز
  const handleAnalyzeClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return resetError();
    try {
      new URL(url);
    } catch {
      return resetError();
    }
    setShowAnalysisModal(true);
  };

  const handleCloseModal = () => {
    if (!loading) setShowAnalysisModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <SuccessAlert
        isOpen={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        onViewResults={() => setShowSuccessAlert(false)}
      />

      <AnalysisModal
        isOpen={showAnalysisModal && !analysisStarted}
        onClose={handleCloseModal}
        onStartAnalysis={startAnalysis}
        loading={loading}
      />

      <div className="w-full">
        <HeroSection url={url} setUrl={setUrl} loading={loading} handleAnalyze={handleAnalyzeClick} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorDisplay error={error || 'خطایی در پردازش درخواست پیش آمده است.'} />


          {loading && (
            <div className="space-y-6 animate-fade-in">
              <AnimatedLoading progress={progress} elapsedTime={elapsedTime} />
              {analysisStatus && <div className="text-center text-lg text-gray-700">{analysisStatus}</div>}
            </div>
          )}

          {pendingResult && (
            <div className="space-y-8 animate-fade-in">
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
              <IssuesList result={pendingResult} />
            </div>
          )}

          {!pendingResult && !loading && <HowItWorks />}
        </div>
      </div>

      <GlobalStyles />
    </div>
  );
}
