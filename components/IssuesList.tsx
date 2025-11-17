// components/IssuesList.tsx
"use client";

import { AnalyzeResult, Issue, tabLabels } from "@/lib/models/analyze";
import { useState, useMemo } from "react";

interface IssuesListProps {
  result: AnalyzeResult & {
    translations?: Record<string, { title: string; description: string }>;
    analysisIssues?: Issue[]; // اضافه کردن این خط
  };
  isDuplicate?: boolean;
}

export function IssuesList({ result, isDuplicate = false }: IssuesListProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  // استخراج issues از مسیرهای مختلف - با Type Assertion
  const allIssues = useMemo(() => {
    console.log('🔍 IssuesList - Raw result:', result);
    
    let issues: any[] = [];
    let source = 'unknown';
    
    // دیباگ کامل ساختار داده
    console.log('🔎 Debugging result structure:', {
      'result.issues': result.issues,
      'result.analysisIssues': (result as any).analysisIssues,
      'result.extra.analysisIssues': result.extra?.analysisIssues,
      'result.result.extra.analysisIssues': result.result?.extra?.analysisIssues
    });

    // اولویت ۱: مسیر اصلی issues
    if (result.issues && Array.isArray(result.issues)) {
      issues = result.issues;
      source = 'result.issues';
      console.log('✅ Found issues in result.issues:', issues.length);
    }
    // اولویت ۲: مسیر analysisIssues در ریشه (با type assertion)
    else if ((result as any).analysisIssues && Array.isArray((result as any).analysisIssues)) {
      issues = (result as any).analysisIssues;
      source = 'analysisIssues';
      console.log('✅ Found issues in analysisIssues:', issues.length);
    }
    // اولویت ۳: مسیر extra.analysisIssues
    else if (result.extra?.analysisIssues && Array.isArray(result.extra.analysisIssues)) {
      issues = result.extra.analysisIssues;
      source = 'result.extra.analysisIssues';
      console.log('✅ Found issues in result.extra.analysisIssues:', issues.length);
    }
    // اولویت ۴: مسیر result.extra.analysisIssues
    else if (result.result?.extra?.analysisIssues && Array.isArray(result.result.extra.analysisIssues)) {
      issues = result.result.extra.analysisIssues;
      source = 'result.result.extra.analysisIssues';
      console.log('✅ Found issues in result.result.extra.analysisIssues:', issues.length);
    }
    // اولویت ۵: مسیر result.analysisIssues (با type assertion)
    else if ((result.result as any)?.analysisIssues && Array.isArray((result.result as any).analysisIssues)) {
      issues = (result.result as any).analysisIssues;
      source = 'result.analysisIssues';
      console.log('✅ Found issues in result.analysisIssues:', issues.length);
    }
    else {
      console.log('❌ No issues found in any path');
      issues = [];
      source = 'empty';
    }

    console.log(`📦 Issues source: ${source}, count: ${issues.length}`);

    // اگر issues null یا undefined است، آرایه خالی برگردان
    if (!issues) {
      console.log('⚠️ Issues is null/undefined, converting to empty array');
      issues = [];
    }

    // فرمت کردن issues برای نمایش
    const formattedIssues = issues.map((issue, index) => {
      // اگر issue از قبل فرمت شده است، از آن استفاده کن
      if (issue && typeof issue === 'object' && issue.auditId && issue.title) {
        return {
          id: issue.id || `issue-${index}`,
          auditId: issue.auditId,
          title: issue.title,
          impact: issue.impact || 'moderate',
          description: issue.description || '',
          category: issue.category || 'performance',
          solution: issue.solution
        };
      }

      // اگر issue یک string ساده است
      if (typeof issue === 'string') {
        return {
          id: `issue-${index}`,
          auditId: `audit-${index}`,
          title: issue,
          impact: 'moderate',
          description: 'توضیحاتی برای این خطا موجود نیست',
          category: 'general'
        };
      }

      // اگر issue یک object ساده است
      if (issue && typeof issue === 'object') {
        return {
          id: issue.id || `issue-${index}`,
          auditId: issue.auditId || `audit-${index}`,
          title: issue.title || issue.name || 'Issue',
          impact: issue.impact || 'moderate',
          description: issue.description || '',
          category: issue.category || 'performance',
          solution: issue.solution
        };
      }

      // فرمت پیش‌فرض برای موارد ناشناخته
      console.warn('⚠️ Unknown issue format:', issue);
      return {
        id: `issue-${index}`,
        auditId: `audit-${index}`,
        title: 'خطای ناشناخته',
        impact: 'moderate',
        description: 'فرمت این خطا قابل تشخیص نیست',
        category: 'general'
      };
    });

    console.log('🎯 Final formatted issues:', {
      count: formattedIssues.length,
      issues: formattedIssues
    });
    
    return formattedIssues;
  }, [result, isDuplicate]);

  // بقیه کد بدون تغییر...
  // گروه‌بندی issues بر اساس impact
  const groupedIssues = useMemo(() => {
    const groups = allIssues.reduce<Record<string, Issue[]>>((acc, issue) => {
      const key = issue.impact || "other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(issue);
      return acc;
    }, {});

    console.log('📊 Grouped issues:', groups);
    return groups;
  }, [allIssues]);

  const tabs = ["all", ...Object.keys(groupedIssues)];

  // استفاده از ترجمه‌های ارسالی از سرور
  const auditTranslations = result.translations || {};

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "critical": 
      case "table":
      case "performance": 
        return "text-red-600";
      case "serious": 
      case "seo": 
        return "text-orange-600";
      case "moderate": 
      case "list":
      case "accessibility": 
        return "text-yellow-600";
      case "minor": 
      case "best-practices": 
        return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "critical": 
      case "table":
      case "performance": 
        return "bg-red-100 text-red-800 border border-red-200";
      case "serious": 
      case "seo": 
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "moderate": 
      case "list":
      case "accessibility": 
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "minor": 
      case "best-practices": 
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // تابع برای گرفتن عنوان و توضیحات از دیکشنری
  const getIssueTranslation = (issue: Issue) => {
    if (issue.auditId && auditTranslations[issue.auditId]) {
      return auditTranslations[issue.auditId];
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

  const getImpactText = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "critical": 
      case "table":
      case "performance": 
        return "بحرانی";
      case "serious": 
      case "seo": 
        return "جدی";
      case "moderate": 
      case "list":
      case "accessibility": 
        return "متوسط";
      case "minor": 
      case "best-practices": 
        return "جزئی";
      default: return impact;
    }
  };

  // لاگ نهایی برای دیباگ
  console.log('🎯 Rendering IssuesList:', {
    allIssuesCount: allIssues.length,
    hasIssues: allIssues.length > 0,
    shouldShowNoIssues: allIssues.length === 0,
    groupedIssuesKeys: Object.keys(groupedIssues),
    tabs: tabs
  });

  // اگر issues وجود ندارد - این شرط باید درست کار کند
  if (allIssues.length === 0) {
    console.log('✅ Showing "No issues found" message');
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
        <div className="text-center py-12 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-medium">هیچ خطایی یافت نشد</p>
          <p className="mt-2">عالی! وبسایت شما هیچ مشکلی ندارد.</p>
          {isDuplicate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700 text-sm">
                ✅ در حال نمایش نتایج آنالیز قبلی برای این آدرس
              </p>
            </div>
          )}
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
          {isDuplicate && (
            <span className="mr-2 text-sm  px-2 py-1 rounded-full">
            </span>
          )}
        </h2>
        
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab, index) => {
            const count = tab === "all" 
              ? allIssues.length 
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

      {/* لیست خطاها */}
      <div className="space-y-4">
        {(activeTab === "all"
          ? allIssues
          : groupedIssues[activeTab] || []
        ).map((issue: Issue, idx: number) => {
          const translation = getIssueTranslation(issue);
          
          return (
            <div
              key={issue.id || idx}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm animate-fade-in-up bg-white"
              style={{animationDelay: `${idx * 0.03}s`}}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-1 ${getImpactColor(issue.impact)}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-medium text-gray-900 text-base leading-7">
                      {translation.title}
                    </h3>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getImpactBadgeColor(issue.impact)}`}>
                      {getImpactText(issue.impact)}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-6">
                    {translation.description}
                  </p>
                  
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

                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      ID: {issue.auditId}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      دسته: {issue.category || 'عمومی'}
                    </span>
                  </div>
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
            مجموع: {allIssues.length} خطا
          </div>
        </div>
        
        {isDuplicate && (
          <div className="mt-4 p-3 rounded-lg  ">
            <div className="flex items-center gap-2">
            
            </div>
          </div>
        )}
      </div>
    </div>
  );
}