// components/ExistingAnalysisChecker.tsx
"use client";

import { useEffect, useState } from "react";
import { AnalyzeResult } from "@/lib/models/analyze";

interface ExistingAnalysisCheckerProps {
  url: string;
  onExistingResultFound: (result: AnalyzeResult) => void;
  onNoExistingResult: () => void;
  onError: () => void;
}

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

export function ExistingAnalysisChecker({
  url,
  onExistingResultFound,
  onNoExistingResult,
  onError,
}: ExistingAnalysisCheckerProps) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkExistingAnalysis = async () => {
      try {
        console.log("🔍 Checking existing analysis for:", url);
        
        // از endpoint /analytics/recent استفاده می‌کنیم و فیلتر می‌کنیم
        const response = await fetch('http://localhost:4000/analytics/recent?limit=5');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const analyses = await response.json();
        console.log("📊 Found analyses:", analyses.length);
        
        // جستجو در بین آنالیزهای موجود
        const existingAnalysis = analyses.find((analysis: any) => 
          analysis.url === url && analysis.status === 'completed'
        );
        
        if (existingAnalysis) {
          console.log("✅ Found existing analysis:", existingAnalysis.id);
          const existingResult = convertApiResultToAnalyzeResult(existingAnalysis);
          onExistingResultFound(existingResult);
        } else {
          console.log("❌ No existing analysis found");
          onNoExistingResult();
        }
      } catch (error) {
        console.error("❌ Error checking existing analysis:", error);
        onError();
      } finally {
        setChecking(false);
      }
    };

    checkExistingAnalysis();
  }, [url, onExistingResultFound, onNoExistingResult, onError]);

  if (checking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center text-gray-700">در حال بررسی آنالیزهای موجود...</p>
        </div>
      </div>
    );
  }

  return null;
}