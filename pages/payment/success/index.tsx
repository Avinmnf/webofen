"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Head from "next/head";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Copy, Check, ArrowLeft, FileText, Home } from "lucide-react";
import { useUserOrders } from "@/hooks/useUserOrders";
import SuccessAnimation from "@/components/animations/SuccessAnimation";
import { useRouter } from "next/router";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { user, loading: userLoading, isLoggedIn } = useAuth();
  const { orders, loading: ordersLoading } = useUserOrders();
  const [confetti, setConfetti] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // تابع برای ایجاد نام فایل امن
  const sanitizeFileName = (name: string) => {
    return name
      .replace(/[<>:"/\\|?*]/g, '_') // جایگزینی کاراکترهای غیرمجاز
      .replace(/\s+/g, '_') // جایگزینی فاصله با زیرخط
      .replace(/__+/g, '_') // حذف زیرخط‌های تکراری
      .trim();
  };

  useEffect(() => {
    clearCart();
    setConfetti(true);
    setPaymentDate(new Date().toLocaleDateString("fa-IR"));

    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [clearCart]);

  useEffect(() => {
    if (!ordersLoading && orders && orders.length > 0) {
      const latest = orders[orders.length - 1];
      setLatestOrder(latest);
      setTrackingNumber(latest.id || "");
    }
  }, [orders, ordersLoading]);

  const copyTrackingNumber = () => {
    if (!trackingNumber) return;
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // داده‌های فاکتور با استفاده از useMemo - بدون مالیات
  const invoiceData = useMemo(() => {
    if (latestOrder) {
      const subtotal = latestOrder.totalPrice || 3750000;
      const tax = 0; // مالیات حذف شد
      const total = subtotal; // جمع کل برابر با جمع آیتم‌ها
      
      const items = latestOrder.items ? latestOrder.items.map((item: any) => ({
        name: item.variant?.product?.title || "محصول",
        quantity: item.quantity || 1,
        price: item.finalPrice || item.price || 0
      })) : [
        { name: "پروژه وبسایت شرکتی", quantity: 1, price: 2500000 },
        { name: "هاست و دامنه یکساله", quantity: 1, price: 500000 },
        { name: "پشتیبانی ۶ ماهه", quantity: 1, price: 750000 },
      ];

      return {
        orderId: latestOrder.id || trackingNumber,
        date: latestOrder.createdAt 
          ? new Date(latestOrder.createdAt).toLocaleDateString("fa-IR")
          : paymentDate,
        items,
        subtotal,
        tax,
        total,
        customer: {
          name: user?.name || "کاربر وبوفن",
          email: user?.email || "user@example.com",
          phone: user?.phone || "09123456789"
        },
        orderStatus: latestOrder.status || "completed"
      };
    }

    return {
      orderId: trackingNumber,
      date: paymentDate,
      items: [
        { name: "پروژه وبسایت شرکتی", quantity: 1, price: 2500000 },
        { name: "هاست و دامنه یکساله", quantity: 1, price: 500000 },
        { name: "پشتیبانی ۶ ماهه", quantity: 1, price: 750000 },
      ],
      subtotal: 3750000,
      tax: 0, // مالیات حذف شد
      customer: {
        name: user?.name || "کاربر وبوفن",
        email: user?.email || "user@example.com",
        phone: user?.phone || "09123456789"
      },
      orderStatus: "completed"
    };
  }, [latestOrder, trackingNumber, paymentDate, user]);

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

  const generateInvoicePDF = async () => {
    if (!invoiceRef.current || !trackingNumber) {
      alert("لطفاً منتظر بمانید تا اطلاعات سفارش بارگذاری شود");
      return;
    }

    setGeneratingInvoice(true);
    setInvoiceGenerated(false);

    try {
      const element = invoiceRef.current;
      const clone = element.cloneNode(true) as HTMLElement;
      
      clone.className = '';
      clone.style.cssText = `
        background-color: white;
        padding: 32px;
        width: 210mm;
        min-height: 297mm;
        font-family: Arial, Tahoma, sans-serif;
        direction: rtl;
        color: #333;
      `;
      
      replaceOklchStyles(clone);
      
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);
      tempDiv.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        removeContainer: true,
        onclone: (clonedDoc, clonedElement) => {
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach((el: Element) => {
            const htmlEl = el as HTMLElement;
            htmlEl.removeAttribute('class');
            
            const computedStyle = window.getComputedStyle(htmlEl);
            const color = computedStyle.color;
            const bgColor = computedStyle.backgroundColor;
            
            if (color.includes('oklch') || color.includes('oklab')) {
              htmlEl.style.color = '#374151';
            }
            if (bgColor.includes('oklch') || bgColor.includes('oklab')) {
              htmlEl.style.backgroundColor = bgColor.includes('gradient') ? 'white' : '#f9fafb';
            }
          });
        }
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 5;
      
      // ایجاد نام فایل با اسم شخص
      const customerName = invoiceData.customer.name || "کاربر";
      const safeCustomerName = sanitizeFileName(customerName);
      const safeTrackingNumber = sanitizeFileName(trackingNumber);
      const fileName = `فاکتور_${safeTrackingNumber}_${safeCustomerName}.pdf`;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(fileName);
      
      setInvoiceGenerated(true);
      setTimeout(() => setInvoiceGenerated(false), 3000);
      
    } catch (error) {
      console.error("خطا در تولید فاکتور:", error);
      
      if (error instanceof Error && (error.message.includes('oklch') || error.message.includes('color'))) {
        generateSimplePDF();
      } else {
        alert("خطا در تولید فاکتور. لطفاً دوباره تلاش کنید.");
      }
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const generateSimplePDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.setR2L(true);
      
      pdf.setFontSize(20);
      pdf.text('فاکتور فروش', 105, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text('وبوفن - پلتفرم تخصصی طراحی وبسایت', 105, 30, { align: 'center' });
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 40, 190, 40);
      
      let y = 50;
      pdf.setFontSize(11);
      pdf.text(`شماره فاکتور: ${trackingNumber}`, 180, y, { align: 'right' });
      pdf.text(`تاریخ: ${paymentDate}`, 180, y + 7, { align: 'right' });
      
      y += 25;
      pdf.setFontSize(12);
      pdf.text('اطلاعات مشتری:', 20, y);
      pdf.setFontSize(11);
      pdf.text(`نام: ${invoiceData.customer.name}`, 180, y, { align: 'right' });
      pdf.text(`ایمیل: ${invoiceData.customer.email}`, 180, y + 7, { align: 'right' });
      pdf.text(`تلفن: ${invoiceData.customer.phone}`, 180, y + 14, { align: 'right' });
      
      y += 30;
      pdf.setFontSize(12);
      pdf.text('جزئیات سفارش:', 20, y);
      
      y += 10;
      pdf.setFillColor(241, 245, 249);
      pdf.rect(20, y, 170, 10, 'F');
      pdf.setFontSize(11);
      pdf.text('نام کالا/خدمت', 180, y + 7, { align: 'right' });
      pdf.text('تعداد', 100, y + 7, { align: 'center' });
      pdf.text('مبلغ (ریال)', 50, y + 7, { align: 'center' });
      pdf.text('جمع (ریال)', 20, y + 7, { align: 'center' });
      
      y += 10;
      invoiceData.items.forEach((item:any, index:any) => {
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(20, y, 170, 10, 'F');
        }
        pdf.text(item.name, 180, y + 7, { align: 'right' });
        pdf.text(item.quantity.toString(), 100, y + 7, { align: 'center' });
        pdf.text(item.price.toLocaleString(), 50, y + 7, { align: 'left' });
        pdf.text((item.price * item.quantity).toLocaleString(), 20, y + 7, { align: 'left' });
        y += 10;
      });
      
      y += 10;
      // فقط جمع کل نمایش داده می‌شود (بدون مالیات)
      
      y += 20;
      pdf.setFontSize(14);
      pdf.setDrawColor(41, 176, 203);
      pdf.setLineWidth(0.5);
      pdf.line(100, y, 190, y);
      y += 5;
      pdf.setFontSize(14);
      pdf.text(`مبلغ قابل پرداخت: ${invoiceData.total.toLocaleString()} ریال`, 180, y, { align: 'center' });
      
      y += 30;
      pdf.setFontSize(10);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, y, 190, y);
      y += 5;
      pdf.text('تلفن پشتیبانی: ۰۲۱-۸۸۵۱۴۹۵۱', 105, y, { align: 'center' });
      pdf.text('ایمیل: info@webofun.com', 105, y + 5, { align: 'center' });
      pdf.text('با تشکر از اعتماد شما به وبوفن', 105, y + 15, { align: 'center' });
      
      // ایجاد نام فایل با اسم شخص
      const customerName = invoiceData.customer.name || "کاربر";
      const safeCustomerName = sanitizeFileName(customerName);
      const safeTrackingNumber = sanitizeFileName(trackingNumber || invoiceData.orderId || "بدون-شماره");
      const fileName = `فاکتور_${safeTrackingNumber}_${safeCustomerName}.pdf`;
      
      pdf.save(fileName);
      setInvoiceGenerated(true);
      setTimeout(() => setInvoiceGenerated(false), 3000);
      
    } catch (error) {
      console.error("خطا در تولید PDF ساده:", error);
      alert("لطفاً از دکمه چاپ مرورگر (Ctrl+P) استفاده کنید و صفحه را به عنوان PDF ذخیره نمایید.");
    }
  };

  const handleDownloadInvoice = () => {
    generateInvoicePDF();
  };

  const handleBackToShop = () => {
    router.push("/products");
  };

  // تابع جدید برای رفتن به داشبورد
  const handleGoToDashboard = async () => {
    setDashboardLoading(true);
    try {
       router.push("/dashboard");
    } catch (error) {
      console.error("خطا در انتقال به داشبورد:", error);
      router.push("/dashboard");
    } finally {
      setTimeout(() => {
        setDashboardLoading(false);
      }, 3000);
    }
  };

  const getOrderStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "در انتظار تایید",
      processing: "در حال پردازش",
      completed: "تکمیل شده",
      cancelled: "لغو شده",
      paid: "پرداخت شده"
    };
    return statusMap[status] || status;
  };

  const getOrderStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      paid: "bg-green-100 text-green-700"
    };
    return colorMap[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      <Head>
        <title>پرداخت موفق | وبوفن</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* بخش مخفی برای فاکتور */}
        <div className="fixed -left-[10000px] -top-[10000px]" aria-hidden="true">
          <div 
            ref={invoiceRef}
            className="invoice-template"
            style={{
              backgroundColor: 'white',
              padding: '32px',
              width: '210mm',
              minHeight: '297mm',
              fontFamily: 'Arial, Tahoma, sans-serif',
              direction: 'rtl',
              color: '#333',
              boxSizing: 'border-box'
            }}
          >
            {/* هدر */}
            <div style={{
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '24px',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: '0 0 8px 0'
                }}>
                  وبوفن
                </h1>
                <p style={{
                  color: '#6b7280',
                  margin: '0',
                  fontSize: '14px'
                }}>
                  پلتفرم تخصصی طراحی وبسایت
                </p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#29b0cb',
                  margin: '0 0 8px 0'
                }}>
                  فاکتور فروش
                </h2>
                <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>
                  شماره: {invoiceData.orderId || 'در حال بارگذاری...'}
                </p>
                <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>
                  تاریخ: {invoiceData.date || 'در حال بارگذاری...'}
                </p>
                <p style={{ color: '#6b7280', margin: '4px 0', fontSize: '14px' }}>
                  وضعیت: {getOrderStatusText(invoiceData.orderStatus)}
                </p>
              </div>
            </div>

            {/* اطلاعات مشتری */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px'
              }}>
                اطلاعات مشتری
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                backgroundColor: '#f9fafb',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px' }}>نام:</p>
                  <p style={{ fontWeight: '500', margin: '0', fontSize: '15px' }}>
                    {userLoading ? 'در حال دریافت...' : invoiceData.customer.name}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px' }}>ایمیل:</p>
                  <p style={{ fontWeight: '500', margin: '0', fontSize: '15px' }}>
                    {userLoading ? 'در حال دریافت...' : invoiceData.customer.email}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px' }}>تلفن:</p>
                  <p style={{ fontWeight: '500', margin: '0', fontSize: '15px' }}>
                    {userLoading ? 'در حال دریافت...' : invoiceData.customer.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* جدول محصولات */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px'
              }}>
                جزئیات سفارش
              </h3>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #d1d5db'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{
                      border: '1px solid #d1d5db',
                      padding: '12px',
                      fontWeight: '600',
                      textAlign: 'center',
                      fontSize: '14px'
                    }}>
                      نام کالا/خدمت
                    </th>
                    <th style={{
                      border: '1px solid #d1d5db',
                      padding: '12px',
                      fontWeight: '600',
                      textAlign: 'center',
                      fontSize: '14px'
                    }}>
                      تعداد
                    </th>
                    <th style={{
                      border: '1px solid #d1d5db',
                      padding: '12px',
                      fontWeight: '600',
                      textAlign: 'center',
                      fontSize: '14px'
                    }}>
                      مبلغ (ریال)
                    </th>
                    <th style={{
                      border: '1px solid #d1d5db',
                      padding: '12px',
                      fontWeight: '600',
                      textAlign: 'center',
                      fontSize: '14px'
                    }}>
                      جمع (ریال)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item:any, index:any) => (
                    <tr key={index} style={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                    }}>
                      <td style={{
                        border: '1px solid #d1d5db',
                        padding: '12px',
                        fontSize: '14px'
                      }}>
                        {item.name}
                      </td>
                      <td style={{
                        border: '1px solid #d1d5db',
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '14px'
                      }}>
                        {item.quantity}
                      </td>
                      <td style={{
                        border: '1px solid #d1d5db',
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '14px'
                      }}>
                        {item.price.toLocaleString()}
                      </td>
                      <td style={{
                        border: '1px solid #d1d5db',
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '14px'
                      }}>
                        {(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* محاسبات نهایی - بدون مالیات */}
            <div style={{
              borderTop: '2px solid #e5e7eb',
              paddingTop: '24px',
              marginTop: '24px'
            }}>
              <div style={{
                maxWidth: '400px',
                marginLeft: 'auto'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '15px'
                }}>
                </div>
                {/* بخش مالیات حذف شد */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderTop: '1px solid #d1d5db',
                  paddingTop: '16px',
                  marginTop: '16px',
                  color: '#29b0cb'
                }}>
                  <span>مبلغ قابل پرداخت:</span>
                  {/* اصلاح این خطا */}
                  <span>{(invoiceData.total || 3750000).toLocaleString()} ریال</span>
                </div>
              </div>
            </div>

            {/* فوتر */}
            <div style={{
              marginTop: '48px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb',
              fontSize: '13px',
              color: '#6b7280'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '32px'
              }}>
                <div>
                  <h4 style={{
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    اطلاعات تماس
                  </h4>
                  <p style={{ margin: '4px 0' }}>تلفن: 14 59 51 88 - 021 </p>
                  <p style={{ margin: '4px 0' }}>ایمیل: webofenco@gmail.com</p>
                  <p style={{ margin: '4px 0' }}>آدرس: تهران - سهروردی شمالی - کوچه مهاجر - پلاک30</p>
                </div>
                <div>
                  <h4 style={{
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    شرایط و ضوابط
                  </h4>
                  <p style={{ margin: '4px 0' }}>
                    این فاکتور به منزله رسید پرداخت بوده و قابل استناد می‌باشد.
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <p style={{ color: '#9ca3af' }}>
                  با تشکر از اعتماد شما به وبوفن
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-gradient-to-r from-green-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-gradient-to-r from-purple-100/10 to-pink-100/10 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-20 left-20 w-4 h-4 bg-gray-900 rounded-full"></div>
          <div className="absolute top-40 right-32 w-3 h-3 bg-gray-900 rounded-full"></div>
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-gray-900 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-5 h-5 bg-gray-900 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-[1250px] mx-auto py-12 px-4">
          {/* Success Animation */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-xl"></div>
            </div>
            <div className="relative flex justify-center">
              <SuccessAnimation />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between">
            {/* Main Content Card */}
            <div className="bg-white/70 w-full lg:w-2/3 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 p-6 lg:p-8 relative overflow-hidden">
              <div className="text-center mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  سفارش شما ثبت شد
                </h1>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  می‌توانید سفارش خود را در داشبورد مدیریت کنید
                </p>
                {user && isLoggedIn && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 inline-block">
                    <p className="text-green-800 text-sm">
                      فاکتور با نام <strong>{user.name}</strong> صادر خواهد شد
                    </p>
                  </div>
                )}
              </div>

              {/* Order Details */}
              <div className="space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 gap-3">
                  <span className="text-gray-600 text-sm whitespace-nowrap">شماره پیگیری</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="font-mono text-gray-800 font-medium truncate max-w-[200px]">
                      {ordersLoading ? "در حال بارگذاری..." : trackingNumber || "در حال دریافت..."}
                    </span>
                    <button
                      onClick={copyTrackingNumber}
                      disabled={!trackingNumber}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="کپی شماره پیگیری"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 gap-3">
                  <span className="text-gray-600 text-sm whitespace-nowrap">تاریخ پرداخت</span>
                  <span className="font-medium text-gray-800">
                    {paymentDate || "در حال بارگذاری..."}
                  </span>
                </div>

                {/* وضعیت سفارش */}
                {latestOrder && (
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 gap-3">
                    <span className="text-gray-600 text-sm whitespace-nowrap">وضعیت سفارش</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(latestOrder.status)}`}>
                      {getOrderStatusText(latestOrder.status)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadInvoice}
                  disabled={!trackingNumber || generatingInvoice}
                  className="flex-1 bg-[#29b0cb] cursor-pointer hover:bg-[#1d96af] text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingInvoice ? (
                    <>
                      <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>در حال تولید فاکتور...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5  group-hover:scale-110 transition-transform" />
                      <span>دریافت فاکتور PDF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleGoToDashboard}
                  disabled={dashboardLoading}
                  className="flex-1 cursor-pointer bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {dashboardLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                      <span>در حال انتقال...</span>
                    </>
                  ) : (
                    <>
                      <Home className="w-5 h-5 text-gray-500" />
                      <span>رفتن به داشبورد</span>
                    </>
                  )}
                </button>
              </div>
          
            </div>

            {/* Next Steps Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 p-6 w-full lg:w-1/3">
              <h3 className="font-semibold text-gray-800 mb-6 text-center text-lg">
                مراحل بعدی
              </h3>
              <div className="space-y-4">
                {[
                  { step: 1, text: "تایید نهایی سفارش در کمترین زمان" },
                  { step: 2, text: "وارد کردن مقادیر مورد نیاز در داشبورد" },
                  { step: 3, text: "انجام و تکمیل سفارش" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50/50 transition-colors duration-200 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium group-hover:border-gray-300 transition-colors">
                      {item.step}
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {item.text}
                    </span>
                    <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>

              {/* Important Notes */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 text-center">نکات مهم</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#29b0cb] rounded-full mt-1.5"></div>
                    <span>فاکتور رسمی قابل استناد و ارائه به مراجع قانونی است</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#29b0cb] rounded-full mt-1.5"></div>
                    <span>فاکتور به صورت PDF برای شما ارسال می‌شود</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#29b0cb] rounded-full mt-1.5"></div>
                    <span>می‌توانید فاکتور را در هر زمان مجدداً دانلود کنید</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#29b0cb] rounded-full mt-1.5"></div>
                    <span>قیمت‌ها بدون احتساب مالیات می‌باشند</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-8">
            <div className="bg-[#1d546b] backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 p-6">
              <p className="text-white text-sm mb-3 text-center">در صورت وجود هرگونه سوال</p>
              <div className="flex justify-center">
                <div className="font-mono text-gray-800 text-lg font-medium bg-white/90 rounded-xl py-2 px-6 inline-block text-center">
                  ۱۴ ۵۹ ۵۱ ۸۸ - ۰۲۱
                </div>
              </div>
              <p className="text-white/90 text-xs mt-3 text-center">پشتیبانی ۲۴ ساعته</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleBackToShop}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 py-2 px-4 rounded-xl hover:bg-white/50 transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">بازگشت به فروشگاه</span>
            </button>
          </div>
        </div>

        {/* Copied Toast */}
        {copied && (
          <div className="z-50 fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-lg animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              شماره پیگیری کپی شد
            </div>
          </div>
        )}

        {/* Invoice Generated Toast */}
        {invoiceGenerated && (
          <div className="z-50 fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-lg animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              فاکتور با موفقیت تولید شد
            </div>
          </div>
        )}

        {/* Dashboard Loading Overlay */}
        {dashboardLoading && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#29b0cb]"></div>
              <p className="text-gray-700 font-medium">در حال انتقال به داشبورد...</p>
              <p className="text-gray-500 text-sm">لطفاً چند لحظه صبر کنید</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}