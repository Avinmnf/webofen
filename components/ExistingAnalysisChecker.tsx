"use client";

import { useEffect, useState } from "react";
import { AnalyzeResult } from "@/lib/models/analyze";
import { useAnalyses } from "@/hooks/useAnalyses";

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
}: any) {
  const { analyses, loading } = useAnalyses();
  const [checking, setChecking] = useState(true);

  const normalize = (u: string) =>
    u.replace(/\/$/, "").toLowerCase();

  useEffect(() => {
    // ⛔ تا وقتی داده لود نشده، هیچ کاری نکن
    if (loading) return;

    const existing = analyses
      .filter((a: any) => a.status === "completed")
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .find((a: any) => normalize(a.url) === normalize(url));

    if (existing) {
      onExistingResultFound(convertApiResultToAnalyzeResult(existing));
    } else {
      onNoExistingResult();
    }

    setChecking(false);
  }, [loading, analyses, url]);

  if (checking)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
          <p className="text-center text-gray-700">
            در حال بررسی آنالیزهای موجود...
          </p>
        </div>
      </div>
    );

  return null;
}
