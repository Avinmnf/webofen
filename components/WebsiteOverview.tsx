"use client";

import { AnalyzeResult } from "@/lib/models/analyze";

interface WebsiteOverviewProps {
  result: AnalyzeResult;
}

export function WebsiteOverview({ result }: WebsiteOverviewProps) {
  // --- انتخاب بهترین عنوان موجود ---
  const getBestTitle = () => {
    let domainName = "";
    if (result.url) {
      try {
        const urlObj = new URL(result.url);
        domainName = urlObj.hostname.replace(/^www\./, "");
      } catch {
        domainName = result.url;
      }
    }

    // 1) og:title
    if (result.meta?.ogTitle &&
        result.meta.ogTitle.trim() &&
        result.meta.ogTitle !== "بدون عنوان" &&
        result.meta.ogTitle !== domainName) {
      return result.meta.ogTitle;
    }

    // 2) meta title
    if (result.meta?.title &&
        result.meta.title.trim() &&
        result.meta.title !== "بدون عنوان" &&
        result.meta.title !== domainName) {
      return result.meta.title;
    }

    // 3) title اصلی صفحه
    if (result.title &&
        result.title.trim() &&
        result.title !== "بدون عنوان" &&
        result.title !== domainName) {
      return result.title;
    }

    // 4) og:title به عنوان fallback
    if (result.meta?.ogTitle && result.meta.ogTitle.trim()) {
      return result.meta.ogTitle;
    }

    // 5) meta title
    if (result.meta?.title && result.meta.title.trim()) {
      return result.meta.title;
    }

    // 6) title
    if (result.title && result.title.trim()) {
      return result.title;
    }

    // 7) دامنه
    return domainName || "عنوان یافت نشد";
  };

  const displayTitle = getBestTitle();

  // --- تشخیص اینکه عنوان فقط خود دامنه است ---
  const normalize = (s: string) =>
    s.trim().replace(/^www\./, "").toLowerCase();

  let isDomainTitle = false;

  if (result.url) {
    try {
      const urlObj = new URL(result.url);
      const domainName = urlObj.hostname.replace(/^www\./, "").toLowerCase();
      const titleNorm = normalize(displayTitle);
      isDomainTitle = titleNorm === domainName;
    } catch {
      isDomainTitle = displayTitle === result.url;
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up">
      <h2 className="font-bold text-2xl text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        اطلاعات کلی وبسایت
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* آدرس وبسایت */}
        <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100 transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="bg-blue-100 p-3 rounded-lg ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 font-medium">آدرس وبسایت</p>
            <p className="font-semibold text-gray-800 truncate text-sm">{result.url}</p>
          </div>
        </div>

        {/* عنوان صفحه */}
        <div className="flex p-4 bg-blue-50 rounded-xl border border-blue-100 transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg ml-4 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 font-medium mb-2">عنوان صفحه</p>

            <p className="font-bold text-gray-800 text-lg leading-snug line-clamp-2" title={displayTitle}>
              {displayTitle}
            </p>

            {isDomainTitle && (
              <p className="text-xs text-yellow-600 mt-1">
                ⚠️ عنوان صفحه تنظیم نشده است
              </p>
            )}

            <div className="mt-2 space-y-1">
              {result.meta?.title && result.meta.title !== displayTitle && (
                <p className="text-xs text-gray-500">
                  <span className="font-medium">متا تایتل:</span> {result.meta.title}
                </p>
              )}

              {result.meta?.ogTitle && result.meta.ogTitle !== displayTitle && (
                <p className="text-xs text-gray-500">
                  <span className="font-medium">og:title:</span> {result.meta.ogTitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* وضعیت آنالیز */}
        <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100 transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="bg-green-100 p-3 rounded-lg ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 font-medium">وضعیت آنالیز</p>
            <p className="font-semibold text-gray-800">تکمیل شده</p>
          </div>
        </div>

      </div>
    </div>
  );
}
