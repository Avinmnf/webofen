"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function PaymentFailPage() {
  const router = useRouter();

  const handleRetry = () => {
    router.push("/payment");
  };

  return (
    <>
      <Head>
        <title>پرداخت ناموفق | فروشگاه</title>
        <meta name="description" content="پرداخت شما انجام نشد" />
      </Head>

      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          {/* Failure Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          {/* Failure Message */}
          <h1 className="text-2xl font-bold text-red-700 mb-4">
            پرداخت ناموفق
          </h1>
          
          <p className="text-gray-700 mb-6">
            متأسفانه پرداخت شما انجام نشد. لطفاً مجدداً تلاش کنید یا با پشتیبانی تماس بگیرید.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
            >
              تلاش مجدد
            </button>
            
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              در صورت کسر وجه از حساب، طی ۷۲ ساعت به حساب شما بازمی‌گردد.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}