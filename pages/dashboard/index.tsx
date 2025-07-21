// pages/dashboard.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:3003/orders/user/${user.id}`);
        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) return <p>You must be logged in to view your dashboard.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>

      <h2 className="text-xl font-semibold mb-2">Your Orders:</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded shadow">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Items:</strong></p>
              <ul className="list-disc ml-6">
                {order.items.map((item: any) => (
                  <li key={item.id}>
                    {item.productName} - {item.quantity} pcs - ${item.price}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
