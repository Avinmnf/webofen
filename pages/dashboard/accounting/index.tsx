"use client";

import React from "react";
import { useUserOrders, Order } from "@/hooks/useUserOrders";

const AccountingPage: React.FC = () => {
  const statusMap: Record<string, string> = {
    Processing: "در حال بررسی",
    Cancelled: "لغو شده",
    waiting: "در حال پردازش",
    pending: "در انتظار",
    submitted: "تکمیل شده",
    Completed: "تکمیل شده",
  };

  const { orders, loading, error } = useUserOrders();

  const handleDownloadInvoice = async (order: Order) => {
    try {
      console.log("Sending order data:", order);
      
      const response = await fetch(`/api/invoices/${order.id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "خطا در سرور" }));
        console.error("Server error:", errorData);
        alert(`خطا: ${errorData.error}${errorData.details ? ` - ${errorData.details}` : ''}`);
        return;
      }

      const blob = await response.blob();
      
      // بررسی نوع فایل
      if (blob.type !== "application/pdf") {
        const text = await blob.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.error || "فایل PDF تولید نشد");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `فاکتور-${order.customerName}-${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Download error:", err);
      alert(err instanceof Error ? err.message : "خطا در دانلود فاکتور");
    }
  };

  if (loading) return <p className="text-gray-500 text-center py-8">در حال بارگذاری سفارش‌ها...</p>;
  if (error) return <p className="text-red-500 text-center py-8">خطا: {error}</p>;
  if (!orders.length) return <p className="text-gray-500 text-center py-8">سفارشی یافت نشد.</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* هدر بالا */}
      <div className="p-6 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-700">تراکنش‌ها</h1>
      </div>

      {/* بخش اسکرول‌دار */}
      <div className="flex-1 overflow-y-auto p-6">
        {orders.map((order: Order) => (
          <div
            key={order.id}
            className="mb-6 bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-700">
              <div>
                <strong>شناسه سفارش:</strong> {order.id}
              </div>
              <div className="text-left md:text-right">
                <strong>تاریخ:</strong>{" "}
                {new Date(order?.createdAt || Date.now()).toLocaleString("fa-IR")}
              </div>
              <div>
                <strong>نام مشتری:</strong> {order.customerName}
              </div>
              <div className="text-left md:text-right">
                <strong>وضعیت:</strong>{" "}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'Completed' || order.status === 'submitted' 
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'Cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {statusMap[order.status?.trim()] ?? order.status}
                </span>
              </div>
            </div>

            <div className="mb-4 text-gray-700 text-lg">
              <strong>مبلغ کل:</strong>{" "}
              {Number(order.totalPrice || 0).toLocaleString("fa-IR")} تومان
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 border-collapse text-sm text-right">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-gray-600 text-center">محصول</th>
                    <th className="border p-3 text-gray-600 text-center">ویژگی‌ها</th>
                    <th className="border p-3 text-gray-600 text-center">تعداد</th>
                    <th className="border p-3 text-gray-600 text-center">قیمت</th>
                    <th className="border p-3 text-gray-600 text-center">وضعیت</th>
                    <th className="border p-3 text-gray-600 text-center">عملیات</th>
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
                          ? `${item.finalPrice.toLocaleString("fa-IR")} تومان`
                          : "—"}
                      </td>
                      <td className="border p-3 text-gray-700 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'Completed' || item.status === 'submitted' 
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {statusMap[item.status?.trim()] ?? item.status ?? "نامشخص"}
                        </span>
                      </td>
                      {index === 0 && (
                        <td
                          className="border p-3 text-gray-700 text-center"
                          rowSpan={order.items.length}
                        >
                          <button
                            className="bg-blue-500 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm"
                            onClick={() => handleDownloadInvoice(order)}
                          >
                            دانلود فاکتور
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountingPage;