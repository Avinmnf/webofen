import { useEffect, useState, useCallback } from "react";

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: string;
  subtotal: number;
  discountTotal: number;
  totalPrice: number;
  createdAt: string;
  coupon?: {
    id: string;
    code: string;
    discountPercentage: number;
  } | null;
  items: {
    id: string;
    quantity: number;
    originalPrice: number;
    finalPrice: number;
    appliedDiscount?: {
      id: string;
      percentage: number;
    } | null;
    appliedCoupon?: {
      id: string;
      code: string;
      discountPercentage: number;
    } | null;
    variant: {
      product: {
        title: string;
      };
      attributeValues: {
        attribute: { name: string };
        value: string;
      }[];
    };
  }[];
};

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/proxy/getorders"); // your Express route endpoint
      if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      console.error("❌ Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
