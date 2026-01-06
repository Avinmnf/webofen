"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Head from "next/head";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Copy, Check, ArrowLeft, FileText, Home } from "lucide-react";
import { useUserOrders } from "@/hooks/useUserOrders";
import SuccessAnimation from "@/components/animations/SuccessAnimation";
import { useRouter } from "next/navigation";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from "next/link";
import Image from "next/image";

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
  const [isClient, setIsClient] = useState(false);
  const [returningToShop, setReturningToShop] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const statusMap: Record<string, string> = {
    Processing: "در حال بررسی",
    Cancelled: "لغو شده",
    waiting: "در حال پردازش",
    pending: "در انتظار",
    submitted: "تکمیل شده",
    Completed: "تکمیل شده",
    processing: "در حال پردازش",
    completed: "تکمیل شده",
    cancelled: "لغو شده",
    paid: "پرداخت شده"
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // تابع برای ایجاد نام فایل امن
  const sanitizeFileName = (name: string) => {
    return name
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/__+/g, '_')
      .trim();
  };

  useEffect(() => {
    clearCart();
    setConfetti(true);
    // فقط در سمت کلاینت تاریخ را تنظیم کن
    if (typeof window !== 'undefined') {
      setPaymentDate(new Date().toLocaleDateString("fa-IR"));
    }

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

  // داده‌های فاکتور با استفاده از useMemo
  const invoiceData = useMemo(() => {
    // در سمت سرور مقدار پیش‌فرض برگردان
    if (!isClient) {
      return {
        orderId: "",
        date: "",
        items: [],
        subtotal: 0,
        total: 0,
        customer: {
          name: "",
          email: "",
          phone: ""
        },
        orderStatus: ""
      };
    }

    if (latestOrder) {
      const subtotal = latestOrder.totalPrice || 3750000;
      const total = subtotal;
      
      const items = latestOrder.items ? latestOrder.items.map((item: any) => ({
        name: item.variant?.product?.title || "محصول",
        quantity: item.quantity || 1,
        price: item.finalPrice || item.price || 0,
        variant: item.variant,
        status: item.status
      })) : [
        { name: "پروژه وبسایت شرکتی", quantity: 1, price: 2500000, variant: null, status: 'completed' },
        { name: "هاست و دامنه یکساله", quantity: 1, price: 500000, variant: null, status: 'completed' },
        { name: "پشتیبانی ۶ ماهه", quantity: 1, price: 750000, variant: null, status: 'completed' },
      ];

      return {
        orderId: latestOrder.id || trackingNumber,
        date: latestOrder.createdAt 
          ? new Date(latestOrder.createdAt).toLocaleDateString("fa-IR")
          : paymentDate,
        items,
        subtotal,
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
        { name: "پروژه وبسایت شرکتی", quantity: 1, price: 2500000, variant: null, status: 'completed' },
        { name: "هاست و دامنه یکساله", quantity: 1, price: 500000, variant: null, status: 'completed' },
        { name: "پشتیبانی ۶ ماهه", quantity: 1, price: 750000, variant: null, status: 'completed' },
      ],
      subtotal: 3750000,
      total: 3750000,
      customer: {
        name: user?.name || "کاربر وبوفن",
        email: user?.email || "user@example.com",
        phone: user?.phone || "09123456789"
      },
      orderStatus: "completed"
    };
  }, [latestOrder, trackingNumber, paymentDate, user, isClient]);

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
        const logoContainer = document.createElement('div');
        logoContainer.style.textAlign = 'right';
        logoContainer.style.flexShrink = '0';
        logoContainer.style.marginRight = '20px';
        
        const logoImg = document.createElement('img');
        logoImg.src = '/logos/logo.png';
        logoImg.alt = 'لوگو';
        logoImg.style.width = '120px';
        logoImg.style.height = 'auto';
        logoImg.style.display = 'block';
        
        logoContainer.appendChild(logoImg);
        headerDiv.appendChild(logoContainer);
      }
      
      replaceOklchStyles(clone);
      
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm';
      tempDiv.style.backgroundColor = '#ffffff';
      document.body.appendChild(tempDiv);
      tempDiv.appendChild(clone);

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

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      // ایجاد نام فایل
      const customerName = invoiceData.customer.name || "کاربر";
      const safeCustomerName = sanitizeFileName(customerName);
      const safeTrackingNumber = sanitizeFileName(trackingNumber);
      const fileName = `فاکتور_${safeTrackingNumber}_${safeCustomerName}.pdf`;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // اضافه کردن صفحات بیشتر در صورت نیاز
      let heightLeft = imgHeight * ratio;
      let position = 0;
      
      if (heightLeft > pdfHeight) {
        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
          heightLeft -= pdfHeight;
        }
      }
      
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
      pdf.text('فاکتور فروش', 105, 20, { align: 'right' });
      
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
    setReturningToShop(true);
    
    // تاخیر برای نمایش لودینگ
    setTimeout(() => {
      router.push("/products");
      // متوقف کردن لودینگ بعد از 3 ثانیه برای ایمنی
      setTimeout(() => {
        setReturningToShop(false);
      }, 3000);
    }, 1000);
  };

  const handleGoToDashboard = () => {
    setDashboardLoading(true);
    
    // تاخیر برای نمایش انیمیشن لودینگ
    setTimeout(() => {
      // بررسی وضعیت لاگین کاربر
      if (!isLoggedIn) {
        // اگر کاربر لاگین نیست، به صفحه لاگین هدایت شود
        router.push("/login?redirect=/dashboard");
      } else {
        // استفاده از window.location.href برای هدایت مستقیم و مطمئن
        window.location.href = "/dashboard";
      }
      
      // اگر بعد از 3 ثانیه هنوز در صفحه هستیم، لودینگ را متوقف کنیم
      setTimeout(() => {
        setDashboardLoading(false);
      }, 3000);
    }, 1000);
  };

  const getOrderStatusText = (status: string) => {
    return statusMap[status] || status;
  };

  const getOrderStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      paid: "bg-green-100 text-green-700",
      Processing: "bg-blue-100 text-blue-700",
      Cancelled: "bg-red-100 text-red-700",
      waiting: "bg-yellow-100 text-yellow-700",
      submitted: "bg-green-100 text-green-700",
      Completed: "bg-green-100 text-green-700",
    };
    return colorMap[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      <Head>
        <title>پرداخت موفق | وبوفن</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      {/* لوگو در صفحه اصلی - سمت راست */}
      <div className="absolute top-6 right-6 z-20">
        <div className="flex items-center justify-end">
          <Image 
            src="/logos/logo.png" 
            alt="لوگو وبوفن" 
            width={120} 
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
      </div>
      
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* بخش مخفی برای فاکتور - فقط در سمت کلاینت نمایش داده شود */}
        {isClient && invoiceData && (
          <div className="fixed -left-[10000px] -top-[10000px]" aria-hidden="true">
            <div 
              ref={invoiceRef}
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
                    <p><strong>تاریخ صدور:</strong> {invoiceData.date || new Date().toLocaleString("fa-IR")}</p>
                    <p><strong>شماره فاکتور:</strong> INV-{invoiceData.orderId || 'در حال بارگذاری...'}</p>
                  </div>
                </div>
                {/* لوگو در سمت راست (در PDF اضافه خواهد شد) */}
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
                    <p style={{ color: '#374151', marginBottom: '8px' }}><strong>شناسه سفارش:</strong> {invoiceData.orderId}</p>
                    <p style={{ color: '#374151', marginBottom: '8px' }}><strong>نام مشتری:</strong> {invoiceData.customer.name}</p>
                    <p style={{ color: '#374151', marginBottom: '8px' }}><strong>تاریخ سفارش:</strong> {invoiceData.date}</p>
                  </div>
                  <div>
                    <p style={{ color: '#374151', marginBottom: '8px' }}><strong>ایمیل:</strong> {invoiceData.customer.email}</p>
                    <p style={{ color: '#374151', marginBottom: '8px' }}><strong>تلفن:</strong> {invoiceData.customer.phone}</p>
                    <p style={{ color: '#374151', marginBottom: '8px' }}><strong>وضعیت سفارش:</strong> {getOrderStatusText(invoiceData.orderStatus)}</p>
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
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>تعداد</th>
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>قیمت واحد</th>
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>قیمت کل</th>
                      <th style={{ border: '1px solid #3b82f6', padding: '14px', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item: any, index: number) => {
                      const getStatusStyle = (status: string) => {
                        if (status === 'Completed' || status === 'submitted' || status === 'completed') {
                          return { 
                            backgroundColor: '#d1fae5', 
                            color: '#065f46', 
                            padding: '6px 12px', 
                            borderRadius: '20px', 
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'inline-block'
                          };
                        } else if (status === 'Cancelled' || status === 'cancelled') {
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
                        <tr key={index} style={{ 
                          borderBottom: '1px solid #e5e7eb',
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                        }}>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', textAlign: 'center', color: '#374151' }}>{index + 1}</td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', color: '#374151', fontWeight: '500' }}>{item.name}</td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', textAlign: 'center', color: '#374151' }}>{item.quantity || 0}</td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', textAlign: 'left', color: '#1e40af', fontWeight: '500' }}>
                            {item.price ? `${item.price.toLocaleString("fa-IR")} تومان` : "—"}
                          </td>
                          <td style={{ border: '1px solid #e5e7eb', padding: '12px', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>
                            {item.price && item.quantity 
                              ? `${(item.price * item.quantity).toLocaleString("fa-IR")} تومان`
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
                        {invoiceData.items.length}
                      </span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e40af' }}>
                      <strong>مبلغ قابل پرداخت:</strong> 
                      <span style={{ marginRight: '12px', fontSize: '24px' }}>
                        {Number(invoiceData.total || 0).toLocaleString("fa-IR")}
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
        )}

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
                {isClient && user && isLoggedIn && (
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
                      {ordersLoading ? "در حال بارگذاری..." : (isClient ? trackingNumber : "در حال دریافت...")}
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
                    {isClient ? (paymentDate || "در حال بارگذاری...") : "در حال بارگذاری..."}
                  </span>
                </div>

                {/* وضعیت سفارش */}
                {isClient && latestOrder && (
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
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>در حال تولید فاکتور...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>دریافت فاکتور PDF</span>
                    </>
                  )}
                </button>

                {/* دکمه رفتن به داشبورد */}
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
              disabled={returningToShop}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 py-2 px-4 rounded-xl hover:bg-white/50 transition-all duration-200 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {returningToShop ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span className="text-sm">در حال انتقال...</span>
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm">بازگشت به فروشگاه</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Copied Toast */}
        {isClient && copied && (
          <div className="z-50 fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-lg animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              شماره پیگیری کپی شد
            </div>
          </div>
        )}

        {/* Invoice Generated Toast */}
        {isClient && invoiceGenerated && (
          <div className="z-50 fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-lg animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              فاکتور با موفقیت تولید شد
            </div>
          </div>
        )}

        {/* Shop Loading Overlay */}
        {returningToShop && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#29b0cb]"></div>
              <p className="text-gray-700 font-medium">در حال انتقال به فروشگاه...</p>
              <p className="text-gray-500 text-sm text-center">لطفاً چند لحظه صبر کنید</p>
            </div>
          </div>
        )}

        {/* Dashboard Loading Overlay */}
        {dashboardLoading && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#29b0cb]"></div>
              <p className="text-gray-700 font-medium">در حال انتقال به داشبورد...</p>
              <p className="text-gray-500 text-sm text-center">لطفاً چند لحظه صبر کنید</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}