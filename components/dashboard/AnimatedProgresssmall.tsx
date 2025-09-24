"use client";

import React, { useEffect, useState } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";

interface CircularProgressWithTimeProps {
  startTime?: string;
  deadline?: string;
  completionTime?: string;
  delayed?: boolean;
  canceled?: boolean;
}

const CircularProgressWithTimesmall: React.FC<CircularProgressWithTimeProps> = ({
  startTime,
  deadline,
  completionTime,
  delayed = false,
  canceled = false,
}) => {
  const [percentage, setPercentage] = useState(0);

  // If startTime or deadline are missing, don't show the progress
  if (!startTime || !deadline) {
    return (
      <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full">
        {/* Optional: small placeholder or icon */}
      </div>
    );
  }

  const calculateProgress = () => {
    if (completionTime) return 100;
    const start = new Date(startTime).getTime();
    const end = new Date(deadline).getTime();
    const now = Date.now();

    if (isNaN(start) || isNaN(end)) return 0;
    if (now >= end) return 100;
    if (now <= start) return 0;

    return Math.min(Math.max(((now - start) / (end - start)) * 100, 0), 100);
  };

  useEffect(() => {
    setPercentage(calculateProgress());
    const interval = setInterval(() => setPercentage(calculateProgress()), 1000);
    return () => clearInterval(interval);
  }, [startTime, deadline, completionTime]);

  // Determine path color
  let pathColor = "#f59e0b"; // in_progress default
  if (percentage === 100) pathColor = "#16a34a"; // completed
  if (delayed) pathColor = "#ef4444"; // delayed
  if (canceled) pathColor = "#9ca3af"; // canceled

  return (
    <div className="w-20 h-20">
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          pathColor,
          trailColor: "#eeeeee",
        })}
      />
    </div>
  );
};

export default CircularProgressWithTimesmall;
