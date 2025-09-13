// hooks/useUserOrders.ts
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // make sure you have this

export interface AttributeValue {
  value: string;
  attribute: {
    name: string;
  };
}

export interface Variant {
  product: {
    id: string;
    title: string;
  };
  attributeValues: AttributeValue[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  variant: Variant;
}

export interface Order {
  id: string;
  customerName: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

interface UseUserOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export function useUserOrders(): UseUserOrdersResult {
  const { user } = useAuth(); // get logged-in user
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(!!user); // only loading if user exists
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      // If not logged in, no need to fetch
      setOrders([]);
      setLoading(false);
      setError(null);
      return;
    }

    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch("/api/proxy/userorders", {
          credentials: "include", // send cookies
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.statusText}`);
        }
        const data = await res.json();
        setOrders(data.orders || []);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Unknown error");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]); // refetch only if user changes

  return { orders, loading, error };
}
