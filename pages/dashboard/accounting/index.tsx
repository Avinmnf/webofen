"use client";

import React from "react";
import { useUserOrders, Order } from "@/hooks/useUserOrders";

const AccountingPage: React.FC = () => {
  const statusMap: Record<string, string> = {
    Processing: "در حال بررسی",
    Cancelled: "بسته",
    Pending: "در انتظار",
    Completed: "حل شده",
  };

  const { orders, loading, error } = useUserOrders();

  if (loading) return <p className="text-gray-500">در حال بارگذاری سفارش‌ها...</p>;
  if (error) return <p className="text-red-500">خطا: {error}</p>;
  if (!orders.length) return <p className="text-gray-500">سفارشی یافت نشد.</p>;

  const handleDownloadInvoice = async (order: Order) => {
    try {
      const response = await fetch(`/api/invoices/${order.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      a.download = `invoice-${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("خطا در دانلود پیش‌فاکتور");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-600">تراکنش‌ها</h1>

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
            <strong>مبلغ کل:</strong> {order?.totalPrice.toLocaleString()} تومان
          </div>

          <table className="w-full border-collapse text-sm text-right">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b p-3 text-gray-600">محصول</th>
                <th className="border-b p-3 text-gray-600">ویژگی‌ها</th>
                <th className="border-b p-3 text-gray-600">تعداد</th>
                <th className="border-b p-3 text-gray-600">قیمت</th>
                <th className="border-b p-3 text-gray-600">وضعیت</th>
                <th className="border-b p-3 text-gray-600">دانلود پیش‌فاکتور</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="border-b p-3 text-gray-700">{item.variant.product.title}</td>
                  <td className="border-b p-3 text-gray-700">
                    {item.variant.attributeValues?.map(av => `${av.attribute.name}: ${av.value}`).join(", ")}
                  </td>
                  <td className="border-b p-3 text-gray-700">{item.quantity}</td>
                  <td className="border-b p-3 text-gray-700">{item.price?.toLocaleString()} تومان</td>
                  <td className="border-b p-3 text-gray-700">{item.status}</td>
                  {index === 0 && (
                    <td className="border-b p-3 text-gray-700" rowSpan={order.items.length}>
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() => handleDownloadInvoice(order)}
                      >
                        دانلود PDF
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
  );
};

export default AccountingPage;
