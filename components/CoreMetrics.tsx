import { AnalyzeResult } from "@/lib/models/analyze";

interface CoreMetricsProps {
  result: AnalyzeResult;
}

export function CoreMetrics({ result }: CoreMetricsProps) {
  if (!result.metrics || Object.keys(result.metrics).length === 0) return null;

  const labels: Record<string, string> = {
    FCP: "اولین نمایش محتوا",
    LCP: "بزرگ ترین نمایش محتوا", 
    TBT: "مسدود سازی کل",
    CLS: "تغییر چیدمان تجمعی",
    SI: "سرعت نشانگر"
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up">
      <h2 className="font-bold text-2xl text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        علائم حیاتی وبسایت
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(result.metrics).map(([key, value], index) => (
          <div
            key={key}
            className="animate-fade-in p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col items-center justify-center text-center"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="text-3xl font-bold text-gray-800">{value}</span>
            <span className="text-sm text-gray-500">{labels[key] || key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}