"use client";

import React from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ProgressCircleProps {
  percentage: number; // 0 - 100
  delayed?: boolean;
  canceled?: boolean;
}
const SmallProgressCircle: React.FC<ProgressCircleProps> = ({ percentage, delayed, canceled }) => {
  let pathColor = "#f59e0b"; // default in_progress
  if (percentage === 100) pathColor = "#16a34a"; // completed
  if (delayed) pathColor = "#ef4444"; // red for out_of_time
  if (canceled) pathColor = "#9ca3af";
  return (
    <div className="w-20 h-20">
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          pathColor,
          trailColor: "#eeeeee",
        })}
      >
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default SmallProgressCircle;
