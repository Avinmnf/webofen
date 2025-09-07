"use client";

import { useState } from "react";

type SubmitRatingOptions = {
  value: number;
  productId?: string;
  postId?: string;
  orderItemId?: string;
};

export function useSubmitRating() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitRating = async (options: SubmitRatingOptions) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // ✅ Fixed path: POST should go to /api/ratings (not /api/ratings-average)
      const res = await fetch("/api/proxy/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for sending cookies (JWT)
        body: JSON.stringify(options),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to submit rating");
      }

      setSuccess(true);
      return json.rating;
    } catch (err: any) {
      console.error("Submit rating error:", err);
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitRating, loading, error, success };
}
