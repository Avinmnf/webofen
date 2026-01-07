"use client";

import React, { useEffect, useState } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

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

  // Get status icon and text
  const getStatusContent = () => {
    if (canceled) {
      return {
        icon: <XCircle className="w-6 h-6 text-gray-500" />,
        percentageText: "0%",
        percentageColor: "text-gray-600",
        statusText: "لغو شده",
        statusColor: "text-gray-500",
        bgColor: "bg-gray-100"
      };
    } else if (completionTime) {
      return {
        icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
        percentageText: "100%",
        percentageColor: "text-emerald-600",
        statusText: "تکمیل شده",
        statusColor: "text-emerald-600",
        bgColor: "bg-emerald-100"
      };
    } else if (showAsDelayed) {
      return {
        icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
        percentageText: `${Math.round(percentage)}%`,
        percentageColor: "text-red-600",
        statusText: "تاخیر خورده",
        statusColor: "text-red-600",
        bgColor: "bg-red-100"
      };
    } else {
      return {
        icon: <Clock className="w-6 h-6 text-amber-600" />,
        percentageText: `${Math.round(percentage)}%`,
        percentageColor: "text-amber-600",
        statusText: "در حال انجام",
        statusColor: "text-gray-700",
        bgColor: "bg-amber-100"
      };
    }
  };

  const statusContent = getStatusContent();

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
        {/* Center content - Always show percentage and status */}
        <div className="text-center w-full h-full flex flex-col items-center justify-center">
  

          {/* Large percentage */}
          <div className={`font-bold text-2xl ${statusContent.percentageColor} mb-1`}>
            {statusContent.percentageText}
          </div>

          {/* Status label */}
          <div className={`text-sm font-medium ${statusContent.statusColor}`}>
            {statusContent.statusText}
          </div>

        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default CircularProgressWithTime;