// hooks/useAnalyses.ts - نسخه با API Routes
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

  // دریافت لیست تمام آنالیزها از API route
  const fetchAnalyses = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching analyses from API route');
      
      const response = await fetch('/api/analyses?limit=100');

      console.log('📡 API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalyses(data.analyses || []);
      console.log('✅ Successfully fetched analyses:', data.analyses?.length || 0);
      
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('❌ Error fetching analyses:', err);
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  // شروع آنالیز جدید از طریق API route
  const startAnalysis = async (url: string, userData: { name: string; phoneNumber: string }): Promise<void> => {
    console.log('🎯 startAnalysis called with:', { url, userData });
    
    try {
      setLoading(true);
      setError(null);
      setAnalysis(null);
      
      console.log('🔄 Loading set to true');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          userInfo: userData
        }),
      });

      console.log('📡 API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Analysis started successfully:', result);

      if (result.success && result.analysisId) {
        console.log('🔄 Starting polling for analysis ID:', result.analysisId);
        await pollAnalysisResult(result.analysisId);
      } else {
        throw new Error('Failed to start analysis - no analysis ID returned');
      }

    } catch (err: any) {
      console.error('🔴 Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start analysis';
      setError(errorMessage);
      throw err;
    }
  };

  // Polling برای دریافت نتیجه آنالیز از طریق API route
  const pollAnalysisResult = async (analysisId: string): Promise<void> => {
    console.log('🔄 Starting polling for:', analysisId);
    const maxAttempts = 60; // 5 دقیقه حداکثر
    let attempts = 0;

    const poll = async (): Promise<void> => {
      try {
        console.log(`🔄 Polling attempt ${attempts + 1} for ${analysisId}`);
        
        const response = await fetch(`/api/analysis/${analysisId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const data = await response.json();
        const analysisData: Analysis = data.analysis;
        
        console.log('📊 Polling response status:', analysisData.status);
        
        setAnalysis(analysisData);

        if (analysisData.status === 'completed') {
          console.log('✅ Analysis completed successfully');
          await fetchAnalyses(); // بروزرسانی لیست
          setLoading(false);
          return;
        } else if (analysisData.status === 'failed') {
          setLoading(false);
          throw new Error('Analysis failed on the server');
        } else if (attempts >= maxAttempts) {
          setLoading(false);
          throw new Error('Analysis timeout - taking too long');
        } else {
          attempts++;
          setTimeout(poll, 5000); // 5 ثانیه بین polling ها
        }
      } catch (err) {
        console.error('🔴 Polling error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Polling error';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    };

    await poll();
  };

  useEffect(() => {
    console.log('🏁 useAnalyses hook mounted, fetching analyses...');
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