"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders } from "@/hooks/useUserOrders";


const Tickets: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { orders, loading: ordersLoading } = useUserOrders();

  if (!isLoggedIn) {
    return (
      <p className="text-center py-10">ابتدا باید وارد حساب کاربری خود شوید</p>
    );
  }

  if (ordersLoading) {
    return (
      <p className="text-center py-10 text-gray-500">
        در حال بارگذاری اطلاعات...
      </p>
    );
  }

  // ✅ Collect completed items from all orders
  const completedItems = orders.flatMap((order) =>
    order.items
      .filter((item) => item.adminStatus === "completed")
      .map((item) => ({
        ...item,
        createdAt: order.createdAt, // fallback if item doesn't have its own createdAt
      }))
  );

  // ✅ Sort by date (newest first)
  const sortedCompletedItems = [...completedItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <span className="text-2xl font-semibold text-gray-700 mb-2">
          خوش اومدی،
        </span>
        <span className="text-2xl font-semibold text-gray-500 mb-2">
          {user?.name || "کاربر"}
        </span>
      </div>



      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl text-center border-dashed border border-gray-300">
          <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
          <p className="text-gray-500 text-sm">سفارش‌ها</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 p-4 rounded-2xl">
        <h3 className="text-lg font-semibold mb-2 text-gray-600">
          سفارشات اخیر
        </h3>
        <ul className="divide-y divide-gray-200">
          {orders.slice(0, 5).map((order) => (
            <li
              key={order.id}
              className="py-2 flex justify-between flex-col sm:flex-row sm:items-center"
            >
              <div className="w-full">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center rounded-lg p-2"
                  >
                    <p className="text-gray-600">
                      {item.variant.product?.title} ({item.quantity} عدد)
                    </p>
                    <span className="text-sm text-gray-500">
                      {item.adminStatus}
                    </span>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tickets;
