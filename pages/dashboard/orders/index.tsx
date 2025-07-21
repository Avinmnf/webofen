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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:3003/userorders', {
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

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="mb-2">
                <strong>Order ID:</strong> {order.id}
              </div>
              <div className="mb-2">
                <strong>Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="mb-2">
                <strong>Status:</strong> {order.status}
              </div>
              <div className="mb-2">
                <strong>Total:</strong> ${order.totalPrice}
              </div>
              <div>
                <strong>Items:</strong>
                <ul className="list-disc list-inside">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.variant.product.title} × {item.quantity} – $
                      {item.price}
                      <ul className="ml-5 text-sm text-gray-600">
                        {item.variant.attributeValues.map((av, i) => (
                          <li key={i}>
                            {av.attribute.name}: {av.value}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
