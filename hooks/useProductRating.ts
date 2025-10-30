import { useState, useEffect, useCallback } from "react";

interface ProductRating {
  productId: string;
  totalRatings: number;
  counts: Record<number, number>;
  average: number;
  userRating: number | null;
  maxStars: number;
  canRate: boolean;
}

interface UseProductRatingReturn {
  rating: ProductRating | null;
  loading: boolean;
  error: string | null;
  submitRating: (value: number) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

export function useProductRating(productId: string, userId?: string): UseProductRatingReturn {
  const [rating, setRating] = useState<ProductRating | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRatings = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);

    try {
      const url = userId
        ? `/api/proxy/rateproduct-get/${productId}?userId=${userId}`
        : `/api/proxy/rateproduct-get/${productId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network error while fetching ratings");
      const data = await res.json();

      setRating({
        productId,
        totalRatings: data.totalRatings || 0,
        counts: data.counts || {},
        average: data.average || 0,
        userRating: data.userRating ?? null,
        maxStars: data.maxStars || 5,
        canRate: data.canRate ?? false,
      });
    } catch (err: any) {
      console.error("Fetch rating error:", err);
      setRating({
        productId,
        totalRatings: 0,
        counts: {},
        average: 0,
        userRating: null,
        maxStars: 5,
        canRate: false,
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [productId, userId]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const submitRating = useCallback(
    async (value: number): Promise<{ success: boolean; error?: string }> => {
      if (!userId) {
        const msg = "برای امتیاز دادن باید وارد شوید.";
        setError(msg);
        return { success: false, error: msg };
      }
      if (!rating?.canRate) {
        const msg = "شما هنوز این محصول را خریداری نکرده‌اید.";
        setError(msg);
        return { success: false, error: msg };
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/proxy/rate-product`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId, value }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to submit rating");
        await fetchRatings(); // refresh after submit
        return { success: true };
      } catch (err: any) {
        console.error("Submit rating error:", err);
        const msg = err.message || "Failed to submit rating";
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [productId, userId, fetchRatings, rating?.canRate]
  );

  return { rating, loading, error, submitRating, refetch: fetchRatings };
}
