"use client";

import React, { useRef } from "react";
import { useUserOrders, Order } from "@/hooks/useUserOrders";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const invoiceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setInvoiceRef = (id: string) => (el: HTMLDivElement | null) => {
    invoiceRefs.current[id] = el;
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      const invoiceElement = invoiceRefs.current[order.id];
      
      if (!invoiceElement) {
        alert("عنصر فاکتور یافت نشد");
        return;
      }

      const buttons = invoiceElement.querySelectorAll('button');
      const originalStyles: Array<{display: string, visibility: string}> = [];
      
      buttons.forEach((button, index) => {
        originalStyles[index] = {
          display: button.style.display,
          visibility: button.style.visibility
        };
        button.style.display = 'none';
        button.style.visibility = 'hidden';
      });

      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm';
      tempDiv.style.backgroundColor = '#ffffff';
      
      tempDiv.innerHTML = invoiceElement.innerHTML;
      
      const elements = tempDiv.querySelectorAll('*') as NodeListOf<HTMLElement>;
      elements.forEach(el => {
        if (el.className) {
          el.removeAttribute('class');
        }
        
        if (el.tagName === 'H2') {
          el.style.fontSize = '24px';
          el.style.fontWeight = 'bold';
          el.style.textAlign = 'center';
          el.style.color = '#000000';
          el.style.marginBottom = '16px';
        }
        
        if (el.tagName === 'P') {
          el.style.margin = '4px 0';
          el.style.color = '#000000';
        }
        
        if (el.tagName === 'TABLE') {
          el.style.width = '100%';
          el.style.borderCollapse = 'collapse';
          el.style.marginTop = '16px';
        }
        
        if (el.tagName === 'TH') {
          el.style.backgroundColor = '#f3f4f6';
          el.style.border = '1px solid #d1d5db';
          el.style.padding = '8px';
          el.style.color = '#000000';
          el.style.textAlign = 'center';
          el.style.fontWeight = '600';
        }
        
        if (el.tagName === 'TD') {
          el.style.border = '1px solid #d1d5db';
          el.style.padding = '8px';
          el.style.textAlign = 'center';
          el.style.color = '#000000';
        }
        
        if (el.classList?.contains('text-center')) {
          el.style.textAlign = 'center';
        }
        
        if (el.classList?.contains('font-bold')) {
          el.style.fontWeight = 'bold';
        }
      });

      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        removeContainer: true,
      });

      document.body.removeChild(tempDiv);

      buttons.forEach((button, index) => {
        if (originalStyles[index]) {
          button.style.display = originalStyles[index].display;
          button.style.visibility = originalStyles[index].visibility;
        }
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`فاکتور-${order.customerName}-${order.id}.pdf`);
      
    } catch (err) {
      console.error("Download error:", err);
      alert(err instanceof Error ? err.message : "خطا در تولید فاکتور");
    }
  };

  if (loading) return <p className="text-black text-center py-8">در حال بارگذاری سفارش‌ها...</p>;
  if (error) return <p className="text-black text-center py-8">خطا: {error}</p>;
  if (!orders.length) return <p className="text-black text-center py-8">سفارشی یافت نشد.</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="p-6 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-black">تراکنش‌ها</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {orders.map((order: Order) => (
          <div
            key={order.id}
            className="mb-6 bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all"
          >
            <div 
              ref={setInvoiceRef(order.id)}
              className="hidden"
              style={{
                width: '210mm',
                backgroundColor: '#ffffff',
                direction: 'rtl',
                fontFamily: 'Arial, Tahoma, sans-serif',
                padding: '20mm',
                color: '#000000',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #000000', paddingBottom: '20px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#000000', marginBottom: '10px' }}>
                  فاکتور فروش
                </h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#000000' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p><strong>تاریخ صدور:</strong> {new Date().toLocaleString("fa-IR")}</p>
                    <p><strong>شماره فاکتور:</strong> INV-{order.id}</p>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p><strong>لوگو/نام شرکت</strong></p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000', marginBottom: '15px' }}>
                  اطلاعات سفارش
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '15px',
                  backgroundColor: '#f9fafb',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div>
                    <p style={{ color: '#000000' }}><strong>شناسه سفارش:</strong> {order.id}</p>
                    <p style={{ color: '#000000' }}><strong>نام مشتری:</strong> {order.customerName}</p>
                    <p style={{ color: '#000000' }}><strong>تاریخ سفارش:</strong> {new Date(order?.createdAt || Date.now()).toLocaleString("fa-IR")}</p>
                  </div>
                  <div>
                    <p style={{ color: '#000000' }}><strong>وضعیت سفارش:</strong> {statusMap[order.status?.trim()] ?? order.status}</p>
                    <p style={{ color: '#000000' }}><strong>تعداد اقلام:</strong> {order.items.length}</p>
                    <p style={{ color: '#000000' }}><strong>مبلغ کل:</strong> {Number(order.totalPrice || 0).toLocaleString("fa-IR")} تومان</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000', marginBottom: '15px' }}>
                  جزئیات محصولات
                </h3>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  border: '1px solid #d1d5db'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#000000' }}>ردیف</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#000000' }}>محصول</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#000000' }}>ویژگی‌ها</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#000000' }}>تعداد</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#000000' }}>قیمت واحد</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#000000' }}>قیمت کل</th>
                      <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#000000' }}>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => {
                      const getStatusStyle = (status: string) => {
                        if (status === 'Completed' || status === 'submitted') {
                          return { backgroundColor: '#d1fae5', color: '#000000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
                        } else if (status === 'Cancelled') {
                          return { backgroundColor: '#fee2e2', color: '#000000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
                        } else {
                          return { backgroundColor: '#fef3c7', color: '#000000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
                        }
                      };

                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'center', color: '#000000' }}>{index + 1}</td>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>{item.variant?.product?.title || "محصول حذف‌شده"}</td>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', color: '#000000' }}>
                            {item.variant?.attributeValues
                              ?.map((av) => `${av.attribute?.name || "ویژگی"}: ${av.value || "-"}`)
                              .join(", ") || "-"}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'center', color: '#000000' }}>{item.quantity || 0}</td>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'left', color: '#000000' }}>
                            {item.finalPrice ? `${item.finalPrice.toLocaleString("fa-IR")} تومان` : "—"}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'left', color: '#000000' }}>
                            {item.finalPrice && item.quantity 
                              ? `${(item.finalPrice * item.quantity).toLocaleString("fa-IR")} تومان`
                              : "—"}
                          </td>
                          <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'center', color: '#000000' }}>
                            <span style={getStatusStyle(item.status)}>
                              {statusMap[item.status?.trim()] ?? item.status ?? "نامشخص"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                marginTop: '30px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '16px', color: '#000000' }}>
                      <strong>تعداد آیتم‌ها:</strong> {order.items.length}
                    </p>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000' }}>
                      <strong>مبلغ قابل پرداخت:</strong> {Number(order.totalPrice || 0).toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: '40px', 
                paddingTop: '20px', 
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center',
                color: '#000000',
                fontSize: '14px'
              }}>
                <p>با تشکر از اعتماد شما</p>
                <p>این فاکتور به صورت خودکار تولید شده و نیاز به مهر و امضا ندارد</p>
                <p style={{ marginTop: '10px', fontSize: '12px' }}>
                  تاریخ چاپ: {new Date().toLocaleString("fa-IR")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
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
                      ? 'bg-green-100 text-black'
                      : order.status === 'Cancelled'
                      ? 'bg-red-100 text-black'
                      : 'bg-yellow-100 text-black'
                  }`}>
                    {statusMap[order.status?.trim()] ?? order.status}
                  </span>
                </div>
              </div>

              <div className="text-black text-lg">
                <strong>مبلغ کل:</strong>{" "}
                {Number(order.totalPrice || 0).toLocaleString("fa-IR")} تومان
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 border-collapse text-sm text-right">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-black text-center">محصول</th>
                      <th className="border p-3 text-black text-center">ویژگی‌ها</th>
                      <th className="border p-3 text-black text-center">تعداد</th>
                      <th className="border p-3 text-black text-center">قیمت</th>
                      <th className="border p-3 text-black text-center">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="border p-3 text-black text-center">
                          {item.variant?.product?.title || "محصول حذف‌شده"}
                        </td>
                        <td className="border p-3 text-black text-center">
                          {item.variant?.attributeValues
                            ?.map((av) => `${av.attribute?.name || "ویژگی"}: ${av.value || "-"}`)
                            .join(", ") || "-"}
                        </td>
                        <td className="border p-3 text-black text-center">
                          {item.quantity || 0}
                        </td>
                        <td className="border p-3 text-black text-center">
                          {item.finalPrice
                            ? `${item.finalPrice.toLocaleString("fa-IR")} تومان`
                            : "—"}
                        </td>
                        <td className="border p-3 text-black text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'Completed' || item.status === 'submitted' 
                              ? 'bg-green-100 text-black'
                              : item.status === 'Cancelled'
                              ? 'bg-red-100 text-black'
                              : 'bg-yellow-100 text-black'
                          }`}>
                            {statusMap[item.status?.trim()] ?? item.status ?? "نامشخص"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm flex items-center gap-2"
                  onClick={() => handleDownloadInvoice(order)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  دانلود فاکتور
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountingPage;