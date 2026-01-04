"use client";

import React, { useEffect, useState } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

interface CircularProgressWithTimeProps {
  startTime?: string;
  deadline?: string;
  completionTime?: string;
  delayed?: boolean;
  canceled?: boolean;
  productImage?: string; // For image URLs
  videoUrl?: string;     // For video URLs
  productTitle?: string;
}

const CircularProgressWithTimesmall: React.FC<CircularProgressWithTimeProps> = ({
  startTime,
  deadline,
  completionTime,
  delayed = false,
  canceled = false,
  productImage,
  videoUrl,
  productTitle = "Product",
}) => {
  const [percentage, setPercentage] = useState(0);
  const [isPastDeadline, setIsPastDeadline] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const calculateProgress = () => {
    if (canceled) return 0;
    if (completionTime) return 100;
    if (!startTime || !deadline) return 0;

    const start = new Date(startTime).getTime();
    const end = new Date(deadline).getTime();
    const now = Date.now();

    if (isNaN(start) || isNaN(end)) return 0;
    
    const pastDeadline = now > end;
    setIsPastDeadline(pastDeadline);
    
    if (pastDeadline) return 100;
    if (now <= start) return 0;
    
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const calculateTimeRemaining = () => {
    if (!startTime || !deadline || canceled || completionTime) return "";
    
    const end = new Date(deadline).getTime();
    const now = Date.now();
    
    if (now >= end) return "مهلت گذشته";
    
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} روز`;
    } else if (hours > 0) {
      return `${hours} ساعت`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${minutes} دقیقه`;
    }
  };

  useEffect(() => {
    setPercentage(calculateProgress());
    setTimeRemaining(calculateTimeRemaining());
    const interval = setInterval(() => {
      setPercentage(calculateProgress());
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, deadline, completionTime, delayed, canceled]);

  // Determine path color based on status
  let pathColor = "#f59e0b"; // in_progress default (amber)
  
  if (canceled) {
    pathColor = "#9ca3af"; // canceled (gray)
  } else if (completionTime) {
    pathColor = "#16a34a"; // completed (green)
  } else if (delayed || isPastDeadline) {
    pathColor = "#ef4444"; // delayed or past deadline (red)
  } else if (percentage === 100) {
    pathColor = "#f59e0b"; // reached 100% but not completed (keep amber)
  }

  // Determine trail color for delayed status
  const showAsDelayed = delayed || (isPastDeadline && !completionTime);
  const trailColor = showAsDelayed ? "#fee2e2" : "#f3f4f6";

  // If startTime or deadline are missing, show placeholder
  if (!startTime || !deadline) {
    return (
      <div className="w-20 h-20 flex flex-col items-center justify-center bg-gray-100 rounded-full p-2">
        <Clock className="w-5 h-5 text-gray-400 mb-1" />
        <div className="text-gray-400 text-xs text-center">منتظر شروع</div>
      </div>
    );
  }

  // Check if we should show product image/video
  const showProductMedia = !canceled && !completionTime && !showAsDelayed;
  const mediaUrl = videoUrl || productImage;

  return (
    <div className="w-20 h-20">
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          pathColor,
          trailColor,
          pathTransition: "stroke-dashoffset 0.5s ease 0s",
          strokeLinecap: "round",
        })}
      >
        {/* Compact center content */}
        <div className="text-center w-full">
          {/* Product Image/Video or Status Icon */}
          <div className="flex justify-center mb-1">
            {showProductMedia && mediaUrl ? (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm relative">
                {videoUrl ? (
                  // For video in small circle
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  // For image
                  <Image
                    src={mediaUrl || 'https://via.placeholder.com/150/6b7280/ffffff?text=Product'}
                    alt={productTitle}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/150/6b7280/ffffff?text=Product';
                      target.onerror = null;
                    }}
                  />
                )}
              </div>
            ) : canceled ? (
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 text-gray-500" />
              </div>
            ) : completionTime ? (
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            ) : showAsDelayed ? (
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            ) : (
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            )}
          </div>

          {/* Percentage - Always show for in-progress items */}
          <div className="font-bold text-xs">
            {canceled ? (
              <span className="text-gray-600">لغو شده</span>
            ) : completionTime ? (
              <span className="text-emerald-600">تکمیل شد</span>
            ) : showAsDelayed ? (
              <span className="text-red-600">تاخیر</span>
            ) : (
              <span className="text-amber-600">{Math.round(percentage)}%</span>
            )}
          </div>

    
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default CircularProgressWithTimesmall;