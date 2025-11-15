// components/IssuesList.tsx
"use client";

import { AnalyzeResult, Issue, tabLabels } from "@/lib/models/analyze";
import { useState } from "react";

interface IssuesListProps {
  result: AnalyzeResult & {
    translations?: Record<string, { title: string; description: string }>;
  };
}

export function IssuesList({ result }: IssuesListProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  // گروه‌بندی issues بر اساس impact
  const groupedIssues = result.issues.reduce<Record<string, Issue[]>>((acc, issue) => {
    const key = issue.impact || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(issue);
    return acc;
  }, {});

  const tabs = ["all", ...Object.keys(groupedIssues)];

  // استفاده از ترجمه‌های ارسالی از سرور
  const auditTranslations = result.translations || {};

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "critical": return "text-red-600";
      case "serious": return "text-orange-600";
      case "moderate": return "text-yellow-600";
      case "minor": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "critical": return "bg-red-100 text-red-800 border border-red-200";
      case "serious": return "bg-orange-100 text-orange-800 border border-orange-200";
      case "moderate": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "minor": return "bg-blue-100 text-blue-800 border border-blue-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // تابع برای گرفتن عنوان و توضیحات از دیکشنری
  const getIssueTranslation = (issue: Issue) => {
    if (issue.id && auditTranslations[issue.id]) {
      return auditTranslations[issue.id];
    }
    
    if (issue.title && auditTranslations[issue.title]) {
      return auditTranslations[issue.title];
    }

    // اگر ترجمه پیدا نشد، از مقادیر اصلی استفاده کن
    return {
      title: issue.title,
      description: issue.description
    };
  };

  // اگر issues وجود ندارد
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.5s'}}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="font-bold text-2xl text-gray-800 flex items-center mb-4 lg:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          لیست خطاهای وبسایت
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
                className={`px-4 py-2 rounded-lg flex items-center transition-all ${activeTab === tab
                  ? "bg-red-100 text-red-700 font-medium shadow-sm transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } animate-fade-in`}
                style={{animationDelay: `${index * 0.05}s`}}
              >
                {tabLabels[tab] || tab}
                <span className={`mr-1 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-red-200" : "bg-gray-300"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* لیست خطاها با طراحی مشابه نمونه */}
      <div className="space-y-4">
        {(activeTab === "all"
          ? result.issues
          : groupedIssues[activeTab] || []
        ).map((issue: Issue, idx: number) => {
          const translation = getIssueTranslation(issue);
          
          return (
            <div
              key={idx}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm animate-fade-in-up bg-white"
              style={{animationDelay: `${idx * 0.03}s`}}
            >
              <div className="flex items-start gap-3">
                {/* آیکون خطا */}
                <div className={`flex-shrink-0 mt-1 ${getImpactColor(issue.impact)}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* محتوای خطا */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-medium text-gray-900 text-base leading-7">
                      {translation.title}
                    </h3>
                    
                    {/* بدج اهمیت */}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getImpactBadgeColor(issue.impact)}`}>
                      {issue.impact === "critical" && "بحرانی"}
                      {issue.impact === "serious" && "جدی"}
                      {issue.impact === "moderate" && "متوسط"}
                      {issue.impact === "minor" && "جزئی"}
                      {!["critical", "serious", "moderate", "minor"].includes(issue.impact) && issue.impact}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-6">
                    {translation.description}
                  </p>
                  
                  {/* راه حل پیشنهادی */}
                  {issue.solution && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-blue-800 text-sm font-medium">راه حل: </span>
                        <span className="text-blue-700 text-sm">{issue.solution}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* خلاصه آمار */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {groupedIssues.critical && groupedIssues.critical.length > 0 && (
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full ml-2"></span>
              بحرانی: {groupedIssues.critical.length}
            </div>
          )}
          {groupedIssues.serious && groupedIssues.serious.length > 0 && (
            <div className="flex items-center">
              <span className="w-3 h-3 bg-orange-500 rounded-full ml-2"></span>
              جدی: {groupedIssues.serious.length}
            </div>
          )}
          {groupedIssues.moderate && groupedIssues.moderate.length > 0 && (
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full ml-2"></span>
              متوسط: {groupedIssues.moderate.length}
            </div>
          )}
          {groupedIssues.minor && groupedIssues.minor.length > 0 && (
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full ml-2"></span>
              جزئی: {groupedIssues.minor.length}
            </div>
          )}
          <div className="flex items-center font-medium text-gray-800">
            <span className="w-3 h-3 bg-gray-600 rounded-full ml-2"></span>
            مجموع: {result.issues.length} خطا
          </div>
        </div>
      </div>
    </div>
  );
}