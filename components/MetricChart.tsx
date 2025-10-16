"use client";
import { useState, useEffect } from "react";

export const MetricChart = ({ value, label, description, color = "#3b82f6" }: { 
  value: string; 
  label: string; 
  description: string;
  color?: string;
}) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const numericValue = parseFloat(value);
  const unit = value.replace(numericValue.toString(), '');
  const normalizedValue = Math.min(numericValue * 20, 100);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 flex flex-col items-center text-center transition-all hover:shadow-md group hover:scale-105 duration-300">
      <div className="relative w-20 h-20 mb-3">
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={animated ? 251.2 - (251.2 * normalizedValue) / 100 : 251.2}
              className="transition-all duration-1000 ease-out"
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-gray-800 text-lg">{value}</span>
        </div>
      </div>
      <p className="font-semibold text-gray-700 text-sm mb-1">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
      
      <div className={`mt-2 w-3 h-3 rounded-full ${
        numericValue < 2 ? 'bg-green-500' : 
        numericValue < 4 ? 'bg-yellow-500' : 'bg-red-500'
      }`} />
    </div>
  );
};