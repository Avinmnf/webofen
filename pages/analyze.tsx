"use client";

import { useState, useEffect, useMemo } from "react";
import { useProducts } from "@/hooks/useproduct";
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
import { ExistingAnalysisChecker } from "@/components/ExistingAnalysisChecker";

// Import types
import { AnalyzeResult, Analysis } from "@/lib/models/analyze";

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

// کامپوننت برای نمایش تمام آنالیزها
const AllAnalysesSection: React.FC<{ analyses: Analysis[] }> = ({ analyses }) => {
  const getScoreColor = (score: number | undefined): string => {
    if (score === undefined) return 'text-gray-600 bg-gray-100';
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const renderScore = (score: number | undefined): string => {
    return score !== undefined ? `${score}%` : '--';
  };

  const getStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'pending': 'در انتظار',
      'running': 'در حال انجام',
      'completed': 'تکمیل شده',
      'failed': 'ناموفق'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      'completed': 'bg-green-100 text-green-800',
      'running': 'bg-blue-100 text-blue-800',
      'failed': 'bg-red-100 text-red-800',
      'pending': 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">تمامی آنالیزهای انجام شده</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {analyses.map((analysis: Analysis) => (
          <div key={analysis.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow">
            {/* اطلاعات اصلی */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 
                  className="text-base lg:text-lg font-semibold text-gray-800 truncate flex-1"
                  title={analysis.url}
                >
                  {analysis.url}
                </h3>
              </div>
              
              {(analysis.name || analysis.phoneNumber) && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {analysis.name && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      👤 {analysis.name}
                    </span>
                  )}
                  {analysis.phoneNumber && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                      📞 {analysis.phoneNumber}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>تاریخ: {formatDate(analysis.createdAt)}</span>
                <span className={`px-2 py-1 rounded-full ${getStatusColor(analysis.status)}`}>
                  {getStatusText(analysis.status)}
                </span>
              </div>
            </div>

            {/* امتیازات */}
            {analysis.status === 'completed' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                    کارایی
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(analysis.performance)}`}>
                    {renderScore(analysis.performance)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                    دسترسی‌پذیری
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(analysis.accessibility)}`}>
                    {renderScore(analysis.accessibility)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>
                    بهترین روش‌ها
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(analysis.bestPractices)}`}>
                    {renderScore(analysis.bestPractices)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full ml-2"></span>
                    سئو
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(analysis.seo)}`}>
                    {renderScore(analysis.seo)}
                  </span>
                </div>
              </div>
            )}

            {analysis.status === 'running' && (
              <div className="flex justify-center items-center py-4">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  <span className="text-sm text-gray-600">در حال آنالیز...</span>
                </div>
              </div>
            )}

            {analysis.status === 'pending' && (
              <div className="flex justify-center items-center py-4">
                <span className="text-sm text-gray-500">در صف انتظار</span>
              </div>
            )}

            {analysis.status === 'failed' && (
              <div className="flex justify-center items-center py-4">
                <span className="text-sm text-red-500">آنالیز ناموفق بود</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {analyses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <p className="text-gray-500 text-lg">هیچ آنالیز یافت نشد.</p>
          <p className="text-gray-400 text-sm mt-2">اولین آنالیز را ایجاد کنید تا نتایج اینجا نمایش داده شوند.</p>
        </div>
      )}
    </div>
  );
};

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
  const [shouldCheckExisting, setShouldCheckExisting] = useState<boolean>(false);

  // هوک آنالیز - فقط از useAnalyses استفاده می‌کنیم
  const { analyses: allAnalyses, analysis: apiAnalysis, loading, error, startAnalysis: hookStartAnalysis, resetError } = useAnalyses();

  // memo برای جلوگیری از reference جدید آبجکت
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
          setShouldCheckExisting(false);
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


  const startAnalysis = async (userData: { name: string; phoneNumber: string }) => {
    console.log("🔹 User clicked start analysis:", url, userData);
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
    setShouldCheckExisting(true);
  };

  const handleCloseModal = () => {
    if (!loading) setShowAnalysisModal(false);
  };

  const handleExistingResultFound = (existingResult: AnalyzeResult) => {
    setPendingResult(existingResult);
    setShouldCheckExisting(false);
  };

  const handleNoExistingResult = () => {
    setShowAnalysisModal(true);
    setShouldCheckExisting(false);
  };

  const handleCheckError = () => setShouldCheckExisting(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <SuccessAlert
        isOpen={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        onViewResults={() => setShowSuccessAlert(false)}
      />

      {shouldCheckExisting && (
        <ExistingAnalysisChecker
          url={url}
          onExistingResultFound={handleExistingResultFound}
          onNoExistingResult={handleNoExistingResult}
          onError={handleCheckError}
        />
      )}

      <AnalysisModal
        isOpen={showAnalysisModal && !analysisStarted}
        onClose={handleCloseModal}
        onStartAnalysis={startAnalysis}
        loading={loading}
      />

      <div className="w-full">
        <HeroSection url={url} setUrl={setUrl} loading={loading} handleAnalyze={handleAnalyzeClick} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorDisplay error={error} />

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

          {/* نمایش تمام آنالیزها */}
          {allAnalyses.length > 0 && (
            <AllAnalysesSection analyses={allAnalyses} />
          )}

          {!pendingResult && !loading && !shouldCheckExisting && <HowItWorks />}
        </div>
      </div>

      <GlobalStyles />
    </div>
  );
}