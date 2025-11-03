import { useState, useEffect, useCallback, useRef } from 'react';

interface AnalysisResult {
  id: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  performance?: number | null;
  accessibility?: number | null;
  bestPractices?: number | null;
  seo?: number | null;
  result?: any;
  createdAt?: string;
  updatedAt?: string;
}

const ANALYZE_URL = process.env.NEXT_PUBLIC_ANALYZE_URL || 'http://localhost:4000';

export default function WebsiteAnalyzer() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // شروع تحلیل
  const startAnalysis = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${ANALYZE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        credentials: 'include', // مهم برای CORS
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setAnalysis({
          id: data.analysisId,
          url,
          status: 'pending',
          performance: 0,
          accessibility: 0,
          bestPractices: 0,
          seo: 0,
        });
      } else {
        setError(data.error || 'Failed to start analysis');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to start analysis. Make sure the service is running.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  // چک وضعیت تحلیل
  const checkAnalysisStatus = useCallback(async () => {
    if (!analysis) return false;

    try {
      const timestamp = Date.now();
      const response = await fetch(`${ANALYZE_URL}/analysis/${analysis.id}?t=${timestamp}`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`Status check failed: ${response.status}`);

      const result: AnalysisResult = await response.json();

      setAnalysis({
        ...result,
        performance: result.performance ?? 0,
        accessibility: result.accessibility ?? 0,
        bestPractices: result.bestPractices ?? 0,
        seo: result.seo ?? 0,
      });

      return result.status === 'pending' || result.status === 'running';
    } catch (err) {
      console.error('Status check error:', err);
      return false;
    }
  }, [analysis]);

  // Polling امن با useRef
  useEffect(() => {
    if (!analysis) return;

    pollRef.current = setInterval(async () => {
      const shouldContinue = await checkAnalysisStatus();
      if (!shouldContinue && pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }, 3000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [analysis, checkAnalysisStatus]);

  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Website Analysis</h1>

      <form onSubmit={startAnalysis} className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {error && <div className="p-3 bg-red-100 text-red-800 rounded">{error}</div>}
      </form>

      {analysis && (
        <div className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p><strong>URL:</strong> {analysis.url}</p>
              <p><strong>ID:</strong> {analysis.id}</p>
            </div>
            <div>
              <p><strong>Status:</strong>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  analysis.status === 'completed' ? 'bg-green-100 text-green-800' :
                  analysis.status === 'failed' ? 'bg-red-100 text-red-800' :
                  analysis.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {analysis.status.toUpperCase()}
                </span>
              </p>
              <p><strong>Last Check:</strong> {new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          {analysis.status === 'completed' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded text-center">
                <h3 className="font-semibold text-gray-700">Performance</h3>
                <div className="text-2xl font-bold text-blue-600">{analysis.performance}/100</div>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <h3 className="font-semibold text-gray-700">Accessibility</h3>
                <div className="text-2xl font-bold text-green-600">{analysis.accessibility}/100</div>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <h3 className="font-semibold text-gray-700">Best Practices</h3>
                <div className="text-2xl font-bold text-purple-600">{analysis.bestPractices}/100</div>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center">
                <h3 className="font-semibold text-gray-700">SEO</h3>
                <div className="text-2xl font-bold text-orange-600">{analysis.seo}/100</div>
              </div>
            </div>
          )}

          {(analysis.status === 'pending' || analysis.status === 'running') && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg">Analysis in progress...</p>
              <p className="text-gray-600">Auto-refreshing every 3 seconds</p>
            </div>
          )}

          {analysis.status === 'failed' && (
            <div className="text-center py-8">
              <div className="text-red-500 text-4xl mb-4">❌</div>
              <p className="text-red-600 font-semibold text-lg">Analysis Failed</p>
              <p className="text-gray-600">Please try again with a different URL</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
