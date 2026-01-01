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

const CircularProgressWithTime: React.FC<CircularProgressWithTimeProps> = ({
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

  useEffect(() => {
    setPercentage(calculateProgress());
    const interval = setInterval(() => setPercentage(calculateProgress()), 1000);
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

  // Determine status
  const showAsDelayed = delayed || (isPastDeadline && !completionTime);

  // Check if we should show product image/video
  const showProductMedia = !canceled && !completionTime && !showAsDelayed;
  const mediaUrl = videoUrl || productImage;

  return (
    <div className="w-40 h-40">
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          pathColor,
          trailColor: showAsDelayed ? "#fee2e2" : "#f3f4f6",
          pathTransition: "stroke-dashoffset 0.5s ease 0s",
          ...(showAsDelayed && {
            pathColor: "#ef4444",
            trailColor: "#fee2e2",
          }),
        })}
      >
        {/* Center content */}
        <div className="text-center">
          {/* Product Image/Video or Status Icon */}
          <div className="flex justify-center mb-2">
            {showProductMedia && mediaUrl ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md relative">
                {videoUrl ? (
                  // For video, show a video thumbnail or play icon
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"></div>
                    </div>
                  </div>
                ) : (
                  // For image
                  // In the Image component, add onError handler
                  <Image
                    src={mediaUrl || 'https://via.placeholder.com/150/6b7280/ffffff?text=Product'}
                    alt={productTitle}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/150/6b7280/ffffff?text=Product';
                      target.onerror = null; // Prevent infinite loop
                    }}
                  />
                )}
              </div>
            ) : canceled ? (
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-500" />
              </div>
            ) : completionTime ? (
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            ) : showAsDelayed ? (
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            ) : (
              ""
            )}
          </div>

          {/* Percentage */}
          <div className="font-bold text-lg mb-1">
            {canceled ? (
              <span className="text-gray-600">0%</span>
            ) : completionTime ? (
              <span className="text-emerald-600">100%</span>
            ) : showAsDelayed ? (
              <span className="text-red-600">{Math.round(percentage)}%</span>
            ) : (
              <span className="text-amber-600">{Math.round(percentage)}%</span>
            )}
          </div>

          {/* Status label */}
          <div className="text-sm font-medium">
            {canceled ? (
              <span className="text-gray-500">لغو شده</span>
            ) : completionTime ? (
              <span className="text-emerald-600">تکمیل شده</span>
            ) : showAsDelayed ? (
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-600">تاخیر خورده</span>
              </div>
            ) : (
              <span className="text-amber-600">در حال انجام</span>
            )}
          </div>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default CircularProgressWithTime;