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
    slug: string;
    title: string;
    imageUrl?: string;
    videoUrl?: string;
  };
  attributeValues: AttributeValue[];
}

export interface OrderItemInputValue {
  id: string;
  field: {
    label: string;
  };
  value: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  finalPrice?: number;
  status: string;
  adminStatus?: string;
  delayed?: string;
  variant: Variant;
  deadline?: string;
  vipDeadline: string;
  inputValues?: OrderItemInputValue[];
  completionTime: string;
  completionReport?: string;
  startTime: string;
}

export interface Order {
  user: string;
  role: string;
  id: string;
  customerName: string;
  status: string;
  totalPrice: number | string;
  createdAt: string;
  items: OrderItem[];
}
interface UseUserOrdersResult {
  role: string | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export function useUserOrders(): UseUserOrdersResult {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(!!user);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      setError(null);
      return;
    }

    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch("/api/proxy/userorders", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.statusText}`);
        }
        const data = await res.json();

        const normalizedOrders = (data.orders || []).map((o: Order) => ({
          ...o,
          totalPrice: Number(o.totalPrice) || 0, // always a number
        }));
        setOrders(normalizedOrders);
        setRole(data.role || null);
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
  }, [user]);

  return { orders, loading, error, role };
}
