'use client';

import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import AnalysisLinks from "@/components/AnalysisLinks";
import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders } from "@/hooks/useUserOrders";

const productVideoMap = [
  {
    keyword: "بک لینک",
    src: "/guidance/Hailuo_Video_A_futuristic_glowing_pill_with_420392168333352962_2.mp4",
    title: "آموزش بک لینک سازی",
    message: "تبریک! الان حال سایت شما خیلی بهتر شده",
  },
  {
    keyword: "بهینه سازی",
    src: "/guidance/Hailuo_Video_A_futuristic_glowing_pill_with_420392168333352962_1.mp4",
    title: "آموزش بهینه سازی سایت",
    message: "سفارش بهینه سازی شما تکمیل شد، آموزش مرتبط را مشاهده کنید 👇",
  },
  {
    keyword: "اسکریمینگ فراگ",
    src: "/guidance/Hailuo_Video_Create_a_smooth_looping_animat_422500566735044610_1.mp4",
    title: "آموزش کار با Screaming Frog",
    message: "گزارش Screaming Frog شما آماده است 👇",
  },
  {
    keyword: "امنیت",
    src: "/guidance/Hailuo_Video_A_futuristic_glowing_pill_with_420392168333352962.mp4",
    title: "آموزش امنیت سایت",
    message: "امنیت سایت شما برقرار است",
  },
];

const DashboardHome = () => {
  const router = useRouter();
  const { isLoggedIn, user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading } = useUserOrders();

  // Redirect only when auth check is complete AND user is not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      // Add current path to redirect back after login
      const currentPath = router.asPath;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isLoggedIn, authLoading, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">
            در حال بررسی احراز هویت...
          </p>
        </div>
      </div>
    );
  }

  // If auth check is done and user is not logged in, show loading while redirecting
  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">
            در حال هدایت به صفحه ورود...
          </p>
        </div>
      </div>
    );
  }

  // Show loading while fetching orders
  if (ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    );
  }

  // Safely handle orders data - it might be undefined or null
  const safeOrders = orders || [];
  
  // Extract completed items with proper null checks
  const completedItems = safeOrders.flatMap((order) => {
    // Check if order and order.items exist
    if (!order || !order.items) return [];
    
    return order.items
      .filter((item) => item?.adminStatus === "completed")
      .map((item) => ({
        ...item,
        createdAt: order.createdAt || new Date().toISOString(),
      }));
  });

  const sortedCompletedItems = [...completedItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const latestCompletedItem = sortedCompletedItems[0];

  const matchedVideo = latestCompletedItem
    ? productVideoMap.find((video) => {
        // Safely check product title
        const productTitle = latestCompletedItem?.variant?.product?.title || "";
        return productTitle.includes(video.keyword);
      })
    : null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-50 text-green-600 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'تکمیل شده';
      case 'pending': return 'در انتظار';
      case 'processing': return 'در حال پردازش';
      default: return status;
    }
  };

  // Calculate stats with safe data
  const totalOrders = safeOrders.length;
  const totalCompleted = completedItems.length;
  const totalInProgress = safeOrders.reduce((sum, order) => {
    if (!order || !order.items) return sum;
    return sum + order.items.filter(item => item?.adminStatus !== 'completed').length;
  }, 0);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Greeting Card */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0) || "ک"}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                خوش اومدی، <span className="text-blue-600">{user?.name || "کاربر"}</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">امیدواریم روز خوبی داشته باشید</p>
            </div>
          </div>
        </div>

        {/* Latest Video Banner - Only show if there are completed orders */}
        {matchedVideo && completedItems.length > 0 && (
          <div
            className="relative w-full aspect-[16/6] lg:aspect-[16/5] bg-gradient-to-br from-[#001933] to-[#003366] rounded-3xl overflow-hidden shadow-2xl group"
            onMouseEnter={(e) => {
              const v = e.currentTarget.querySelector("video");
              v?.play();
            }}
            onMouseLeave={(e) => {
              const v = e.currentTarget.querySelector("video");
              if (!v) return;
              v.pause();
              v.currentTime = 0;
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#001933]/90 via-[#001933]/50 to-transparent z-[1]"></div>
            
            <video
              src={matchedVideo.src}
              className="h-full w-full object-cover absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              muted
              loop
              playsInline
            />
            
            <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 lg:px-16">
              <div className="max-w-2xl space-y-4">
                {/* Success Badge */}
                <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-100 text-sm font-medium">تکمیل شده</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                  سفارش {matchedVideo.keyword} تکمیل شد
                </h2>
                
                <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                  {matchedVideo.message}
                </p>
                
                <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-3 text-white font-medium transition-all duration-300 hover:scale-105">
                  <span>مشاهده جزئیات</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{totalOrders}</p>
            <p className="text-gray-500 text-sm">سفارش‌ها</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{totalCompleted}</p>
            <p className="text-gray-500 text-sm">تکمیل شده</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">
              {totalInProgress}
            </p>
            <p className="text-gray-500 text-sm">در حال انجام</p>
          </div>
        </div>

        {/* Recent Orders - Only show if there are orders */}
        {safeOrders.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">سفارشات اخیر</h3>
                </div>
                <span className="text-sm text-gray-500">{totalOrders} سفارش</span>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {safeOrders.slice(0, 50).map((order, idx) => (
                <div
                  key={order.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${idx !== safeOrders.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium">
                              {item?.variant?.product?.title || "محصول نامشخص"}
                            </p>
                            <p className="text-sm text-gray-500">تعداد: {item?.quantity || 0} عدد</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${getStatusColor(item?.adminStatus)} whitespace-nowrap`}>
                          {getStatusLabel(item?.adminStatus)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
            <p className="text-gray-500 text-sm">اولین سفارش خود را ثبت کنید</p>
          </div>
        )}

        {/* Analysis Links */}
        <div>
          <AnalysisLinks 
            compact={true}
            showHeader={true}
            itemsPerPage={5}
            showAllByDefault={false}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;