"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_ANALYZE_URL || "http://localhost:4000";

interface Analysis {
  id: string;
  url: string;
  status: string;
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  result?: any;
  name?: string;
  phoneNumber?: string;
}

export function useWebsiteAnalysis() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 شروع آنالیز (ارسال درخواست POST)
  const startAnalysis = async (url: string, userData: { name: string; phoneNumber: string }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          userInfo: userData,
        }),
      });

      const data = await res.json();

      if (!data.success || !data.analysisId) {
        throw new Error(data.error || "خطا در شروع آنالیز");
      }

      const analysisId = data.analysisId;

      // Polling برای بررسی وضعیت آنالیز هر ۵ ثانیه
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE}/analysis/${analysisId}`);
          const analysisData = await response.json();
          setAnalysis(analysisData);

          if (analysisData.status === "completed" || analysisData.status === "failed") {
            clearInterval(interval);
            setLoading(false);
          }
        } catch (err) {
          console.error("❌ Error polling analysis:", err);
          clearInterval(interval);
          setLoading(false);
        }
      }, 5000);
    } catch (err: any) {
      setError(err.message || "خطای ناشناخته");
      setLoading(false);
    }
  };

  const resetError = () => setError(null);
  const clearAnalysis = () => setAnalysis(null);

  return {
    analysis,
    loading,
    error,
    startAnalysis,
    resetError,
    clearAnalysis,
  };
}
