"use client";

import { useEffect, useState } from "react";

type CheckPurchaseResponse = {
  hasBought: boolean;
};

export function useCheckPurchase(productId?: string) {
  const [hasBought, setHasBought] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const checkPurchase = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/proxy/hasBoughtProduct?productId=${productId}`, {
          method: "GET",
          credentials: "include", // ✅ send cookies with request
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Unauthorized. Please log in.");
          }
          throw new Error(`Failed to check purchase: ${res.status}`);
        }

        const json: CheckPurchaseResponse = await res.json();
        setHasBought(json.hasBought);
      } catch (err: any) {
        console.error("Error checking purchase:", err);
        setError(err.message || "Unknown error");
        setHasBought(null);
      } finally {
        setLoading(false);
      }
    };

    checkPurchase();
  }, [productId]);

  return { hasBought, loading, error };
}
