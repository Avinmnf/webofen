import { AnalyzeResult, Issue, tabLabels } from "@/lib/models/analyze";
import { useState } from "react";

interface IssuesListProps {
  result: AnalyzeResult;
}

export function IssuesList({ result }: IssuesListProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  if (!result.issues || result.issues.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
        <div className="text-center py-12 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-medium">هیچ خطایی یافت نشد</p>
          <p className="mt-2">عالی! وبسایت شما هیچ مشکلی ندارد.</p>
        </div>
      </div>
    );
  }

  const groupedIssues = result.issues.reduce<Record<string, Issue[]>>((acc, issue) => {
    const key = issue.impact || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(issue);
    return acc;
  }, {});

  const tabs = ["all", ...Object.keys(groupedIssues)];

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "critical": return "bg-red-50 border-red-400 text-red-800";
      case "serious": return "bg-orange-50 border-orange-400 text-orange-800";
      case "moderate": return "bg-yellow-50 border-yellow-400 text-yellow-800";
      case "minor": return "bg-blue-50 border-blue-400 text-blue-800";
      default: return "bg-gray-50 border-gray-400 text-gray-800";
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "critical": return "bg-red-100 text-red-800";
      case "serious": return "bg-orange-100 text-orange-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "minor": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="font-bold text-2xl text-gray-800 flex items-center mb-4 lg:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          لیست خطا های وبسایت
        </h2>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab, index) => {
            const count = tab === "all" 
              ? result.issues.length 
              : (groupedIssues[tab] || []).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                  activeTab === tab
                    ? "bg-red-100 text-red-700 font-medium shadow-sm transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } animate-fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {tabLabels[tab] || tab}
                <span className={`mr-1 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab ? "bg-red-200" : "bg-gray-300"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {(activeTab === "all" ? result.issues : groupedIssues[activeTab] || []).map((issue: Issue, idx: number) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border-l-4 ${
              getImpactColor(issue.impact)
            } transition-all hover:shadow-sm animate-fade-in-up`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium text-lg">{issue.title}</p>
                </div>
                <p className="text-gray-700 mt-2 pr-7">{issue.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                getImpactBadgeColor(issue.impact)
              } transform transition-transform hover:scale-105`}>
                {issue.impact}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}