import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST is allowed" });
  }

  let browser;
  try {
    const order = req.body;

    if (!order || !order.id || !order.items) {
      return res.status(400).json({ error: "داده‌های سفارش نامعتبر است" });
    }

    const statusMap: Record<string, string> = {
      Processing: "در حال بررسی",
      Cancelled: "لغو شده",
      Pending: "در انتظار",
      Completed: "تکمیل شده",
      waiting: "در حال پردازش",
      submitted: "تکمیل شده",
    };

    const html = `
      <html lang="fa" dir="rtl">
        <head>
          <meta charset="UTF-8" />
          <style>
            @font-face {
              font-family: 'YekanBakh';
              src: url('https://cdn.fontcdn.ir/Fonts/Yekan/YekanBakhFaNum-Regular.ttf') format('truetype');
            }
            
            body {
              font-family: 'YekanBakh', Tahoma, sans-serif;
              background: #f8fafc;
              padding: 20px;
              margin: 0;
              color: #334155;
            }
            
            .invoice-container {
              max-width: 900px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            
            /* هدر */
            .header {
              background: #3b82f6;
              color: white;
              padding: 30px;
              text-align: center;
            }
            
            .header h1 {
              font-size: 24px;
              margin: 0 0 8px 0;
              font-weight: bold;
            }
            
            .header p {
              margin: 4px 0;
              opacity: 0.9;
            }
            
            /* اطلاعات */
            .info-section {
              padding: 25px;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            
            .info-box {
              background: #f8fafc;
              padding: 16px;
              border-radius: 8px;
              border-right: 4px solid #3b82f6;
            }
            
            .info-title {
              font-weight: bold;
              color: #475569;
              margin-bottom: 8px;
              font-size: 14px;
            }
            
            .info-content {
              font-size: 14px;
              color: #1e293b;
            }
            
            /* جدول */
            .table-section {
              padding: 25px;
            }
            
            .section-title {
              font-size: 18px;
              color: #1e293b;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #3b82f6;
              display: inline-block;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              background: white;
              border-radius: 8px;
              overflow: hidden;
            }
            
            thead {
              background: #f1f5f9;
            }
            
            th {
              padding: 14px 12px;
              text-align: center;
              font-weight: bold;
              color: #475569;
              border-bottom: 2px solid #e2e8f0;
              font-size: 13px;
            }
            
            td {
              padding: 12px;
              text-align: center;
              border-bottom: 1px solid #f1f5f9;
              font-size: 13px;
            }
            
            tbody tr:hover {
              background: #f8fafc;
            }
            
            /* وضعیت */
            .status {
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              display: inline-block;
            }
            
            .status-completed {
              background: #dcfce7;
              color: #166534;
            }
            
            .status-processing {
              background: #fef9c3;
              color: #854d0e;
            }
            
            .status-pending {
              background: #dbeafe;
              color: #1e40af;
            }
            
            .status-cancelled {
              background: #fee2e2;
              color: #991b1b;
            }
            
            /* جمع کل */
            .total-section {
              padding: 20px 25px;
              background: #1e293b;
              color: white;
              text-align: center;
            }
            
            .total-amount {
              font-size: 24px;
              font-weight: bold;
              color: #fbbf24;
              margin: 8px 0;
            }
            
            /* فوتر */
            .footer {
              padding: 20px 25px;
              background: #f8fafc;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            
            .footer p {
              margin: 8px 0;
              color: #64748b;
              font-size: 13px;
            }
            
            .thank-you {
              color: #3b82f6;
              font-weight: bold;
              margin-top: 15px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- هدر -->
            <div class="header">
              <h1>فاکتور فروش</h1>
              <p>شماره فاکتور: ${order.id}</p>
            </div>
            
            <!-- اطلاعات -->
            <div class="info-section">
              <div class="info-grid">
                <div class="info-box">
                  <div class="info-title">مشتری</div>
                  <div class="info-content">${order.customerName || "نامشخص"}</div>
                </div>
                <div class="info-box">
                  <div class="info-title">تاریخ صدور</div>
                  <div class="info-content">${new Date(order.createdAt || Date.now()).toLocaleDateString("fa-IR")}</div>
                </div>
                <div class="info-box">
                  <div class="info-title">وضعیت سفارش</div>
                  <div class="info-content">${statusMap[order.status?.trim()] || order.status || "نامشخص"}</div>
                </div>
                <div class="info-box">
                  <div class="info-title">شماره سفارش</div>
                  <div class="info-content">${order.id}</div>
                </div>
              </div>
            </div>
            
            <!-- جدول محصولات -->
            <div class="table-section">
              <div class="section-title">لیست محصولات</div>
              <table>
                <thead>
                  <tr>
                    <th>ردیف</th>
                    <th>محصول</th>
                    <th>ویژگی‌ها</th>
                    <th>تعداد</th>
                    <th>قیمت</th>
                    <th>وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
                    .map(
                      (item: any, index: number) => {
                        const statusClass = 
                          item.status === 'Completed' || item.status === 'submitted' ? 'status-completed' :
                          item.status === 'Processing' || item.status === 'waiting' ? 'status-processing' :
                          item.status === 'Pending' ? 'status-pending' :
                          item.status === 'Cancelled' ? 'status-cancelled' : 'status-pending';
                        
                        return `
                        <tr>
                          <td>${index + 1}</td>
                          <td><strong>${item.variant?.product?.title || "محصول حذف‌شده"}</strong></td>
                          <td>
                            ${item.variant?.attributeValues
                              ?.map((av: any) => `${av.attribute?.name || "ویژگی"}: ${av.value || "-"}`)
                              .join("، ") || "-"}
                          </td>
                          <td>${item.quantity || 0}</td>
                          <td><strong>${(item.finalPrice || 0).toLocaleString("fa-IR")} تومان</strong></td>
                          <td>
                            <span class="status ${statusClass}">
                              ${statusMap[item.status?.trim()] || item.status || "نامشخص"}
                            </span>
                          </td>
                        </tr>
                      `;
                      }
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            
            <!-- جمع کل -->
            <div class="total-section">
              <div>مبلغ قابل پرداخت</div>
              <div class="total-amount">${(order.totalPrice || 0).toLocaleString("fa-IR")} تومان</div>
              <div style="font-size: 12px; opacity: 0.8;">پرداخت شده</div>
            </div>
            
            <!-- فوتر -->
            <div class="footer">
              <p>با تشکر از خرید شما | پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</p>
              <p>www.webofen.com | email@webofen.com</p>
              <div class="thank-you">نظرات شما باعث بهبود ما می‌شود</div>
            </div>
          </div>
        </body>
      </html>
    `;

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });
    await page.setDefaultTimeout(30000);
    await page.setContent(html, { 
      waitUntil: "networkidle0",
      timeout: 30000 
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      }
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.id}.pdf`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.end(pdfBuffer);

  } catch (err) {
    if (browser) {
      await browser.close();
    }
    
    console.error("Error generating PDF:", err);
    const errorMessage = err instanceof Error ? err.message : "خطای ناشناخته";
    res.status(500).json({ 
      error: "خطا در تولید PDF",
      details: errorMessage
    });
  }
}