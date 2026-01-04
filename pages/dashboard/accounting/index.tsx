"use client";

import React, { useRef } from "react";
import { useUserOrders, Order } from "@/hooks/useUserOrders";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from "next/image";

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

      // مخفی کردن دکمه‌ها
      const buttons = invoiceElement.querySelectorAll('button');
      buttons.forEach(button => {
        button.style.display = 'none';
      });

      // ایجاد المان موقت برای رندر
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm';
      tempDiv.style.backgroundColor = '#ffffff';
      tempDiv.style.direction = 'rtl';
      tempDiv.style.fontFamily = 'Arial, Tahoma, sans-serif';
      tempDiv.style.padding = '20mm';
      tempDiv.style.color = '#000000';
      
      tempDiv.innerHTML = invoiceElement.innerHTML;
      
      // اضافه کردن لوگو به المان موقت
      const headerDiv = tempDiv.querySelector('.invoice-header');
      if (headerDiv) {
        const logoImg = document.createElement('img');
        logoImg.src = '/logos/logo.png';
        logoImg.alt = 'لوگو';
        logoImg.style.width = '120px';
        logoImg.style.height = 'auto';
        logoImg.style.marginLeft = '20px';
        headerDiv.insertBefore(logoImg, headerDiv.firstChild);
      }

      // اعمال استایل‌های اضافی برای PDF
      const elements = tempDiv.querySelectorAll('*') as NodeListOf<HTMLElement>;
      elements.forEach(el => {
        // پاک کردن کلاس‌های اضافی
        if (el.className) {
          el.removeAttribute('class');
        }
        
        // استایل‌دهی به تگ‌های اصلی
        if (el.tagName === 'H2') {
          el.style.fontSize = '28px';
          el.style.fontWeight = 'bold';
          el.style.textAlign = 'center';
          el.style.color = '#1e40af';
          el.style.marginBottom = '20px';
          el.style.fontFamily = 'Arial, Tahoma, sans-serif';
        }
        
        if (el.tagName === 'H3') {
          el.style.fontSize = '20px';
          el.style.fontWeight = 'bold';
          el.style.color = '#374151';
          el.style.marginBottom = '15px';
          el.style.borderBottom = '2px solid #e5e7eb';
          el.style.paddingBottom = '8px';
        }
        
        if (el.tagName === 'P') {
          el.style.margin = '6px 0';
          el.style.color = '#374151';
          el.style.fontSize = '14px';
          el.style.lineHeight = '1.6';
        }
        
        if (el.tagName === 'TABLE') {
          el.style.width = '100%';
          el.style.borderCollapse = 'collapse';
          el.style.marginTop = '20px';
          el.style.marginBottom = '20px';
          el.style.fontFamily = 'Arial, Tahoma, sans-serif';
        }
        
        if (el.tagName === 'TH') {
          el.style.backgroundColor = '#1e40af';
          el.style.color = '#ffffff';
          el.style.border = '1px solid #3b82f6';
          el.style.padding = '12px';
          el.style.textAlign = 'center';
          el.style.fontWeight = '600';
          el.style.fontSize = '14px';
        }
        
        if (el.tagName === 'TD') {
          el.style.border = '1px solid #d1d5db';
          el.style.padding = '12px';
          el.style.textAlign = 'center';
          el.style.color = '#374151';
          el.style.fontSize = '13px';
        }
        
        if (el.tagName === 'TR') {
          el.style.borderBottom = '1px solid #e5e7eb';
        }
        
        if (el.tagName === 'TR:nth-child(even)') {
          el.style.backgroundColor = '#f9fafb';
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
        onclone: (clonedDoc) => {
          // اطمینان از نمایش لوگو در کپی
          const clonedLogo = clonedDoc.querySelector('.logo-container img');
          if (clonedLogo) {
            (clonedLogo as HTMLImageElement).src = '/logos/logo.png';
          }
        }
      });

      document.body.removeChild(tempDiv);

      // بازگرداندن استایل دکمه‌ها
      buttons.forEach(button => {
        button.style.display = '';
      });

      // ایجاد PDF
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
            {/* بخش مخفی برای PDF */}
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
              {/* هدر فاکتور با لوگو */}
              <div className="invoice-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '30px', 
                borderBottom: '3px solid #1e40af', 
                paddingBottom: '20px' 
              }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
                    فاکتور فروش
                  </h2>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    <p><strong>تاریخ صدور:</strong> {new Date().toLocaleString("fa-IR")}</p>
                    <p><strong>شماره فاکتور:</strong> INV-{order.id}</p>
                  </div>
                </div>
                <div className="logo-container" style={{ textAlign: 'left' }}>
                  {/* لوگو اینجا در PDF اضافه خواهد شد */}
                </div>
              </div>

              {/* اطلاعات سفارش */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151', marginBottom: '15px' }}>
                  اطلاعات سفارش
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '15px',
                  backgroundColor: '#f0f9ff',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '2px solid #e0f2fe'
                }}>
                  <div>
                    <p style={{ color: '#374151', marginBottom: '8px' }}><strong>شناسه سفارش:</strong> {order.id}</p>
                    <p style={{ color: '#374151', marginBottom: '8px' }}><strong>نام مشتری:</strong> {order.customerName}</p>
                    <p style={{ color: '#374151', marginBottom: '8px' }}><strong>تاریخ سفارش:</strong> {new Date(order?.createdAt || Date.now()).toLocaleString("fa-IR")}</p>
                  </div>
             
                </div>
              </div>

              {/* جدول محصولات */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#374151', marginBottom: '15px' }}>
                  جزئیات محصولات
                </h3>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1e40af' }}>
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>ردیف</th>
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>محصول</th>
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>ویژگی‌ها</th>
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>تعداد</th>
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>قیمت واحد</th>
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>قیمت کل</th>
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => {
                      const getStatusStyle = (status: string) => {
                        if (status === 'Completed' || status === 'submitted') {
                          return { 
                            backgroundColor: '#d1fae5', 
                            color: '#065f46', 
                            padding: '6px 12px', 
                            borderRadius: '20px', 
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'inline-block'
                          };
                        } else if (status === 'Cancelled') {
                          return { 
                            backgroundColor: '#fee2e2', 
                            color: '#991b1b', 
                            padding: '6px 12px', 
                            borderRadius: '20px', 
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'inline-block'
                          };
                        } else {
                          return { 
                            backgroundColor: '#fef3c7', 
                            color: '#92400e', 
                            padding: '6px 12px', 
                            borderRadius: '20px', 
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'inline-block'
                          };
                        }
                      };

                      return (
                        <tr key={item.id} style={{ 
                          borderBottom: '1px solid #e5e7eb',
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                        }}>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', textAlign: 'center', color: '#374151' }}>{index + 1}</td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', color: '#374151', fontWeight: '500' }}>{item.variant?.product?.title || "محصول حذف‌شده"}</td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', color: '#6b7280', fontSize: '12px' }}>
                            {item.variant?.attributeValues
                              ?.map((av) => `${av.attribute?.name || "ویژگی"}: ${av.value || "-"}`)
                              .join(", ") || "-"}
                          </td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', textAlign: 'center', color: '#374151' }}>{item.quantity || 0}</td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', textAlign: 'left', color: '#1e40af', fontWeight: '500' }}>
                            {item.finalPrice ? `${item.finalPrice.toLocaleString("fa-IR")} تومان` : "—"}
                          </td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>
                            {item.finalPrice && item.quantity 
                              ? `${(item.finalPrice * item.quantity).toLocaleString("fa-IR")} تومان`
                              : "—"}
                          </td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', textAlign: 'center' }}>
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

              {/* جمع کل */}
              <div style={{ 
                backgroundColor: '#f0f9ff', 
                padding: '24px', 
                borderRadius: '12px',
                border: '2px solid #e0f2fe',
                marginTop: '30px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '16px', color: '#374151' }}>
                      <strong>تعداد آیتم‌ها:</strong> 
                      <span style={{ marginRight: '8px', fontWeight: 'bold', color: '#1e40af' }}>
                        {order.items.length}
                      </span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e40af' }}>
                      <strong>مبلغ قابل پرداخت:</strong> 
                      <span style={{ marginRight: '12px', fontSize: '24px' }}>
                        {Number(order.totalPrice || 0).toLocaleString("fa-IR")}
                      </span>
                      تومان
                    </p>
                  </div>
                </div>
              </div>

              {/* پاورقی */}
              <div style={{ 
                marginTop: '40px', 
                paddingTop: '20px', 
                borderTop: '2px dashed #e5e7eb',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '13px'
              }}>
                <p style={{ marginBottom: '8px' }}>با تشکر از اعتماد شما</p>
                <p style={{ marginBottom: '12px' }}>این فاکتور به صورت خودکار تولید شده و نیاز به مهر و امضا ندارد</p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                  تاریخ چاپ: {new Date().toLocaleString("fa-IR")}
                </p>
              </div>
            </div>

            {/* نمایش در صفحه وب */}
            <div className="space-y-6">
              {/* هدر سفارش */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-4">
                <div className="flex items-center space-x-4 space-x-reverse mb-4 md:mb-0">
                  <div className="hidden md:block">
                
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">سفارش #{order.id}</h3>
                    <p className="text-gray-600 text-sm">مشتری: {order.customerName}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">تاریخ:</span>{" "}
                    {new Date(order?.createdAt || Date.now()).toLocaleString("fa-IR")}
                  </p>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
              </div>

         

              {/* جدول محصولات */}
              <div className="overflow-x-auto mt-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-t-xl border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800">محصولات سفارش</h4>
                </div>
                <table className="w-full border border-gray-200 border-collapse text-sm text-right rounded-b-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      <th className="border p-4 text-white text-center">محصول</th>
                      <th className="border p-4 text-white text-center">ویژگی‌ها</th>
                      <th className="border p-4 text-white text-center">تعداد</th>
                      <th className="border p-4 text-white text-center">قیمت واحد</th>
                      <th className="border p-4 text-white text-center">قیمت کل</th>
                      <th className="border p-4 text-white text-center">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="border p-4 text-gray-800 text-center font-medium">
                          {item.variant?.product?.title || "محصول حذف‌شده"}
                        </td>
                        <td className="border p-4 text-gray-600 text-center text-sm">
                          {item.variant?.attributeValues
                            ?.map((av) => `${av.attribute?.name || "ویژگی"}: ${av.value || "-"}`)
                            .join(", ") || "-"}
                        </td>
                        <td className="border p-4 text-gray-800 text-center">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            {item.quantity || 0}
                          </span>
                        </td>
                        <td className="border p-4 text-blue-700 text-center font-medium">
                          {item.finalPrice
                            ? `${item.finalPrice.toLocaleString("fa-IR")} تومان`
                            : "—"}
                        </td>
                        <td className="border p-4 text-green-700 text-center font-bold">
                          {item.finalPrice && item.quantity 
                            ? `${(item.finalPrice * item.quantity).toLocaleString("fa-IR")} تومان`
                            : "—"}
                        </td>
                        <td className="border p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Completed' || item.status === 'submitted' 
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {statusMap[item.status?.trim()] ?? item.status ?? "نامشخص"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* دکمه دانلود */}
              <div className="flex justify-end pt-6">
                <button
                  className="bg-gradient-to-r bg-[#0366b4] text-white px-8 py-3 cursor-pointer rounded-xl hover:from-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-3"
                  onClick={() => handleDownloadInvoice(order)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-lg">دانلود فاکتور PDF</span>
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