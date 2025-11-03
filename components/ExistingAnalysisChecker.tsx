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

const ANALYZE_URL = process.env.ANALYZE_URL || 'http://localhost:4000';

export function ExistingAnalysisChecker({ 
  url, 
  onExistingResultFound, 
  onNoExistingResult, 
  onError 
}: ExistingAnalysisCheckerProps) {
  const [checking, setChecking] = useState<boolean>(false);

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
        // اگر 404 باشد، آن را خطا در نظر نمی‌گیریم چون ممکن است آنالیز موجود نباشد
        if (response.status !== 404) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }
      }
      
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  // تابع برای بررسی آنالیزهای موجود
  const checkExistingAnalysis = async (urlToCheck: string): Promise<AnalyzeResult | null> => {
    if (!urlToCheck) return null;

    try {
      console.log('🔍 Checking existing analysis for:', urlToCheck);
      const response = await fetchWithTimeout(
        `${ANALYZE_URL}/analysis/url/${encodeURIComponent(urlToCheck)}`
      );
      
      if (response.ok) {
        const existingAnalysis: ApiAnalysisResult = await response.json();
        console.log('✅ Found existing analysis:', existingAnalysis.id);
        
        // بررسی تاریخ آنالیز (اگر بیش از 30 روز گذشته، آنالیز جدید انجام شود)
        const analysisDate = new Date(existingAnalysis.createdAt);
        const currentDate = new Date();
        const daysDifference = Math.floor((currentDate.getTime() - analysisDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDifference > 30) {
          console.log('📅 Analysis is too old:', daysDifference, 'days');
          return null;
        }
        
        return convertApiResultToAnalyzeResult(existingAnalysis);
      } else if (response.status === 404) {
        console.log('❌ No existing analysis found');
        return null;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error checking existing analysis:', error);
      throw error;
    }
  };

  // useEffect برای بررسی آنالیزهای موجود هنگام تغییر URL
  useEffect(() => {
    let isMounted = true;

    const checkAnalysis = async () => {
      if (!url) return;

      // اعتبارسنجی URL
      try {
        new URL(url);
      } catch {
        return; // اگر URL معتبر نیست، بررسی نکن
      }

      setChecking(true);

      try {
        const existingResult = await checkExistingAnalysis(url);
        
        if (!isMounted) return;

        if (existingResult) {
          onExistingResultFound(existingResult);
        } else {
          onNoExistingResult();
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error in existing analysis check:', error);
        onError(error instanceof Error ? error.message : 'خطا در بررسی آنالیزهای موجود');
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    };

    // تاخیر کوچک برای جلوگیری از بررسی‌های مکرر هنگام تایپ کردن
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
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              در حال بررسی آنالیزهای قبلی
            </h3>
            <p className="text-gray-600">
              در حال بررسی می‌کنیم که آیا قبلاً این وبسایت آنالیز شده است...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}