'use client';

import React, { useState } from "react";
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
  const { isLoggedIn, user } = useAuth(); 
  const { orders, loading: ordersLoading } = useUserOrders();
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-100/50 border border-white/50 max-w-md w-full text-center transform transition-all duration-300 hover:scale-[1.02]">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 ring-4 ring-blue-50">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">ورود به حساب کاربری</h3>
          <p className="text-gray-600 mb-6 text-sm md:text-base">برای مشاهده داشبورد، لطفاً وارد حساب کاربری خود شوید</p>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 md:px-8 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 text-sm md:text-base">
            ورود / ثبت ‌نام
          </button>
        </div>
      </div>
    );
  }
  
  if (ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-base md:text-lg font-semibold text-gray-700">در حال بارگذاری اطلاعات...</p>
          <p className="text-gray-500 text-sm mt-2">لطفاً چند لحظه صبر کنید</p>
        </div>
      </div>
    );
  }
  
  const safeOrders = orders || [];
  
  const sortedOrders = [...safeOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const displayedOrders = showAllOrders ? sortedOrders : sortedOrders.slice(0, 5);

  const completedItems = safeOrders.flatMap((order) => {
    if (!order || !order.items) return [];
    return order.items
      .filter((item) => item?.adminStatus === "completed")
      .map((item) => ({
        ...item,
        createdAt: order.createdAt || new Date().toISOString(),
        orderId: order.id,
      }));
  });

  const sortedCompletedItems = [...completedItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const latestCompletedItem = sortedCompletedItems[0];
  const matchedVideo = latestCompletedItem
    ? productVideoMap.find((video) => {
        const productTitle = latestCompletedItem?.variant?.product?.title || "";
        return productTitle.includes(video.keyword);
      })
    : null;
    
  const getStatusColor = (status:any) => {
    switch(status) {
      case 'completed': return 'bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-100';
      case 'pending': return 'bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-700 border border-amber-200 shadow-sm shadow-amber-100';
      case 'processing': return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm shadow-blue-100';
      case 'cancelled': return 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200 shadow-sm shadow-red-100';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200 shadow-sm shadow-gray-100';
    }
  };
  
  const getStatusIcon = (status:any) => {
    switch(status) {
      case 'completed': return (
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      );
      case 'pending': return (
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'processing': return (
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
      case 'cancelled': return (
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
      default: return (
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };
  
  const getStatusLabel = (status:any) => {
    switch(status) {
      case 'completed': return 'تکمیل شده';
      case 'pending': return 'در انتظار';
      case 'processing': return 'در حال پردازش';
      case 'cancelled': return 'لغو شده';
      case 'in_progress': return 'در حال پردازش';
      default: return status;
    }
  };
  
  const totalOrders = safeOrders.length;
  const totalCompleted = completedItems.length;
  const totalInProgress = safeOrders.reduce((sum, order) => {
    if (!order || !order.items) return sum;
    return sum + order.items.filter(item => item?.adminStatus !== 'completed' && item?.adminStatus !== 'cancelled').length;
  }, 0);
  
  const formatDate = (dateString:any) => {
    if (!dateString) return '-- / -- / --';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const totalDisplayedItems = displayedOrders.reduce((sum, order) => {
    return sum + (order.items?.length || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/10 to-gray-50 p-3 md:p-4 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg shadow-blue-100/50 border border-white/50 backdrop-blur-sm flex-1">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 lg:gap-6">
              <div className="relative mb-4 sm:mb-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    {user?.name?.charAt(0) || "ک"}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-right">
                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl lg:text-2xl font-bold text-gray-900">
                    سلام، <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{user?.name || "کاربر"}</span>
                  </h1>
                </div>
                <p className="text-gray-600 text-sm md:text-base">امیدواریم روز خوبی داشته باشید</p>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 flex-shrink-0">
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg shadow-blue-100/30 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 m-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">{totalOrders}</p>
                <p className="text-gray-500 text-xs md:text-sm">کل سفارش‌ ها</p>
              </div>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg shadow-emerald-100/30 border border-gray-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 m-auto bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">{totalCompleted}</p>
                <p className="text-gray-500 text-xs md:text-sm text-center">تکمیل شده</p>
              </div>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg shadow-amber-100/30 border border-gray-100 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br m-auto from-amber-100 to-yellow-200 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-center text-gray-900">{totalInProgress}</p>
                <p className="text-gray-500 text-xs md:text-sm text-center">در حال انجام</p>
              </div>
            </div>
          </div>
        </div>
   
        {/* Recent Orders Section */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl md:rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 lg:p-8 border-b border-gray-100/50 bg-gradient-to-r from-white to-blue-50/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">سفارشات اخیر</h3>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 mt-3 sm:mt-0">
                <div className="flex items-center gap-2 md:gap-3">
                  {totalOrders > 5 && (
                    <button
                      onClick={() => setShowAllOrders(!showAllOrders)}
                      className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
                    >
                      {showAllOrders ? (
                        <>
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4l4 4" />
                          </svg>
                          <span className="hidden sm:inline">نمایش کمتر</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                          <span className="hidden sm:inline">مشاهده تمامی سفارشات</span>
                          <span className="sm:hidden">همه سفارشات</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto -mx-4 md:mx-0">
            {displayedOrders.length > 0 ? (
              <div className="min-w-full">
                {/* جدول برای دسکتاپ */}
                <table className="w-full hidden md:table">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-center p-4 md:p-6 font-semibold text-gray-700 text-sm border-b border-gray-100/50">محصول</th>
                      <th className="text-center p-4 md:p-6 font-semibold text-gray-700 text-sm border-b border-gray-100/50">تاریخ سفارش</th>
                      <th className="text-center p-4 md:p-6 font-semibold text-gray-700 text-sm border-b border-gray-100/50">کد سفارش</th>
                      <th className="text-center p-4 md:p-6 font-semibold text-gray-700 text-sm border-b border-gray-100/50">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {displayedOrders.map((order) => (
                      order.items?.map((item, itemIndex) => (
                        <tr key={`${order.id}-${item.id}`} className="group hover:bg-blue-50/30 transition-colors duration-200">
                          <td className="p-4 md:p-6">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center border border-gray-200 group-hover:border-blue-200 transition-colors">
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors text-sm md:text-base">
                                  {item?.variant?.product?.title || "محصول نامشخص"}
                                </p>
                                <p className="text-gray-500 text-xs md:text-sm mt-1">تعداد: {item?.quantity || 0} عدد</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 md:p-6">
                            <div className="text-right">
                              <p className="font-medium text-gray-900 text-center text-sm md:text-base">{formatDate(order.createdAt).split('،')[0]}</p>
                              <p className="text-gray-500 text-xs md:text-sm">{formatDate(order.createdAt).split('،')[1]}</p>
                            </div>
                          </td>
                          <td className="p-4 md:p-6">
                            <div className="bg-gray-50 rounded-lg px-3 py-2 inline-block">
                              <code className="text-gray-700 font-mono text-xs md:text-sm">
                                #{order.id?.slice(-8) || "---"}
                              </code>
                            </div>
                          </td>
                          <td className="p-4 md:p-6">
                            <div className="flex justify-end">
                              <span className={`inline-flex m-auto gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-medium ${getStatusColor(item?.adminStatus)}`}>
                                {getStatusIcon(item?.adminStatus)}
                                {getStatusLabel(item?.adminStatus)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
                
                {/* کارت‌ها برای موبایل */}
                <div className="md:hidden space-y-4 p-4">
                  {displayedOrders.map((order) => (
                    order.items?.map((item, itemIndex) => (
                      <div key={`${order.id}-${item.id}-mobile`} className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {item?.variant?.product?.title || "محصول نامشخص"}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">تعداد: {item?.quantity || 0} عدد</p>
                            </div>
                          </div>
                          <span className={`inline-flex gap-1 px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(item?.adminStatus)}`}>
                            {getStatusIcon(item?.adminStatus)}
                            {getStatusLabel(item?.adminStatus)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">تاریخ سفارش</p>
                            <p className="font-medium text-gray-900 text-sm">{formatDate(order.createdAt).split('،')[0]}</p>
                            <p className="text-gray-500 text-xs">{formatDate(order.createdAt).split('،')[1]}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">کد سفارش</p>
                            <div className="bg-gray-50 rounded px-2 py-1.5 mt-1">
                              <code className="text-gray-700 font-mono text-xs">
                                #{order.id?.slice(-6) || "---"}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h4 className="text-lg md:text-xl font-semibold text-gray-700 mb-3">هنوز سفارشی ثبت نکرده‌اید</h4>
                <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm md:text-base">
                  با ثبت اولین سفارش، می‌توانید از خدمات حرفه‌ای ما استفاده کنید و نتایج را در اینجا مشاهده کنید.
                </p>
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-sm md:text-base">
                  ثبت اولین سفارش
                </button>
              </div>
            )}
          </div>
          
          {displayedOrders.length > 0 && (
            <div className="p-4 md:p-6 lg:p-8 border-t border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 text-xs md:text-sm">نمایش {Math.min(totalDisplayedItems, totalOrders)} آیتم از {totalDisplayedItems}</span>
                  </div>
                </div>
                {totalOrders > 5 && (
                  <button
                    onClick={() => setShowAllOrders(!showAllOrders)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base flex items-center gap-1.5 md:gap-2 transition-colors"
                  >
                    {showAllOrders ? (
                      <>
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4l4 4" />
                        </svg>
                        نمایش سفارشات کمتر
                      </>
                    ) : (
                      <>
                        مشاهده تمام سفارشات
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Analysis Links Section - با قابلیت آکاردئون اصلاح شده */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl md:rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
          <button
            onClick={() => setExpandedAnalysis(!expandedAnalysis)}
            className="w-full p-4 md:p-6 lg:p-8 border-b border-gray-100/50 bg-gradient-to-r from-white to-emerald-50/30 hover:bg-emerald-50/50 transition-all duration-300 text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">تحلیل‌ ها و گزارشات</h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">
                    {expandedAnalysis ? 'برای بستن کلیک کنید' : 'برای مشاهده تحلیل‌ ها کلیک کنید'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 mt-3 sm:mt-0">
                <span className={`px-3 py-1.5 md:px-4 md:py-2 ${expandedAnalysis ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-50 text-emerald-700'} font-medium rounded-xl transition-colors duration-300 text-sm md:text-base`}>
                  {expandedAnalysis ? 'بستن' : 'مشاهده تحلیل‌ ها'}
                </span>
                <div className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${expandedAnalysis ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
          
          {/* محتوای تحلیل‌ها - فقط وقتی expandedAnalysis true باشد نمایش داده می‌شود */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            expandedAnalysis ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-1">
              <AnalysisLinks 
                compact={true}
                showHeader={false}
                itemsPerPage={10}
                showAllByDefault={false}
              />
            </div>
          </div>
        </div>
  
      </div>
    </div>
  );
};

export default DashboardHome;