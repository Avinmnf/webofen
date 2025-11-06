import { useState } from "react";

const ANALYZE_URL = process.env.NEXT_PUBLIC_ANALYZE_URL || "http://localhost:4000";

export const useWebsiteAnalysis = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async (
    url: string,
    userData: { name: string; phoneNumber: string }
  ) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // اطمینان از اینکه URL با http شروع می‌شود
const fixedUrl = url!.startsWith("http") ? url! : `https://${url!}`;

      // --- ارسال درخواست شروع آنالیز ---
      const res = await fetch(`${ANALYZE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fixedUrl, userInfo: userData }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ API error:", res.status, errText);
        throw new Error(`API error: ${res.status}`);
      }

      const { analysisId } = await res.json();
      if (!analysisId) throw new Error("Failed to get analysisId from server");

      console.log("🔹 Analysis started, ID:", analysisId);

      // --- Polling برای بررسی وضعیت ---
      let result: any = null;
      const maxAttempts = 20; // ۲۰ بار بررسی (هر ۲ ثانیه)
      let attempts = 0;

      while (attempts < maxAttempts) {
        attempts++;
        await new Promise((r) => setTimeout(r, 2000)); // ۲ ثانیه صبر

        const pollRes = await fetch(`${ANALYZE_URL}/analysis/${analysisId}`);

        if (pollRes.ok) {
          const data = await pollRes.json();

          // 🔹 ست کردن وضعیت فعلی (حتی اگر هنوز کامل نشده)
          setAnalysis(data);
          console.log(`📊 Poll attempt ${attempts}:`, data.status);

          if (data.status === "completed") {
            result = data;
            break;
          }
        } else {
          console.warn(`⚠️ Poll attempt ${attempts} failed with status ${pollRes.status}`);
        }
      }

      if (!result) {
        throw new Error("Analysis did not complete in time");
      }

      console.log("✅ Analysis completed:", result);
      setAnalysis(result);
    } catch (err: any) {
      console.error("❌ Analysis failed:", err.message);
      setError(err.message);
    } finally {
      // فقط بعد از اتمام کامل یا خطا، loading متوقف می‌شود
      setLoading(false);
    }
  };

  const resetError = () => setError(null);

  return { analysis, loading, error, startAnalysis, resetError };
};
