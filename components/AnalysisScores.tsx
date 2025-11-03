import { AnalyzeResult } from "@/lib/models/analyze";
import { AnimatedScoreCard } from "./AnimatedScoreCard";
import { scoreDescriptions } from "@/lib/models/analyze";

interface AnalysisScoresProps {
  result: AnalyzeResult;
  animatedScores: Record<string, number>;
}

export function AnalysisScores({ result, animatedScores }: AnalysisScoresProps) {
  const labels: Record<string, string> = {
    performance: "عملکرد",
    accessibility: "دسترسی", 
    bestPractices: "بهترین روش‌ ها",
    seo: "سئو"
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up">
      <h2 className="font-bold text-2xl text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        امتیاز های آنالیز
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(result.scores).map(([key, score], index) => {
          if (score === undefined) return null;

          return (
            <div
              key={key}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AnimatedScoreCard
                score={score}
                label={labels[key] || key}
                description={scoreDescriptions[key] || ""}
                animatedValue={animatedScores[key] || 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}