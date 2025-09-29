"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/contexts/CartContext";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [countdown, setCountdown] = useState(60);
  const [refId, setRefId] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null); // ⬅️ use number

  useEffect(() => {
    if (!router.isReady) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get("paymentSuccess");
    const ref_id = urlParams.get("ref_id");

    if (paymentSuccess !== "true") {
      return;
    }

    if (ref_id) setRefId(ref_id);

    clearCart();
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("cart_")) localStorage.removeItem(key);
    });

    window.history.replaceState({}, "", "/payment/success");

    // ⬅️ cast setInterval to number
    timerRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [router.isReady, router, clearCart]);

  const handleManualRedirect = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    clearCart();
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("cart_")) localStorage.removeItem(key);
    });
    router.push("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-green-700 mb-4">
            پرداخت موفق
          </h1>
          <p className="text-gray-700 mb-4">
            پرداخت شما با موفقیت انجام شد. سفارش شما ثبت شده و در اسرع وقت
            پردازش خواهد شد.
          </p>

          {refId && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">کد رهگیری:</p>
              <p className="font-mono text-lg font-bold text-gray-800">
                {refId}
              </p>
            </div>
          )}


          <button
            onClick={handleManualRedirect}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
          >
            ورود به داشبورد
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              در صورت وجود هرگونه سوال، با پشتیبانی تماس بگیرید.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
