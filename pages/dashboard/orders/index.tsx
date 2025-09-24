'use client';

import { useOrders } from '@/hooks/getorders';
// <-- import the hook
import { useEffect } from 'react';

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
  const { orders, loading, error, refetch } = useOrders(); // <-- use the hook

  if (loading) return <div className="p-6 text-gray-600">در حال بارگذاری سفارش‌ها...</div>;
  if (error) return <div className="p-6 text-red-500">خطا: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
        سفارشات شما
      </h1>

      {/* Optional Refresh Button */}
      <button
        onClick={refetch}
        className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
      >
        بروزرسانی سفارش‌ها
      </button>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">سفارشی یافت نشد.</div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl shadow-md bg-white hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">
                      سفارش #{order.id}
                    </h2>
                    <p className="text-sm text-gray-500">           
                      تاریخ: {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                <div className="text-gray-600 text-sm">
                  <strong>پرداخت شده: </strong>{' '}
                  <span className="text-lg font-bold text-green-600">
                    {order.totalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">محصولات:</h3>
                  <ul className="space-y-3">
                    {order.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">
                              {item.variant.product.title}
                            </span>{' '}
                            × {item.quantity.toLocaleString('fa-IR')}
                          </div>
                          <div className="text-green-700 font-semibold">
                            {item.finalPrice.toLocaleString('fa-IR')} تومان
                          </div>
                        </div>
                        <ul className="mt-2 text-xs text-gray-500 ml-4 space-y-1">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
