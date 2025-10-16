"use client";
import { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export const AnimatedScoreCard = ({ 
  score, 
  label, 
  description,
  animatedValue 
}: { 
  score: number; 
  label: string; 
  description: string;
  animatedValue: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getColor = (score: number) => {
    if (score >= 0.9) return "#0cce6b";
    if (score >= 0.7) return "#ffa400";
    if (score >= 0.5) return "#ffa400";
    return "#ff4e42";
  };

  const color = getColor(score);

  return (
    <div 
      className="flex flex-col items-center p-6 bg-gradient-to-b from-white to-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <div 
          className={`transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
        >
          <CircularProgressbar
            value={animatedValue}
            text={`${animatedValue}%`}
            strokeWidth={8}
            styles={buildStyles({
              textSize: "16px",
              pathColor: color,
              textColor: "#1f2937",
              trailColor: "#f3f4f6",
              pathTransitionDuration: 0.5,
              strokeLinecap: "round",
            })}
            className="w-32 h-32"
          />
        </div>
        
        {isHovered && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: color }} />
        )}
      </div>
      
      <span className="mt-2 font-bold text-gray-800 text-lg text-center">
        {label}
      </span>
      
      <div className="mt-3 flex items-center text-sm">
        <div 
          className="w-3 h-3 rounded-full ml-1 shadow-sm" 
          style={{ backgroundColor: color }}
        />
        <span className="text-gray-600 font-medium">
          {score >= 0.9 ? "عالی" : score >= 0.7 ? "خوب" : score >= 0.5 ? "متوسط" : "نیاز به بهبود"}
        </span>
      </div>
      
      <p className="mt-2 text-xs text-gray-500 text-center max-w-[140px]">
        {description}
      </p>
    </div>
  );
};