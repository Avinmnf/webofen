"use client";

import React from "react";
import { useProductRating } from "@/hooks/useProductRating";

interface DynamicAverageRatingProps {
  productId: string;
  userId?: string;
  maxStars?: number;
}

export default function AverageRating({
  productId,
  userId,
  maxStars = 5,
}: DynamicAverageRatingProps) {
  const { rating, loading } = useProductRating(productId, userId);

  if (loading)
    return (
      <p className="text-gray-500 text-sm sm:text-base text-center">
        در حال بارگذاری...
      </p>
    );
  if (!rating || rating.totalRatings === 0)
    return (
      <p className="text-gray-500 text-sm sm:text-base text-center">بدون امتیاز</p>
    );

  const { average, totalRatings } = rating;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0 justify-center">
      <div className="flex justify-center sm:justify-start">
        {Array.from({ length: maxStars }).map((_, i) => {
          const starIndex = i + 1;
          let fillClass = "text-gray-300";

          if (starIndex <= Math.floor(average)) {
            fillClass = "text-yellow-400"; // full star
          } else if (starIndex - 1 < average && starIndex > average) {
            fillClass = "text-yellow-300"; // half star effect
          }

          return (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 sm:h-5 sm:w-5 ${fillClass}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.384 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.384-2.46a1 1 0 00-1.176 0l-3.384 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.287-3.974z" />
            </svg>
          );
        })}
      </div>

      <div className="flex justify-center sm:justify-start space-x-1 text-center sm:text-left">
        <span className="text-sm sm:text-base font-medium text-gray-700">
          {average.toFixed(1)}
        </span>
        <span className="text-sm sm:text-base text-gray-500">
          ({totalRatings} رأی)
        </span>
      </div>
    </div>
  );
}
