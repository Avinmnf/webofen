"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type CheckPurchaseResponse = {
  hasBought: boolean;
};

export function useCheckPurchase(productId?: string) {
  const [hasBought, setHasBought] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoggedIn } = useAuth(); // Get auth state

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setHasBought(false);
      return;
    }

    // If user is not logged in, they definitely haven't bought the product
    if (!isLoggedIn) {
      setLoading(false);
      setHasBought(false);
      setError(null);
      return;
    }

    const checkPurchase = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/proxy/hasBoughtProduct?productId=${productId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            // User is logged out but we thought they were logged in
            // This can happen if token expired
            setHasBought(false);
            setError(null); // Don't show error for non-logged in users
            return;
          }
          throw new Error(`Failed to check purchase: ${res.status}`);
        }

        const json: CheckPurchaseResponse = await res.json();
        setHasBought(json.hasBought);
      } catch (err: any) {
        console.error("Error checking purchase:", err);
        // Only set error if it's not an auth issue
        if (!err.message.includes("Unauthorized")) {
          setError(err.message || "Unknown error");
        }
        setHasBought(false); // Default to false on error
      } finally {
        setLoading(false);
      }
    };

    checkPurchase();
  }, [productId, isLoggedIn]); // Add isLoggedIn to dependencies

  return { hasBought, loading, error };
}