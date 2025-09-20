"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders } from "@/hooks/useUserOrders";

const productVideoMap = [
  {
    keyword: "بک لینک",
    src: "/guidance/Hailuo_Video_A_futuristic_glowing_pill_with_420392168333352962_2.mp4",
    title: "آموزش بک لینک سازی",
    message: "تبریک! الان حال سایت شما خیلی بهتر شده",
  },
  {
    keyword: "بهینه سازی",
    src: "/guidance/Hailuo_Video_A_futuristic_glowing_pill_with_420392168333352962_1.mp4",
    title: "آموزش بهینه سازی سایت",
    message: "سفارش بهینه سازی شما تکمیل شد، آموزش مرتبط را مشاهده کنید 👇",
  },
  {
    keyword: "اسکریمینگ فراگ",
    src: "/guidance/Hailuo_Video_Create_a_smooth_looping_animat_422500566735044610_1.mp4",
    title: "آموزش کار با Screaming Frog",
    message: "گزارش Screaming Frog شما آماده است 👇",
  },
    {
    keyword: "امنیت",
    src: "/guidance/Hailuo_Video_A_futuristic_glowing_pill_with_420392168333352962.mp4",
    title: "آموزش کار با Screaming Frog",
    message: "امنیت سایت شما برقرار است",
  },
];

const DashboardHome: React.FC = () => {
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

  // ✅ Get latest completed item
  const latestCompletedItem = sortedCompletedItems[0];

  // ✅ Find matching video for the latest completed item
  const matchedVideo = latestCompletedItem
    ? productVideoMap.find((video) =>
        latestCompletedItem.variant.product?.title.includes(video.keyword)
      )
    : null;

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

      {/* ✅ Show latest video if exists */}
      {matchedVideo && (
        <div
          className="relative w-full aspect-[16/5] bg-[#001933] rounded-3xl overflow-hidden flex items-start"
          onMouseEnter={(e) => {
            const v = e.currentTarget.querySelector("video");
            v?.play();
          }}
          onMouseLeave={(e) => {
            const v = e.currentTarget.querySelector("video");
            if (!v) return;
            v.pause();
            v.currentTime = 0;
          }}
        >
          <video
            src={matchedVideo.src}
            className="h-full absolute left-0 w-auto object-cover"
            muted
            loop
            playsInline
          />
          <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
            <div className="shadow">
              <h2 className="text-2xl font-bold text-green-100 mb-2">
                سفارش {matchedVideo.keyword} تکمیل شد
              </h2>
            </div>
            <span className="text-white text-sm w-2/3">
              {matchedVideo.message}
            </span>
          </div>
        </div>
      )}

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

export default DashboardHome;
