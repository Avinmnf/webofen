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
  checkExistingAnalysis: (url: string) => Analysis | null;
}

interface UseAnalysesProps {
  phoneNumber?: string;
}

export function useAnalyses({ phoneNumber }: UseAnalysesProps = {}): UseAnalysesReturn {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = () => setError(null);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);

      let url = '/api/analyses';
      if (phoneNumber) {
        url += `?phoneNumber=${encodeURIComponent(phoneNumber)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch analyses');

      const data = await res.json();
      setAnalyses(Array.isArray(data.analyses) ? data.analyses : []);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingAnalysis = (url: string): Analysis | null => {
    const normalized = url.trim().toLowerCase();
    const existing = analyses
      .filter(a => a.status === 'completed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .find(a => a.url.trim().toLowerCase() === normalized);
    return existing || null;
  };

  const startAnalysis = async (url: string, userData: { name: string; phoneNumber: string }) => {
    try {
      setLoading(true);
      setAnalysis(null);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, userInfo: userData }),
      });

      if (!res.ok) throw new Error('Failed to start analysis');
      const result = await res.json();
      if (result.success && result.analysisId) {
        await pollAnalysisResult(result.analysisId);
      } else {
        throw new Error('No analysisId returned');
      }
    } catch (err: any) {
      setError(err.message || 'Analysis error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const pollAnalysisResult = async (id: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async (): Promise<void> => {
      try {
        const res = await fetch(`/api/analysis/${id}`);
        if (!res.ok) throw new Error('Failed to fetch analysis status');
        const data = await res.json();
        setAnalysis(data.analysis);
        if (data.analysis.status === 'completed') {
          await fetchAnalyses();
          return;
        } else if (data.analysis.status === 'failed') {
          throw new Error('Analysis failed');
        } else if (attempts >= maxAttempts) {
          throw new Error('Analysis timeout');
        } else {
          attempts++;
          setTimeout(poll, 5000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Polling error');
      }
    };

    await poll();
  };

  useEffect(() => { fetchAnalyses(); }, [phoneNumber]);

  return { analyses, analysis, loading, error, startAnalysis, resetError, refetch: fetchAnalyses, checkExistingAnalysis };
}
