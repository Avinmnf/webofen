// components/ExistingAnalysisChecker.tsx
"use client";

import { useState, useEffect } from 'react';
import { AnalyzeResult } from '@/lib/models/analyze';

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

interface ExistingAnalysisCheckerProps {
  url: string;
  onExistingResultFound: (result: AnalyzeResult) => void;
  onNoExistingResult: () => void;
  onError: (error: string) => void;
}

const ANALYZE_URL = process.env.NEXT_PUBLIC_ANALYZE_URL || 'http://localhost:4000';

// Cache ساده برای جلوگیری از fetch مجدد
const analysisCache = new Map<string, AnalyzeResult>();

export function ExistingAnalysisChecker({ 
  url, 
  onExistingResultFound, 
  onNoExistingResult, 
  onError 
}: ExistingAnalysisCheckerProps) {
  const [checking, setChecking] = useState<boolean>(false);

  const convertApiResultToAnalyzeResult = (apiResult: ApiAnalysisResult): AnalyzeResult => ({
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
  });

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

      if (!response.ok && response.status !== 404) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  const checkExistingAnalysis = async (urlToCheck: string): Promise<AnalyzeResult | null> => {
  if (!urlToCheck) return null;

  if (analysisCache.has(urlToCheck)) return analysisCache.get(urlToCheck)!;

  try {
    const response = await fetchWithTimeout(`${ANALYZE_URL}/analysis/url/${encodeURIComponent(urlToCheck)}`);

    if (response.status === 404) {
      // آنالیز موجود نیست
      return null;
    }

    if (!response.ok) {
      // خطای دیگر
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const existingAnalysis: ApiAnalysisResult = await response.json();
    const analysisResult = convertApiResultToAnalyzeResult(existingAnalysis);

    analysisCache.set(urlToCheck, analysisResult);
    return analysisResult;
  } catch (error) {
    console.error('Error checking existing analysis:', error);
    throw error;
  }
};

  useEffect(() => {
    let isMounted = true;

    const checkAnalysis = async () => {
      if (!url) return;

      // اعتبارسنجی URL
      try {
        new URL(url);
      } catch {
        return;
      }

      setChecking(true);

      try {
        const existingResult = await checkExistingAnalysis(url);
        if (!isMounted) return;

        if (existingResult) onExistingResultFound(existingResult);
        else onNoExistingResult();
      } catch (error) {
        if (!isMounted) return;
        onError(error instanceof Error ? error.message : 'خطا در بررسی آنالیزهای موجود');
      } finally {
        if (isMounted) setChecking(false);
      }
    };

    const timeoutId = setTimeout(checkAnalysis, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [url, onExistingResultFound, onNoExistingResult, onError]);

  // اگر در حال بررسی هستیم، کامپوننت لودینگ نمایش دهد
  if (checking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            در حال بررسی آنالیزهای قبلی
          </h3>
          <p className="text-gray-600">
            در حال بررسی می‌کنیم که آیا قبلاً این وبسایت آنالیز شده است...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
