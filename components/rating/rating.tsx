"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProductRating } from "@/hooks/useProductRating";

interface RatingFormProps {
  productId: string;
}

export default function RatingForm({ productId }: RatingFormProps) {
  const { user } = useAuth();
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const { rating: ratingData, loading, error, submitRating } = useProductRating(
    productId,
    user?.id
  );

  const handleRate = async (value: number) => {
    if (!user) {
      setPopupMessage("برای امتیاز دادن باید وارد شوید.");
      setShowPopup(true);
      return;
    }
    if (!ratingData?.canRate) {
      setPopupMessage("شما هنوز این محصول را خریداری نکرده‌اید.");
      setShowPopup(true);
      return;
    }
    const res = await submitRating(value);
    if (!res.success) {
      setPopupMessage(res.error || "خطایی رخ داد.");
      setShowPopup(true);
    }
  };

  if (loading) return null; // don't show anything while loading
  if (error) return null;   // don't show anything if error
  if (!ratingData?.canRate) return null; // user cannot rate → render nothing

  return (
    <div className="flex items-center justify-center space-x-1 mt-1 relative">
      {Array.from({ length: ratingData?.maxStars || 5 }).map((_, i) => {
        const starValue = i + 1;
        const isFilled =
          hoverValue !== null
            ? starValue <= hoverValue
            : starValue <= (ratingData?.userRating || 0);

        return (
          <svg
            key={i}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => handleRate(starValue)}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 cursor-pointer transition ${
              isFilled ? "text-yellow-400" : "text-gray-300"
            } hover:scale-110`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.384 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.384-2.46a1 1 0 00-1.176 0l-3.384 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.287-3.974z" />
          </svg>
        );
      })}

      {showPopup && (
        <div className="absolute mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
          {popupMessage}
        </div>
      )}
    </div>
  );
}
