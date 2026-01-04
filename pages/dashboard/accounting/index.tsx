"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUserOrders, Order } from "@/hooks/useUserOrders";
import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

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
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(
    null
  );
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});

  // تابع برای تولید فاکتور PDF با jspdf-autotable
  const generateInvoicePDF = async (order: Order) => {
    try {
      setGeneratingInvoice(order.id);

      // ایجاد PDF جدید
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // تنظیمات فونت (استفاده از فونت استاندارد)
      doc.setFont("helvetica");
      doc.setFontSize(20);

      // هدر فاکتور
      doc.setTextColor(41, 176, 203); // رنگ آبی وبوفن
      doc.text("فاکتور فروش", 105, 20, { align: "center" });

      // اطلاعات هدر
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("وبوفن - پلتفرم تخصصی طراحی وبسایت", 105, 30, {
        align: "center",
      });

      // خط جداکننده
      doc.setDrawColor(229, 231, 235);
      doc.line(20, 35, 190, 35);

      // اطلاعات فاکتور
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("شناسه فاکتور:", 20, 45);
      doc.setFont("helvetica", "normal");
      doc.text(order.id || "نامشخص", 50, 45);

      doc.setFont("helvetica", "bold");
      doc.text("تاریخ:", 100, 45);
      doc.setFont("helvetica", "normal");
      doc.text(
        new Date(order?.createdAt || Date.now()).toLocaleDateString("fa-IR"),
        120,
        45
      );

      doc.setFont("helvetica", "bold");
      doc.text("وضعیت:", 160, 45);
      doc.setFont("helvetica", "normal");
      doc.text(statusMap[order.status?.trim()] ?? order.status, 180, 45, {
        align: "right",
      });

      // اطلاعات مشتری
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("اطلاعات مشتری", 20, 60);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`نام: ${order.customerName || "نامشخص"}`, 20, 68);

      // جدول محصولات
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("جزئیات سفارش", 20, 80);

      // آماده سازی داده‌های جدول
      const tableData = order.items.map((item) => [
        item.variant?.product?.title || "محصول",
        (item.quantity || 0).toString(),
        (item.finalPrice || 0).toLocaleString(),
        (
          (item.finalPrice || 0) *
          (item.quantity || 1)
        ).toLocaleString(),
      ]);

      // افزودن جدول با autoTable
      autoTable(doc, {
        startY: 85,
        head: [["نام کالا/خدمت", "تعداد", "مبلغ (ریال)", "جمع (ریال)"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [41, 176, 203], // رنگ آبی وبوفن
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        styles: {
          font: "helvetica",
          fontSize: 10,
          textColor: [0, 0, 0],
          cellPadding: 5,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 80, halign: "right" },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 40, halign: "left" },
          3: { cellWidth: 40, halign: "left" },
        },
        margin: { left: 20, right: 20 },
        tableWidth: "auto",
        didDrawPage: (data) => {
          // شماره صفحه
          doc.setFontSize(8);
          doc.text(
            `صفحه ${doc.getNumberOfPages()}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      } as UserOptions);

      // محاسبات نهایی
      const finalY = (doc as any).lastAutoTable?.finalY || 150;

      // جمع کل
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("جمع کل:", 140, finalY + 10);
      doc.text(
        `${(order.totalPrice || 0).toLocaleString()} ریال`,
        190,
        finalY + 10,
        { align: "right" }
      );

      // مبلغ قابل پرداخت
      doc.setFontSize(14);
      doc.setTextColor(41, 176, 203);
      doc.text("مبلغ قابل پرداخت:", 140, finalY + 25);
      doc.text(
        `${(order.totalPrice || 0).toLocaleString()} ریال`,
        190,
        finalY + 25,
        { align: "right" }
      );

      // خط جداکننده
      doc.setDrawColor(229, 231, 235);
      doc.line(20, finalY + 35, 190, finalY + 35);

      // فوتر
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("اطلاعات تماس", 20, finalY + 45);
      doc.setFont("helvetica", "normal");
      doc.text("تلفن: ۰۲۱-۸۸۵۱۴۹۵۱", 20, finalY + 52);
      doc.text("ایمیل: info@webofun.com", 20, finalY + 58);
      doc.text("آدرس: تهران، خیابان ولیعصر", 20, finalY + 64);

      doc.setFont("helvetica", "bold");
      doc.text("شرایط و ضوابط", 120, finalY + 45);
      doc.setFont("helvetica", "normal");
      doc.text("این فاکتور به منزله رسید پرداخت می‌باشد.", 120, finalY + 52);
      doc.text("مهلت استفاده از خدمات: ۶ ماه از تاریخ خرید", 120, finalY + 58);

      // پیام پایانی
      doc.setFontSize(10);
      doc.text("با تشکر از اعتماد شما به وبوفن", 105, finalY + 75, {
        align: "center",
      });

      // ذخیره فایل
      doc.save(`فاکتور-${order.customerName}-${order.id}.pdf`);
    } catch (err) {
      console.error("خطا در تولید فاکتور:", err);
      
      // افزایش شمارش تلاش
      const currentRetry = retryCount[order.id] || 0;
      setRetryCount(prev => ({ ...prev, [order.id]: currentRetry + 1 }));
      
      // اگر کمتر از ۳ بار تلاش شده، دوباره امتحان کن
      if (currentRetry < 3) {
        setTimeout(() => {
          generateInvoicePDF(order);
        }, 1000);
        return;
      }
      
      alert("خطا در تولید فاکتور. لطفاً دوباره تلاش کنید.");
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      console.log("آماده‌سازی فاکتور برای سفارش:", order.id);
      
      // ریست شمارش تلاش برای این سفارش
      setRetryCount(prev => ({ ...prev, [order.id]: 0 }));
      
      // استفاده از روش jspdf-autotable
      await generateInvoicePDF(order);
    } catch (err) {
      console.error("خطا در دانلود فاکتور:", err);
      alert("مشکلی در تولید فاکتور رخ داد. لطفاً صفحه را رفرش کنید و دوباره تلاش کنید.");
    }
  };

  // نمایش وضعیت بارگذاری
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">در حال بارگذاری سفارش‌ها...</p>
        </div>
      </div>
    );
  }

  // نمایش خطا
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-red-50 rounded-xl">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">خطا در بارگذاری اطلاعات</p>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            بارگذاری مجدد
          </button>
        </div>
      </div>
    );
  }

  // نمایش پیام عدم وجود سفارش
  if (!orders.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-gray-50 rounded-xl">
          <div className="text-gray-400 text-4xl mb-4">📦</div>
          <p className="text-gray-700 font-medium">سفارشی یافت نشد</p>
          <p className="text-gray-500 mt-2">هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">تراکنش‌ها</h1>
              <p className="text-gray-500 text-sm mt-1">
                مدیریت و مشاهده تاریخچه سفارش‌ها
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                {orders.length} سفارش
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* لیست سفارش‌ها */}
        <div className="space-y-6">
          {orders.map((order: Order) => {
            const isGenerating = generatingInvoice === order.id;
            const orderRetryCount = retryCount[order.id] || 0;
            
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* هدر سفارش */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <svg
                          className="w-6 h-6 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          سفارش #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        <span className="text-gray-600">مبلغ کل:</span>
                        <span className="font-bold text-gray-800 mr-1">
                          {Number(order.totalPrice || 0).toLocaleString("fa-IR")}
                        </span>
                        <span className="text-gray-500">تومان</span>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "Completed" ||
                          order.status === "submitted"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {statusMap[order.status?.trim()] ?? order.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* جزئیات سفارش */}
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-700 mb-3">مشخصات مشتری</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">نام مشتری</p>
                        <p className="font-medium text-gray-800">
                          {order.customerName || "نامشخص"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">تاریخ ثبت</p>
                        <p className="font-medium text-gray-800">
                          {new Date(order.createdAt).toLocaleString("fa-IR")}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">وضعیت پرداخت</p>
                        <p className="font-medium text-gray-800">
                          {order.status === "Completed" ||
                          order.status === "submitted"
                            ? "پرداخت شده"
                            : "در انتظار پرداخت"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* جدول محصولات */}
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            محصول
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            تعداد
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            قیمت واحد
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            قیمت کل
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            وضعیت
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.items.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.variant?.product?.title ||
                                      "محصول حذف‌شده"}
                                  </p>
                                  {item.variant?.attributeValues && (
                                    <p className="text-sm text-gray-500">
                                      {item.variant.attributeValues
                                        .map(
                                          (av) =>
                                            `${av.attribute?.name || "ویژگی"}: ${
                                              av.value || "-"
                                            }`
                                        )
                                        .join("، ")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                {item.quantity || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-left">
                              {item.finalPrice
                                ? `${item.finalPrice.toLocaleString(
                                    "fa-IR"
                                  )} تومان`
                                : "—"}
                            </td>
                            <td className="px-6 py-4 text-left font-medium">
                              {item.finalPrice
                                ? `${(
                                    item.finalPrice * (item.quantity || 1)
                                  ).toLocaleString("fa-IR")} تومان`
                                : "—"}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  item.status === "Completed" ||
                                  item.status === "submitted"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "Cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {statusMap[item.status?.trim()] ??
                                  item.status ??
                                  "نامشخص"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* دکمه‌های اقدام */}
                  <div className="mt-6 flex flex-wrap gap-3 justify-end">
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      disabled={isGenerating}
                      className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                        isGenerating
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg"
                      } text-white shadow-sm`}
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>
                            {orderRetryCount > 0
                              ? `تلاش مجدد (${orderRetryCount})`
                              : "در حال تولید فاکتور"}
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span>دانلود فاکتور</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* پاورقی */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>
              <p>© {new Date().getFullYear()} وبوفن. تمامی حقوق محفوظ است.</p>
            </div>
            <div className="flex items-center gap-4">
              <p>تعداد کل سفارش‌ها: {orders.length}</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                بازگشت به بالا
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingPage;