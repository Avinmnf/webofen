"use client";
import { useState, useEffect } from "react";

export const EncouragementMessages = ({ showEncouragement }: { showEncouragement: boolean }) => {
  const messages = [
    "🕒 کمی بیشتر صبر کنید... آنالیز دقیق در حال انجام است",
    "📊 در حال جمع‌آوری داده‌های دقیق از وبسایت...",
    "🔍 بررسی عمیق تمام بخش‌های وبسایت...",
    "⚡ به زودی گزارش کامل آماده می‌شود!",
    "🎯 آنالیز حرفه‌ای نیاز به زمان دارد...",
    "💎 ارزش صبر کردن را دارد! گزارش بسیار دقیقی دریافت خواهید کرد",
    "🚀 در حال بررسی بیش از ۵۰ معیار مختلف...",
    "📈 آنالیز کامل سئو، عملکرد و امنیت در حال انجام است"
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (!showEncouragement) return;

    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [showEncouragement, messages.length]);

  if (!showEncouragement) return null;

  return (
    <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-fade-in">
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-blue-100 text-sm font-medium leading-relaxed">
            {messages[currentMessage]}
          </p>
        </div>
      </div>
    </div>
  );
};