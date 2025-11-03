import { AnalyzeResult } from "@/lib/models/analyze";

interface WebsiteOverviewProps {
  result: AnalyzeResult;
}

export function WebsiteOverview({ result }: WebsiteOverviewProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up">
      <h2 className="font-bold text-2xl text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        اطلاعات کلی وبسایت
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl border border-blue-100 transition-all hover:shadow-md">
          <div className="bg-blue-100 p-3 rounded-lg ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 font-medium">آدرس وبسایت</p>
            <p className="font-semibold text-gray-800 truncate">{result.url}</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl border border-blue-100 transition-all hover:shadow-md">
          <div className="bg-blue-100 p-3 rounded-lg ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 font-medium">عنوان صفحه</p>
                         <p className="font-semibold text-gray-800 line-clamp-2">{result.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}