// hooks/useAnalyses.ts
import { useState, useEffect } from 'react';
import { Analysis } from '@/lib/models/analyze';

export interface UseAnalysesReturn {
  analyses: Analysis[];
  analysis: Analysis | null;
  loading: boolean;
  error: string | null;
  startAnalysis: (url: string, userData: { name: string; phoneNumber: string }) => Promise<void>;
  resetError: () => void;
  refetch: () => Promise<void>;
}

export function useAnalyses(): UseAnalysesReturn {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = (): void => {
    setError(null);
  };

  // دریافت لیست تمام آنالیزها - مستقیماً از بکند
// hooks/useAnalyses.ts - اصلاح این تابع
const fetchAnalyses = async (): Promise<void> => {
  try {
    setLoading(true);
    setError(null);
    
    // مستقیماً به بکند وصل شو
    const analyzeurl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const response = await fetch(`${analyzeurl}/analytics/recent?limit=100`);
    
    console.log('📡 Direct backend request to:', `${analyzeurl}/analytics/recent?limit=5`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: Analysis[] = await response.json();
    console.log('✅ Direct backend response:', data.length, 'analyses');
    setAnalyses(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    setError(errorMessage);
    console.error('❌ Error fetching analyses directly:', err);
  } finally {
    setLoading(false);
  }
};

  // شروع آنالیز جدید
  const startAnalysis = async (url: string, userData: { name: string; phoneNumber: string }): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      console.log('🚀 Starting analysis for URL:', url);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          userInfo: userData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Analysis started successfully:', result);

      // Poll for results until completed
      if (result.success && result.analysisId) {
        await pollAnalysisResult(result.analysisId);
      } else {
        throw new Error('Failed to start analysis');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('❌ Analysis error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Polling برای دریافت نتیجه آنالیز
  const pollAnalysisResult = async (analysisId: string): Promise<void> => {
    const maxAttempts = 60;
    let attempts = 0;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

    const poll = async (): Promise<void> => {
      try {
        const response = await fetch(`${backendUrl}/analysis/${analysisId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const analysisData: Analysis = await response.json();
        setAnalysis(analysisData);

        if (analysisData.status === 'completed') {
          console.log('✅ Analysis completed successfully');
          // بروزرسانی لیست آنالیزها پس از اتمام
          await fetchAnalyses();
          return;
        } else if (analysisData.status === 'failed') {
          throw new Error('Analysis failed');
        } else if (attempts >= maxAttempts) {
          throw new Error('Analysis timeout');
        } else {
          // Continue polling
          attempts++;
          setTimeout(poll, 5000);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Polling error';
        setError(errorMessage);
        console.error('❌ Polling error:', err);
        throw err;
      }
    };

    await poll();
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  return { 
    analyses, 
    analysis,
    loading, 
    error, 
    startAnalysis, 
    resetError,
    refetch: fetchAnalyses 
  };
}