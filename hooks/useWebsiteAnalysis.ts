import { useState } from "react";

const ANALYZE_URL = process.env.NEXT_PUBLIC_ANALYZE_URL || "http://localhost:4000";

export const useWebsiteAnalysis = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async (url: string, userData: { name: string; phoneNumber: string }) => {
    console.log("🔹 Starting analysis request for:", url);
    setLoading(true);
    setError(null);

    try {
        const res = await fetch(`${ANALYZE_URL}/analysis/url/${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ API error:", res.status, errText);
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Analysis response:", data);
      setAnalysis(data);
    } catch (err: any) {
      console.error("❌ Analysis failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => setError(null);

  return { analysis, loading, error, startAnalysis, resetError };
};
