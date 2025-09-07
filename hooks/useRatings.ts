"use client";

import { useEffect, useState } from "react";

type RatingsResponse = {
  average: number | null;
  count: number;
};

export function useRatings({ productId, postId }: { productId?: string; postId?: string }) {
  const [data, setData] = useState<RatingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId && !postId) return;

    const fetchRatings = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (productId) params.append("productId", productId);
        if (postId) params.append("postId", postId);

        const res = await fetch(`/api/proxy/ratings-average?${params.toString()}`);
        if (!res.ok) throw new Error(`Failed to fetch ratings: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setError("Failed to load ratings");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [productId, postId]);

  return { data, loading, error };
}
