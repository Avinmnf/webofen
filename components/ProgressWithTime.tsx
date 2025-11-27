"use client";

import { useEffect, useState } from 'react';

export const ProgressWithTime = ({ progress, elapsedTime }: { progress: number; elapsedTime: number }) => {
  const [currentProgress, setCurrentProgress] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // تایمر زمان - هیچوقت قطع نمی‌شود
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning) {
      timer = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  // تایمر درصد
  useEffect(() => {
    if (currentProgress < progress && currentProgress < 100) {
      const timer = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= progress || prev >= 100) {
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentProgress, progress]);

  // وقتی progress جدید می‌آید، فقط درصد ریست شود
  useEffect(() => {
    setCurrentProgress(1);
    // زمان ریست نمی‌شود و ادامه می‌یابد
  }, [progress]);

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2 space-x-reverse">
        <span className="text-white font-medium">پیشرفت کلی</span>
        <div className="flex items-center space-x-1 space-x-reverse bg-white/20 rounded-full px-2 py-1">
          <svg className="w-3 h-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-blue-200 text-xs">{formatTime(currentTime)}</span>
        </div>
      </div>
      <span className="text-blue-200 font-bold text-lg">{currentProgress}%</span>
    </div>
  );
};  