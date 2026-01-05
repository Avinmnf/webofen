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

  const sanitizeFileName = (name: string) => {
    return name
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/__+/g, '_')
      .trim();
  };

  const replaceOklchStyles = (element: HTMLElement) => {
    if (!element) return;
    
    const elements = element.querySelectorAll('*');
    elements.forEach((el: Element) => {
      const htmlEl = el as HTMLElement;
      
      if (htmlEl.className && typeof htmlEl.className === 'string') {
        htmlEl.className = htmlEl.className.replace(/\b(oklch|oklab|color-mix|light-dark)\b/g, '');
      }
      
      if (htmlEl.style) {
        const style = htmlEl.style.cssText;
        if (style.includes('oklch')) {
          htmlEl.style.cssText = style
            .replace(/oklch\([^)]+\)/g, 'rgb(100, 116, 139)')
            .replace(/oklab\([^)]+\)/g, 'rgb(100, 116, 139)')
            .replace(/color-mix\([^)]+\)/g, 'rgb(100, 116, 139)');
        }
      }
    });
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
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm';
      tempDiv.style.backgroundColor = '#ffffff';
      tempDiv.style.direction = 'rtl';
      tempDiv.style.fontFamily = 'Arial, Tahoma, sans-serif';
      tempDiv.style.padding = '20mm';
      tempDiv.style.color = '#000000';
      
      const clone = invoiceElement.cloneNode(true) as HTMLElement;
      clone.className = '';
      clone.style.cssText = `
        background-color: white;
        padding: 20mm;
        width: 210mm;
        min-height: 297mm;
        font-family: Arial, Tahoma, sans-serif;
        direction: rtl;
        color: #333;
      `;
      
      // اضافه کردن لوگو به کلون - در سمت راست
      const headerDiv = clone.querySelector('.invoice-header');
      if (headerDiv) {
        const logoContainer = headerDiv.querySelector('.logo-container');
        if (logoContainer) {
          const logoImg = document.createElement('img');
          logoImg.src = '/logos/logo.png';
          logoImg.alt = 'لوگو';
          logoImg.style.width = '120px';
          logoImg.style.height = 'auto';
          logoImg.style.display = 'block';
          logoContainer.appendChild(logoImg);
        }
      }
      
      replaceOklchStyles(clone);
      
      tempDiv.appendChild(clone);
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        removeContainer: true,
        onclone: (clonedDoc, clonedElement) => {
          // اطمینان از بارگیری لوگو
          const logoImg = clonedElement.querySelector('img[alt="لوگو"]');
          if (logoImg) {
            (logoImg as HTMLImageElement).src = '/logos/logo.png';
          }
          
          // اعمال استایل‌های PDF
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach((el: Element) => {
            const htmlEl = el as HTMLElement;
            
            // استایل‌دهی به تگ‌های اصلی
            if (el.tagName === 'H2') {
              htmlEl.style.fontSize = '28px';
              htmlEl.style.fontWeight = 'bold';
              htmlEl.style.textAlign = 'right';
              htmlEl.style.color = '#1e40af';
              htmlEl.style.marginBottom = '20px';
              htmlEl.style.fontFamily = 'Arial, Tahoma, sans-serif';
            }
            
            if (el.tagName === 'H3') {
              htmlEl.style.fontSize = '20px';
              htmlEl.style.fontWeight = 'bold';
              htmlEl.style.color = '#374151';
              htmlEl.style.marginBottom = '15px';
              htmlEl.style.borderBottom = '2px solid #e5e7eb';
              htmlEl.style.paddingBottom = '8px';
            }
            
            if (el.tagName === 'P') {
              htmlEl.style.margin = '6px 0';
              htmlEl.style.color = '#374151';
              htmlEl.style.fontSize = '14px';
              htmlEl.style.lineHeight = '1.6';
            }
            
            if (el.tagName === 'TABLE') {
              htmlEl.style.width = '100%';
              htmlEl.style.borderCollapse = 'collapse';
              htmlEl.style.marginTop = '20px';
              htmlEl.style.marginBottom = '20px';
              htmlEl.style.fontFamily = 'Arial, Tahoma, sans-serif';
            }
            
            if (el.tagName === 'TH') {
              htmlEl.style.backgroundColor = '#1e40af';
              htmlEl.style.color = '#ffffff';
              htmlEl.style.border = '1px solid #3b82f6';
              htmlEl.style.padding = '12px';
              htmlEl.style.textAlign = 'center';
              htmlEl.style.fontWeight = '600';
              htmlEl.style.fontSize = '14px';
            }
            
            if (el.tagName === 'TD') {
              htmlEl.style.border = '1px solid #d1d5db';
              htmlEl.style.padding = '12px';
              htmlEl.style.textAlign = 'center';
              htmlEl.style.color = '#374151';
              htmlEl.style.fontSize = '13px';
            }
          });
        }
      });

      document.body.removeChild(tempDiv);

      // بازگرداندن استایل دکمه‌ها
      buttons.forEach(button => {
        button.style.display = '';
      });

      // ایجاد PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      // ایجاد نام فایل
      const customerName = order.customerName || "کاربر";
      const safeCustomerName = sanitizeFileName(customerName);
      const safeOrderId = sanitizeFileName(order.id);
      const fileName = `فاکتور_${safeOrderId}_${safeCustomerName}.pdf`;
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // اضافه کردن صفحات بیشتر در صورت نیاز
      let heightLeft = imgHeight * ratio;
      let position = 0;
      
      if (heightLeft > pdfHeight) {
        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
          heightLeft -= pdfHeight;
        }
      }
      
      pdf.save(fileName);
      
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
              className="fixed -left-[10000px] -top-[10000px]"
              style={{
                backgroundColor: '#ffffff',
                direction: 'rtl',
                fontFamily: 'Arial, Tahoma, sans-serif',
                color: '#000000',
              }}
            >
              <div 
                className="invoice-template"
                style={{
                  backgroundColor: 'white',
                  padding: '20mm',
                  width: '210mm',
                  minHeight: '297mm',
                  fontFamily: 'Arial, Tahoma, sans-serif',
                  direction: 'rtl',
                  color: '#333',
                  boxSizing: 'border-box'
                }}
              >
                {/* هدر فاکتور با لوگو در سمت راست */}
                <div className="invoice-header" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '30px', 
                  borderBottom: '3px solid #1e40af', 
                  paddingBottom: '20px' 
                }}>
                  {/* اطلاعات فاکتور در سمت چپ */}
                  <div style={{ textAlign: 'right', flex: 1 }}>
                    <h2 style={{ fontSize: '28px', textAlign: 'right', fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
                      فاکتور فروش
                    </h2>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      <p><strong>تاریخ صدور:</strong> {new Date().toLocaleString("fa-IR")}</p>
                      <p><strong>شماره فاکتور:</strong> INV-{order.id}</p>
                    </div>
                  </div>
                  {/* لوگو در سمت راست */}
                  <div className="logo-container" style={{ textAlign: 'right', flexShrink: 0 }}>
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
                    <div>
                      <p style={{ color: '#374151', marginBottom: '8px' }}><strong>وضعیت سفارش:</strong> {statusMap[order.status?.trim()] ?? order.status}</p>
                      <p style={{ color: '#374151', marginBottom: '8px' }}><strong>مبلغ کل:</strong> {Number(order.totalPrice || 0).toLocaleString("fa-IR")} تومان</p>
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

              {/* جمع کل */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200 mt-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-right mb-4 md:mb-0">
                    <p className="text-gray-700">
                      <span className="font-bold text-lg">تعداد آیتم‌ها: </span>
                      <span className="text-blue-700 font-bold text-xl mx-2">{order.items.length}</span>
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-gray-700">
                      <span className="font-bold text-lg">مبلغ کل: </span>
                      <span className="text-green-700 font-bold text-2xl mx-2">{Number(order.totalPrice || 0).toLocaleString("fa-IR")}</span>
                      <span className="text-gray-600">تومان</span>
                    </p>
                  </div>
                </div>
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