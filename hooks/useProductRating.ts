import { useState, useEffect, useCallback } from "react";

interface ProductRating {
  productId: string;
  totalRatings: number;
  counts: Record<number, number>;
  average: number;
  userRating: number | null;
  maxStars: number;
}

interface UseProductRatingReturn {
  rating: ProductRating | null;
  loading: boolean;
  error: string | null;
  submitRating: (value: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useProductRating(productId: string, userId: string): UseProductRatingReturn {
  const [rating, setRating] = useState<ProductRating | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!userId) {
    throw new Error("useProductRating requires a logged-in userId.");
  }

  const fetchRatings = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/proxy/rate-product/${productId}?userId=${userId}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Failed to fetch ratings");

      setRating({
        productId: data.productId,
        totalRatings: data.totalRatings,
        counts: data.counts,
        average: data.average,
        userRating: data.userRating,
        maxStars: data.maxStars || 5,
      });
    } catch (err: any) {
      console.error("Fetch rating error:", err);
      setError(err.message || "Failed to fetch ratings");
    } finally {
      setLoading(false);
    }
  }, [productId, userId]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const submitRating = useCallback(
    async (value: number) => {
      if (!productId || !userId) {
        setError("User must be logged in to rate.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/proxy/rateproduct-get`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId, value }),
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to submit rating");

        // Refresh after submitting
        await fetchRatings();
      } catch (err: any) {
        console.error("Submit rating error:", err);
        setError(err.message || "Failed to submit rating");
      } finally {
        setLoading(false);
      }
    },
    [productId, userId, fetchRatings]
  );

  return {
    rating,
    loading,
    error,
    submitRating,
    refetch: fetchRatings,
  };
}
