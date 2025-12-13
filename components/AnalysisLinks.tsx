'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  phone: string;
  email?: string;
}

interface Analysis {
  id: string;
  url: string;
  phoneNumber: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  analysisType: string;
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  name?: string;
  result?: any;
  sitemapAnalysis?: {
    totalLinks: number;
    sitemapExists: boolean;
    sitemapUrls: string[];
    sitemapLinks: Array<{ url: string; sitemap: string }>;
  };
  [key: string]: any;
}

interface ApiResponse {
  analyses: Analysis[];
}

interface AnalysisLinksProps {
  compact?: boolean;
  showHeader?: boolean;
  itemsPerPage?: number;
  showAllByDefault?: boolean;
}

export default function AnalysisLinks({ 
  compact = false, 
  showHeader = true,
  itemsPerPage = 7,
  showAllByDefault = false
}: AnalysisLinksProps) {
  const [allAnalyses, setAllAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllItems, setShowAllItems] = useState(showAllByDefault);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
  const router = useRouter();

  // محاسبه داده‌های صفحه‌بندی
  const paginationData = useMemo(() => {
    const totalItems = allAnalyses.length;
    if (showAllItems) {
      return {
        totalItems,
        totalPages: 1,
        currentItems: allAnalyses,
        startIndex: 1,
        endIndex: totalItems,
        showAll: true
      };
    } else {
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
  const fetchAnalyses = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Get logged in user
      const meRes = await fetch('/api/auth/me', {
        cache: forceRefresh ? 'no-cache' : 'default'
      });
      
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
      
      // 2. Fetch all analyses با timestamp برای جلوگیری از cache
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/analyses?t=${timestamp}`, {
        headers: { 
          'x-user-phone': loggedUser.phone,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
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
        setLastRefresh(new Date());
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
        setLastRefresh(new Date());
        return;
      }
      
      // 5. Sort by date (newest first)
      const sorted = filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // 6. بررسی و لاگ آنالیزهای امروز برای دیباگ
      const today = new Date().toDateString();
      const todayAnalyses = sorted.filter(item => 
        new Date(item.createdAt).toDateString() === today
      );
      
      console.log('کل آنالیزها:', sorted.length);
      console.log('آنالیزهای امروز:', todayAnalyses.length);
      todayAnalyses.forEach((item, index) => {
        console.log(`آنالیز امروز ${index + 1}:`, {
          id: item.id,
          url: item.url,
          createdAt: item.createdAt,
          status: item.status
        });
      });
      
      setAllAnalyses(sorted);
      setCurrentPage(1);
      setLastRefresh(new Date());
      
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
    
    const element = document.getElementById('analysis-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // تابع برای تغییر حالت نمایش
  const toggleDisplayMode = () => {
    setShowAllItems(!showAllItems);
    if (!showAllItems) {
      setCurrentPage(1);
    }
    const element = document.getElementById('analysis-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    fetchAnalyses(true); // اولین بار با force refresh
    
    // شروع polling هر 15 ثانیه
    const interval = setInterval(() => {
      fetchAnalyses();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / (3600000 * 24));
    
    if (diffMins < 1) {
      return 'همین لحظه';
    } else if (diffMins < 60) {
      return `${diffMins} دقیقه پیش`;
    } else if (diffHours < 24) {
      return `${diffHours} ساعت پیش`;
    } else {
      return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
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

  // تابع برای باز کردن سایت در تب جدید
  const handleViewSite = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // تابع برای مشاهده تحلیل در تب جدید
  const handleViewAnalysisInNewTab = (analysis: Analysis, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    // ذخیره تحلیل در localStorage برای استفاده در صفحه تحلیل
    const analysisData = {
      ...analysis,
      url: analysis.url || '',
      status: analysis.status || 'completed',
      performance: analysis.performance || 0,
      accessibility: analysis.accessibility || 0,
      bestPractices: analysis.bestPractices || 0,
      seo: analysis.seo || 0,
      result: analysis.result || {},
      sitemapAnalysis: analysis.sitemapAnalysis || null
    };
    
    localStorage.setItem('currentAnalysis', JSON.stringify(analysisData));
    localStorage.setItem('analysisUrl', analysis.url || '');
    
    // باز کردن صفحه تحلیل در تب جدید
    const url = `/analyze?id=${analysis.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // کامپوننت Pagination
  const Pagination = () => {
    const { totalPages, totalItems, startIndex, endIndex, showAll } = paginationData;
    
    if (showAll || totalPages <= 1) return null;
    
    const pageNumbers = getPageNumbers(currentPage, totalPages);
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{totalItems.toLocaleString('fa-IR')}</span> مورد یافت شد • 
          نمایش <span className="font-medium">{startIndex.toLocaleString('fa-IR')}</span> تا{' '}
          <span className="font-medium">{endIndex.toLocaleString('fa-IR')}</span> • 
          صفحه <span className="font-medium">{currentPage.toLocaleString('fa-IR')}</span> از{' '}
          <span className="font-medium">{totalPages.toLocaleString('fa-IR')}</span>
        </div>
        
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

  // تابع برای فرمت تاریخ آخرین بروزرسانی
  const formatLastRefresh = () => {
    if (!lastRefresh) return '';
    return formatDate(lastRefresh.toISOString());
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
                onClick={() => fetchAnalyses(true)}
                className="text-sm px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 
                         border border-blue-700 rounded-lg transition-colors flex items-center gap-2 font-medium"
                disabled={loading}
              >
                <span className={`${loading ? 'animate-spin' : ''}`}>🔄</span>
                {loading ? 'در حال بروزرسانی...' : 'بروزرسانی لیست'}
              </button>
            </div>
          </div>
          
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
              
              {lastRefresh && (
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">🕐</span>
                  <span className="text-sm text-gray-700">
                    آخرین بروزرسانی: {formatLastRefresh()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className={compact ? '' : 'p-4'}>
        {error ? (
          <div className={`${compact ? 'py-3' : 'py-6'} text-center`}>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-red-50 p-4 rounded-full">
                <span className="text-2xl text-red-600">📭</span>
              </div>
              <p className="text-gray-600 font-medium">{error}</p>
              <button
                onClick={() => fetchAnalyses(true)}
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
                
                <div className="text-xs text-gray-500">
                  {lastRefresh && (
                    <span>آخرین بروزرسانی: {formatLastRefresh()}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {paginationData.currentItems.map((analysis, index) => {
                const rowNumber = paginationData.showAll 
                  ? index + 1 
                  : (currentPage - 1) * itemsPerPage + index + 1;
                
                return (
                  <div 
                    key={analysis.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-blue-50 
                             rounded-xl border border-gray-200 transition-all duration-200 bg-white shadow-sm"
                  >
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
                          
                          {/* نشانگر آنالیز امروز */}
                          {new Date(analysis.createdAt).toDateString() === new Date().toDateString() && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 border border-green-300 rounded-lg font-medium">
                              🆕 امروز
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {/* URL سایت */}
                        {analysis.url ? (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-500 text-xs mt-0.5">🌐</span>
                            <div>
                              <div className="text-gray-500 text-xs mb-1">آدرس سایت:</div>
                              <div 
                                onClick={() => handleViewSite(analysis.url)}
                                className="text-blue-700 text-sm font-medium truncate bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer"
                              >
                                {formatUrl(analysis.url)}
                                <span className="text-xs text-gray-500 mr-2">({analysis.url.length > 50 ? 'آدرس طولانی' : 'آدرس کوتاه'})</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-xs bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            بدون آدرس سایت
                          </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">📅</span>
                            <span className="text-xs text-gray-600 font-medium" title={new Date(analysis.createdAt).toLocaleString('fa-IR')}>
                              {formatDate(analysis.createdAt)}
                            </span>
                          </div>  
                          
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
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* دکمه مشاهده تحلیل در تب جدید */}
                        <button
                          onClick={(e) => handleViewAnalysisInNewTab(analysis, e)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl 
                                   hover:from-blue-700 hover:to-blue-800 transition-all flex items-center 
                                   justify-center gap-2 shadow-sm px-4 py-2.5 text-sm min-w-[140px] 
                                   hover:shadow-md group relative"
                          title="مشاهده تحلیل در تب جدید"
                        >
                          <span className="text-lg">📊</span>
                          <span>مشاهده تحلیل</span>
                          <span className="absolute -top-2 -right-2 bg-blue-800 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            🔗
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Pagination />
            
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