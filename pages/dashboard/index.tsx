'use client';

import { useEffect, useState } from 'react';

type AttributeValue = {
  attribute: { name: string };
  value: string;
};

type OrderItem = {
  quantity: number;
  price: number;
  variant: {
    product: { title: string };
    attributeValues: AttributeValue[];
  };
};

type Order = {
  id: string;
  customerName: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
};

const statusLabels: Record<string, string> = {
  pending: 'در انتظار تایید',
  processing: 'در حال پردازش',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_API}/useorders` ||`http://localhost:3003/useorders`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders || []);
        } else {
          setError(data.error || 'Failed to load orders');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">در حال بارگذاری سفارش‌ها...</div>;
  if (error) return <div className="p-6 text-red-500">خطا: {error}</div>;

  return (
<div></div>
  );
}
