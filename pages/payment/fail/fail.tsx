"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Home, AlertCircle, X } from "lucide-react";

export default function PaymentFailPage() {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      router.push("/payment");
      setRetrying(false);
    }, 1000);
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/20 to-orange-50/10 relative overflow-hidden">
      {/* Minimal Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-gradient-to-r from-red-100/20 to-orange-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-gradient-to-r from-pink-100/10 to-rose-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-20 w-4 h-4 bg-gray-900 rounded-full"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-gray-900 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-gray-900 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-gray-900 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-[1250px] m-auto mx-auto py-12 px-4">
        {/* Failure Animation Container */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-xl"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <div className="relative">
                <X className="w-16 h-16 text-white" strokeWidth={2} />
                <div className="absolute inset-0 animate-ping">
                  <X className="w-16 h-16 text-white/40" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="flex justify-between gap-8">
          <div className="bg-white/70 w-2/3 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 p-8 mb-8 relative overflow-hidden">
            {/* Accent Border */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-b-full"></div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full px-4 py-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-700 text-sm font-medium">
                  پرداخت ناموفق
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                پرداخت انجام نشد
              </h1>
              <p className="text-gray-600 leading-relaxed">
                متأسفانه پرداخت شما با مشکل مواجه شد. لطفاً مجدداً تلاش کنید.
              </p>
            </div>

            {/* Error Details - Minimal Design */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <span className="text-gray-600 text-sm">وضعیت پرداخت</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-red-600">ناموفق</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <span className="text-gray-600 text-sm">زمان وقوع</span>
                <span className="font-medium text-gray-800">
                  {new Date().toLocaleDateString("fa-IR")}
                </span>
              </div>
            </div>

            {/* Action Buttons - Minimal Style */}
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="flex-1 bg-[#ff4444] hover:bg-red-700 text-white py-3.5 px-4 rounded-2xl font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {retrying ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                {retrying ? "در حال تلاش..." : "تلاش مجدد پرداخت"}
              </button>
              <button
                onClick={handleHome}
                className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 py-3.5 px-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                بازگشت به خانه
              </button>
            </div>
          </div>

          {/* Next Steps - Minimal Design */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-6 text-center text-lg">
              راه‌های حل مشکل
            </h3>
            <div className="space-y-4">
              {[
                { 
                  step: 1, 
                  text: "بررسی موجودی حساب و اطلاعات کارت بانکی" 
                },
                { 
                  step: 2, 
                  text: "اطمینان از اتصال اینترنت و تلاش مجدد" 
                },
                { 
                  step: 3, 
                  text: "تماس با پشتیبانی در صورت کسر وجه" 
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50/50 transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium group-hover:border-gray-300 transition-colors">
                    {item.step}
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {item.text}
                  </span>
                  <div className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Info - Minimal */}
        <div className="text-center">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 p-6">
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-3">
                در صورت کسر وجه از حساب شما
              </p>
              <p className="text-orange-600 text-sm font-medium bg-orange-50/50 rounded-xl py-2 px-4 inline-block">
                مبلغ طی ۷۲ ساعت به حساب شما بازمی‌گردد
              </p>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              برای راهنمایی بیشتر با پشتیبانی تماس بگیرید
            </p>
            <div className="font-mono text-gray-800 text-lg font-medium bg-gray-50/50 rounded-xl py-2 px-4 inline-block">
              ۱۴ ۵۹ ۵۱ ۸۸ - ۰۲۱
            </div>
            <p className="text-gray-500 text-xs mt-3">پشتیبانی ۲۴ ساعته</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 py-2 px-4 rounded-xl hover:bg-white/50 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">بازگشت به صفحه قبل</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay for Retry */}
      {retrying && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-[#ff4444] animate-spin" />
              <span className="text-gray-700 font-medium">در حال انتقال به درگاه پرداخت...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}