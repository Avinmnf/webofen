"use client";

import React from "react";
import { useUserOrders, Order } from "@/hooks/useUserOrders";

const AccountingPage: React.FC = () => {
  const statusMap: Record<string, string> = {
    Processing: "در حال بررسی",
    Cancelled: "لغو شده",
    waiting: "در حال پردازش", // اضافه شد در صورت نیاز
    pending: "در انتظار",
    submitted: "تکمیل شده",
    Completed: "تکمیل شده",
  };

  const { orders, loading, error } = useUserOrders();

  if (loading)
    return <p className="text-gray-500">در حال بارگذاری سفارش‌ ها...</p>;
  if (error) return <p className="text-red-500">خطا: {error}</p>;
  if (!orders.length) return <p className="text-gray-500">سفارشی یافت نشد.</p>;

  const handleDownloadInvoice = async (order: Order) => {
    try {
      const response = await fetch(`/api/invoices/${order.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(`خطا: ${data.error}`);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `فاکتور-${order.customerName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("خطا در دانلود فاکتور");
    }
  };
  console.log(orders);
  return (
    <div className="h-screen flex flex-col">
      {/* هدر بالا */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-600">تراکنش‌ ها</h1>
      </div>

      {/* بخش اسکرول‌دار */}
      <div className="flex-1 overflow-y-auto p-6">
        {orders.map((order: Order) => (
          <div
            key={order.id}
            className="mb-8 bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-[1.01]"
          >
            <div className="flex justify-between mb-3 text-gray-700">
              <span>
                <strong>شناسه سفارش:</strong> {order.id}
              </span>
              <span>
                <strong>تاریخ:</strong>{" "}
                {new Date(order?.createdAt).toLocaleString("fa-IR")}
              </span>
            </div>

            <div className="flex justify-between mb-3 text-gray-700">
              <span>
                <strong>نام مشتری:</strong> {order.customerName}
              </span>
              <span>
                <strong>وضعیت:</strong>{" "}
                {statusMap[order.status?.trim()] ?? order.status}
              </span>
            </div>

            <div className="mb-4 text-gray-700">
              <strong>مبلغ کل:</strong>{" "}
              {Number(order.totalPrice).toLocaleString("fa-IR")} تومان
            </div>

            <table className="w-full border border-gray-300 border-collapse text-sm text-right">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-gray-600 text-center">
                    محصول
                  </th>
                  <th className="border p-3 text-gray-600 text-center">
                    ویژگی‌ ها
                  </th>
                  <th className="border p-3 text-gray-600 text-center">
                    تعداد
                  </th>
                  <th className="border p-3 text-gray-600 text-center">قیمت</th>
                  <th className="border p-3 text-gray-600 text-center">
                    وضعیت
                  </th>
                  <th className="border p-3 text-gray-600 text-center">
                    دانلود فاکتور
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="border p-3 text-gray-700 text-center">
                      {item.variant?.product?.title || "محصول حذف‌شده"}
                    </td>
                    <td className="border p-3 text-gray-700 text-center">
                      {item.variant?.attributeValues
                        ?.map((av) => `${av.attribute?.name || "ویژگی"}: ${av.value || "-"}`)
                        .join(", ") || "-"}
                    </td>
                    <td className="border p-3 text-gray-700 text-center">
                      {item.quantity || 0}
                    </td>
                    <td className="border p-3 text-gray-700 text-center">
                      {item.finalPrice
                        ? `${item.finalPrice.toLocaleString()} تومان`
                        : "—"}
                    </td>
                    <td className="border p-3 text-gray-700 text-center">
                      {statusMap[item.status?.trim()] ?? item.status ?? "نامشخص"}
                    </td>
                    {index === 0 && (
                      <td
                        className="border p-3 text-gray-700 text-center"
                        rowSpan={order.items.length}
                      >
                        <button
                          className="bg-blue-500 text-white px-3 cursor-pointer py-1 rounded hover:bg-blue-600 transition"
                          onClick={() => handleDownloadInvoice(order)}
                        >
                          دانلود
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountingPage;
