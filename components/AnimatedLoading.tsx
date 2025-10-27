"use client";
import { useState, useEffect } from "react";
import { LoadingSteps } from "./LoadingSteps";
import { EncouragementMessages } from "./EncouragementMessages";
import { ProgressWithTime } from "./ProgressWithTime";

export const AnimatedLoading = ({ progress, elapsedTime }: { progress: number; elapsedTime: number }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);

  useEffect(() => {
    const step = Math.floor((progress / 100) * 4);
    setCurrentStep(step);
  }, [progress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEncouragement(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/90 to-blue-800/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-full animate-spin-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-blue-300/20 to-blue-600/20 rounded-full animate-spin-slow-reverse"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-2xl w-full mx-4 border border-white/20 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <svg
                className="w-10 h-10 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full blur opacity-30 animate-ping"></div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">
            در حال آماده‌سازی گزارش...
          </h3>
          <p className="text-blue-100 text-lg">
            در حال بررسی کامل وبسایت و تولید گزارش دقیق
          </p>
        </div>

        {/* Main Progress with Time */}
        <div className="mb-8">
          <ProgressWithTime progress={progress} elapsedTime={elapsedTime} />
          
          {/* Animated Progress Bar */}
          <div className="relative h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
            </div>
            
            {/* Progress Dots */}
            <div className="absolute inset-0 flex justify-between items-center px-2">
              {[0, 25, 50, 75, 100].map((point) => (
                <div
                  key={point}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    progress >= point ? "bg-white shadow-lg" : "bg-white/30"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="mb-6">
          <LoadingSteps currentStep={currentStep} />
        </div>

        {/* Encouragement Messages */}
        <EncouragementMessages showEncouragement={showEncouragement} />

   

        {/* Quick Tips Section */}
        {elapsedTime > 15 && (
          <div className="mt-6 max-w-2xl w-full mx-4 animate-fade-in-up">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h4 className="text-white font-bold text-lg mb-3 flex items-center">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                نکته: آنالیز عمیق در حال انجام است
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100 text-sm">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>بررسی بیش از ۵۰ معیار مختلف</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>آنالیز سئو و عملکرد کامل</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>بررسی امنیت و بهترین روش‌ ها</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>تهیه گزارش دقیق و کاربردی</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};