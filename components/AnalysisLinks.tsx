'use client';

import { useState, useEffect, useMemo } from 'react';

interface User {
  name: string;
  phone: string;
  email?: string;
}

interface Analysis {
  id: string;
  phoneNumber: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  analysisType: string;
  result?: {
    url?: string;
    siteUrl?: string;
    website?: string;
    [key: string]: any;
  };
  score?: number;
  duration?: number;
  [key: string]: any;
}

interface ApiResponse {
  analyses: Analysis[];
}

interface AnalysisLinksProps {
  compact?: boolean;
  showHeader?: boolean;
  itemsPerPage?: number;
  showAllByDefault?: boolean; // نمایش همه آیتم‌ها به صورت پیش‌فرض
}

export default function AnalysisLinks({ 
  compact = false, 
  showHeader = true,
  itemsPerPage = 7,
  showAllByDefault = false // به صورت پیش‌فرض صفحه‌بندی فعال است
}: AnalysisLinksProps) {
  const [allAnalyses, setAllAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // حالت‌های صفحه‌بندی
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllItems, setShowAllItems] = useState(showAllByDefault);

  // محاسبه داده‌های صفحه‌بندی
  const paginationData = useMemo(() => {
    const totalItems = allAnalyses.length;
    
    if (showAllItems) {
      // نمایش همه آیتم‌ها بدون صفحه‌بندی
      return {
        totalItems,
        totalPages: 1,
        currentItems: allAnalyses,
        startIndex: 1,
        endIndex: totalItems,
        showAll: true
      };
    } else {
      // نمایش با صفحه‌بندی
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
      const currentItems = allAnalyses.slice(startIndex, endIndex);
      
      return {
        totalItems,
        totalPages,
        currentItems,
        startIndex: startIndex + 1,
        endIndex,
        showAll: false
      };
    }
  }, [allAnalyses, currentPage, itemsPerPage, showAllItems]);

  // تابع برای تولید آرایه صفحات
  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1);
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1);
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // تابع fetch برای دریافت همه داده‌ها
  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get logged in user
      const meRes = await fetch('/api/auth/me');
      
      if (!meRes.ok) {
        throw new Error('خطا در دریافت اطلاعات کاربر');
      }
      
      const meData = await meRes.json();
      const loggedUser: User = meData?.user;

      if (!loggedUser) {
        setError('لطفاً ابتدا وارد حساب کاربری شوید.');
        setLoading(false);
        return;
      }

      setUser(loggedUser);

      // 2. Fetch all analyses
      const response = await fetch('/api/analyses', {
        headers: { 
          'x-user-phone': loggedUser.phone,
          'Cache-Control': 'no-cache'
        },
      });

      if (!response.ok) {
        throw new Error(`خطا در دریافت آنالیزها: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      // 3. Check if analyses exist
      if (!data?.analyses?.length) {
        setError('هیچ آنالیزی یافت نشد.');
        setAllAnalyses([]);
        setLoading(false);
        return;
      }

      // 4. Filter by phone number
      const filtered = data.analyses.filter(
        (item: Analysis) => item.phoneNumber === loggedUser.phone
      );

      if (!filtered.length) {
        setError('هیچ آنالیزی مربوط به شماره شما یافت نشد.');
        setAllAnalyses([]);
        setLoading(false);
        return;
      }

      // 5. Sort by date (newest first)
      const sorted = filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAllAnalyses(sorted);
      setCurrentPage(1);

    } catch (err: any) {
      console.error('Error fetching analyses:', err);
      setError(err.message || 'خطایی در دریافت آنالیزها رخ داده است.');
      setAllAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  // تابع برای تغییر صفحه
  const handlePageChange = (page: number) => {
    if (page < 1 || page > paginationData.totalPages) return;
    setCurrentPage(page);
    
    // اسکرول به بالای کامپوننت
    const element = document.getElementById('analysis-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // تابع برای تغییر حالت نمایش (همه یا صفحه‌بندی شده)
  const toggleDisplayMode = () => {
    setShowAllItems(!showAllItems);
    if (!showAllItems) {
      setCurrentPage(1);
    }
    
    // اسکرول به بالای کامپوننت
    const element = document.getElementById('analysis-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border border-yellow-200';
      case 'failed': return 'text-red-600 bg-red-50 border border-red-200';
      default: return 'text-gray-600 bg-gray-50 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '✅ تکمیل شده';
      case 'pending': return '⏳ در حال پردازش';
      case 'failed': return '❌ ناموفق';
      default: return status;
    }
  };

  // تابع برای استخراج URL سایت از آنالیز
  const getSiteUrl = (analysis: Analysis): string | null => {
    if (analysis.url) return analysis.url;
    if (analysis.result?.url) return analysis.result.url;
    if (analysis.result?.siteUrl) return analysis.result.siteUrl;
    if (analysis.result?.website) return analysis.result.website;
    
    const possibleUrlFields = ['site', 'domain', 'link', 'webpage', 'page'];
    for (const field of possibleUrlFields) {
      if (analysis.result?.[field] && typeof analysis.result[field] === 'string') {
        const value = analysis.result[field];
        if (value.includes('http') || value.includes('www') || value.includes('.')) {
          return value;
        }
      }
    }
    
    return null;
  };

  // تابع برای نمایش URL به صورت کوتاه شده
  const formatUrl = (url: string): string => {
    try {
      let formatted = url.replace(/^https?:\/\//, '');
      formatted = formatted.replace(/^www\./, '');
      formatted = formatted.split('/')[0];
      return formatted;
    } catch {
      return url;
    }
  };

  const handleViewSite = (analysis: Analysis) => {
    const siteUrl = getSiteUrl(analysis);
    
    if (siteUrl) {
      const fullUrl = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('آدرس سایت برای این آنالیز موجود نیست.');
    }
  };

  // کامپوننت Pagination
  const Pagination = () => {
    const { totalPages, totalItems, startIndex, endIndex, showAll } = paginationData;
    
    if (showAll || totalPages <= 1) return null;
    
    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
        {/* اطلاعات صفحه */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">{totalItems.toLocaleString('fa-IR')}</span> مورد یافت شد • 
          نمایش <span className="font-medium">{startIndex.toLocaleString('fa-IR')}</span> تا{' '}
          <span className="font-medium">{endIndex.toLocaleString('fa-IR')}</span> • 
          صفحه <span className="font-medium">{currentPage.toLocaleString('fa-IR')}</span> از{' '}
          <span className="font-medium">{totalPages.toLocaleString('fa-IR')}</span>
        </div>
        
        {/* دکمه‌های صفحه‌بندی */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-md border border-gray-300 
                     hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                     flex items-center gap-1"
          >
            <span>««</span>
            <span className="hidden sm:inline">ابتدا</span>
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-md border border-gray-300 
                     hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                     flex items-center gap-1"
          >
            <span>«</span>
            <span className="hidden sm:inline">قبلی</span>
          </button>
          
          {/* شماره صفحات */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNumber, index) => (
              pageNumber === -1 ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors min-w-[40px] ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {pageNumber.toLocaleString('fa-IR')}
                </button>
              )
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-md border border-gray-300 
                     hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                     flex items-center gap-1"
          >
            <span className="hidden sm:inline">بعدی</span>
            <span>»</span>
          </button>
          
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-md border border-gray-300 
                     hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                     flex items-center gap-1"
          >
            <span className="hidden sm:inline">انتها</span>
            <span>»»</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading && allAnalyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mt-3 text-sm text-gray-600">در حال بارگذاری آنالیزها...</span>
      </div>
    );
  }

  return (
    <div 
      id="analysis-container"
      className={`${compact ? '' : 'bg-white rounded-xl shadow-lg border border-gray-300 mb-6'}`}
    >
      {/* Header با طراحی واضح‌تر */}
      {showHeader && (
        <div className={`p-4 ${compact ? 'pb-3' : 'border-b'} bg-gradient-to-r from-blue-100 to-blue-200 ${compact ? 'rounded-t-xl' : 'rounded-t-xl'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <span className="text-blue-600 text-lg">📊</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">لیست کامل آنالیزها</h3>
                {!compact && user && (
                  <p className="text-sm text-gray-700 mt-1">
                    برای کاربر: <span className="font-semibold text-blue-700">{user.name}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {allAnalyses.length > 0 && (
                <button
                  onClick={toggleDisplayMode}
                  className="text-sm px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 
                           border border-blue-300 rounded-lg transition-colors flex items-center gap-2 font-medium"
                >
                  {showAllItems ? (
                    <>
                      <span>📄</span>
                      نمایش صفحه‌بندی شده
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      نمایش همه ({allAnalyses.length})
                    </>
                  )}
                </button>
              )}
              <button
                onClick={fetchAnalyses}
                className="text-sm px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 
                         border border-blue-700 rounded-lg transition-colors flex items-center gap-2 font-medium"
                disabled={loading}
              >
                <span className={`${loading ? 'animate-spin' : ''}`}>🔄</span>
                {loading ? 'در حال بروزرسانی...' : 'بروزرسانی لیست'}
              </button>
            </div>
          </div>
          
          {/* آمار و اطلاعات */}
          {allAnalyses.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-blue-300/50">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">📈</span>
                <span className="text-sm text-gray-700">
                  <span className="font-bold">{allAnalyses.length}</span> آنالیز ثبت شده
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">✅</span>
                <span className="text-sm text-gray-700">
                  <span className="font-bold">
                    {allAnalyses.filter(a => a.status === 'completed').length}
                  </span> تکمیل شده
                </span>
              </div>
              
              {!paginationData.showAll && paginationData.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">📄</span>
                  <span className="text-sm text-gray-700">
                    صفحه <span className="font-bold">{currentPage.toLocaleString('fa-IR')}</span> از{' '}
                    <span className="font-bold">{paginationData.totalPages.toLocaleString('fa-IR')}</span>
                  </span>
                </div>
              )}
              
              {paginationData.showAll && (
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">📋</span>
                  <span className="text-sm text-gray-700">
                    نمایش همه آیتم‌ها
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={compact ? '' : 'p-4'}>
        {error ? (
          <div className={`${compact ? 'py-3' : 'py-6'} text-center`}>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-red-50 p-4 rounded-full">
                <span className="text-2xl text-red-600">📭</span>
              </div>
              <p className="text-gray-600 font-medium">{error}</p>
              <button
                onClick={fetchAnalyses}
                className="mt-2 text-sm px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        ) : paginationData.currentItems.length === 0 ? (
          <div className={`${compact ? 'py-3' : 'py-8'} text-center`}>
            <div className="bg-blue-50 p-6 rounded-full inline-block mb-4">
              <span className="text-3xl text-blue-600">📊</span>
            </div>
            <h4 className="text-gray-700 font-medium mb-2">هیچ آنالیزی ثبت نشده است</h4>
            <p className="text-gray-500 text-sm">اولین آنالیز خود را ایجاد کنید!</p>
          </div>
        ) : (
          <>
            {/* اطلاعات نمایش فعلی */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-gray-700">
                  {paginationData.showAll ? (
                    <>
                      <span className="font-bold">📋 نمایش همه:</span>
                      <span className="font-medium mr-2"> {paginationData.totalItems} آنالیز</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold">📄 نمایش صفحه‌بندی شده:</span>
                      <span className="font-medium mr-2"> {paginationData.startIndex.toLocaleString('fa-IR')}-{paginationData.endIndex.toLocaleString('fa-IR')}</span>
                      از <span className="font-medium mr-2"> {paginationData.totalItems}</span>
                      • صفحه <span className="font-medium"> {currentPage.toLocaleString('fa-IR')}</span> از{' '}
                      <span className="font-medium"> {paginationData.totalPages.toLocaleString('fa-IR')}</span>
                    </>
                  )}
                </div>
                
              
              </div>
            </div>
            
            {/* لیست آنالیزها با طراحی بهبود یافته */}
            <div className="space-y-3">
              {paginationData.currentItems.map((analysis, index) => {
                const siteUrl = getSiteUrl(analysis);
                const rowNumber = paginationData.showAll 
                  ? index + 1 
                  : (currentPage - 1) * itemsPerPage + index + 1;
                
                return (
                  <div 
                    key={analysis.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-blue-50 
                             rounded-xl border border-gray-200 transition-all duration-200 bg-white shadow-sm"
                  >
                    {/* شماره ردیف و اطلاعات اصلی */}
                    <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-shrink-0 bg-blue-100 text-blue-700 w-8 h-8 rounded-lg 
                                      flex items-center justify-center font-bold text-sm">
                          {rowNumber}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs px-3 py-1.5 rounded-full ${getStatusColor(analysis.status)} font-medium`}>
                            {getStatusText(analysis.status)}
                          </span>
                          <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                            analysis.analysisType === 'full' 
                              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                              : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                            {analysis.analysisType === 'full' ? 'آنالیز کامل' : 'آنالیز سریع'}
                          </span>
                        </div>
                      </div>
                      
                      {/* اطلاعات سایت و زمان */}
                      <div className="space-y-3">
                        {/* URL سایت */}
                        {siteUrl ? (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-500 text-xs mt-0.5">🌐</span>
                            <div>
                              <div className="text-gray-500 text-xs mb-1">آدرس سایت:</div>
                              <div className="text-blue-700 text-sm font-medium truncate bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                                {formatUrl(siteUrl)}
                                <span className="text-xs text-gray-500 mr-2">({siteUrl.length > 50 ? 'آدرس طولانی' : 'آدرس کوتاه'})</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-xs bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            بدون آدرس سایت
                          </div>
                        )}
                        
                        {/* اطلاعات اضافی در یک ردیف */}
                        <div className="flex flex-wrap items-center gap-4">
                          {/* تاریخ و زمان */}
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">📅</span>
                            <span className="text-xs text-gray-600 font-medium">
                              {formatDate(analysis.createdAt)}
                            </span>
                          </div>
                          
                          {/* امتیاز */}
                          {analysis.score !== undefined && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">⭐</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">امتیاز:</span>
                                <span className={`text-xs font-bold ${
                                  analysis.score >= 80 ? 'text-green-600' : 
                                  analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {analysis.score}%
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* مدت زمان */}
                          {analysis.duration && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">⏱️</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">زمان:</span>
                                <span className="text-xs font-semibold text-gray-700">
                                  {analysis.duration} ثانیه
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* شناسه آنالیز */}
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">🆔</span>
                            <span className="text-xs text-gray-500 font-mono">
                              {analysis.id.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* دکمه‌های عملیاتی */}
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      {siteUrl && (
                        <button
                          onClick={() => handleViewSite(analysis)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl 
                                   hover:from-blue-700 hover:to-blue-800 transition-all flex items-center 
                                   justify-center gap-2 shadow-sm px-4 py-2.5 text-sm min-w-[140px] 
                                   hover:shadow-md"
                        >
                          <span className="text-lg">🔗</span>
                          مشاهده سایت
                        </button>
                      )}
                      
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination />
            
            {/* دکمه نمایش همه/صفحه‌بندی شده در پایین */}
            {allAnalyses.length > itemsPerPage && (
              <div className="text-center pt-4 mt-4 border-t border-gray-200">
            
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}