"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Download, Mail, Copy, Check, ArrowLeft, Sparkles } from "lucide-react";
import { useUserOrders } from "@/hooks/useUserOrders";
import SuccessAnimation from "@/components/animations/SuccessAnimation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();
  const { orders, loading: ordersLoading } = useUserOrders();
  const [confetti, setConfetti] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    clearCart();
    setConfetti(true);
    setPaymentDate(new Date().toLocaleDateString("fa-IR"));

    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [clearCart]);

  useEffect(() => {
    if (!ordersLoading && orders.length > 0) {
      const latestOrder = orders[orders.length - 1];
      setTrackingNumber(latestOrder.id);
    }
  }, [orders, ordersLoading]);

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className=" min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Minimal Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-gradient-to-r from-green-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-gradient-to-r from-purple-100/10 to-pink-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-20 w-4 h-4 bg-gray-900 rounded-full"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-gray-900 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-gray-900 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-gray-900 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-[1250px] m-auto mx-auto py-12">
        {/* Success Animation Container */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-xl"></div>
          </div>
          <div className="relative flex justify-center">
            <SuccessAnimation />
          </div>
        </div>

        {/* Main Content Card */}
        <div className="flex justify-between">
          <div className="bg-white/70 w-2/3 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 p-8 mb-8 relative overflow-hidden">
            {/* Accent Border */}

            <div className="text-center mb-8">

              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                سفارش شما ثبت شد
              </h1>
              <p className="text-gray-600 leading-relaxed">
                می‌توانید سفارش خود را در داشبورد مدیریت کنید
              </p>
            </div>

            {/* Order Details - Minimal Design */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <span className="text-gray-600 text-sm">شماره پیگیری</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-800 font-medium">
                    {ordersLoading ? "..." : trackingNumber}
                  </span>
                  <button
                    onClick={copyTrackingNumber}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <span className="text-gray-600 text-sm">تاریخ پرداخت</span>
                <span className="font-medium text-gray-800">
                  {paymentDate || "..."}
                </span>
              </div>
            </div>

            {/* Action Buttons - Minimal Style */}
            <div className="flex gap-3">
              <button className="flex-1 bg-[#29b0cb] hover:bg-blue-950 text-white py-3 rounded-md font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 group">
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-white">دریافت فاکتور</span>
              </button>
              <Link
                href={"/dashboard"}
                className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 py-3 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    id="meteor-icon-kit__regular-dashboard"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3 2C2.44772 2 2 2.44772 2 3V6C2 6.55228 2.44772 7 3 7H6C6.55228 7 7 6.55228 7 6V3C7 2.44772 6.55228 2 6 2H3ZM3 0H6C7.65685 0 9 1.34315 9 3V6C9 7.65685 7.65685 9 6 9H3C1.34315 9 0 7.65685 0 6V3C0 1.34315 1.34315 0 3 0ZM14 16H21C22.6569 16 24 17.3431 24 19V21C24 22.6569 22.6569 24 21 24H14C12.3431 24 11 22.6569 11 21V19C11 17.3431 12.3431 16 14 16ZM14 18C13.4477 18 13 18.4477 13 19V21C13 21.5523 13.4477 22 14 22H21C21.5523 22 22 21.5523 22 21V19C22 18.4477 21.5523 18 21 18H14ZM3 11H6C7.65685 11 9 12.3431 9 14V21C9 22.6569 7.65685 24 6 24H3C1.34315 24 0 22.6569 0 21V14C0 12.3431 1.34315 11 3 11ZM3 13C2.44772 13 2 13.4477 2 14V21C2 21.5523 2.44772 22 3 22H6C6.55228 22 7 21.5523 7 21V14C7 13.4477 6.55228 13 6 13H3ZM21 0C22.6569 0 24 1.34315 24 3V11C24 12.6569 22.6569 14 21 14H14C12.3431 14 11 12.6569 11 11V3C11 1.34315 12.3431 0 14 0H21ZM13 3V11C13 11.5523 13.4477 12 14 12H21C21.5523 12 22 11.5523 22 11V3C22 2.44772 21.5523 2 21 2H14C13.4477 2 13 2.44772 13 3Z"
                        fill="#545454"
                      ></path>
                    </g>
                  </svg>
                  <span className="text-gray-600">داشبورد</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Next Steps - Minimal Design */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-6 text-center text-lg">
              مراحل بعدی
            </h3>
            <div className="space-y-4">
              {[
                { step: 1, text: "تایید نهایی سفارش در کمترین زمان" },
                { step: 2, text: "وارد کردن مقادیر مورد نیاز در داشبورد" },
                { step: 3, text: "انجام و تکمیل سفارش" },
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
                  <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Support Info - Minimal */}
        <div className="text-center">
          <div className="bg-[#0364af] backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 p-6">
            <p className="text-white text-sm mb-3">در صورت وجود هرگونه سوال</p>
            <div className="font-mono text-gray-800 text-lg font-medium bg-gray-50/50 rounded-xl py-2 px-4 inline-block">
              ۱۴ ۵۹ ۵۱ ۸۸ - ۰۲۱
            </div>
            <p className="text-white text-xs mt-3">پشتیبانی ۲۴ ساعته</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 py-2 px-4 rounded-xl hover:bg-white/50 transition-all duration-200 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">بازگشت به فروشگاه</span>
          </button>
        </div>
      </div>

      {/* Copied Toast */}
      {copied && (
        <div className="z-50 fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-lg animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" />
            شماره پیگیری کپی شد
          </div>
        </div>
      )}
    </div>
  );
}
