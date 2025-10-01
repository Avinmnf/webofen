import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST is allowed" });
  }

  try {
    const order = req.body;

    const statusMap: Record<string, string> = {
      Processing: "در حال بررسی",
      Cancelled: "لغو شده",
      Pending: "در انتظار",
      Completed: "تکمیل شده",
      waiting: "در حال پردازش",
      submitted:"تکمیل شده",
    };

    const html = `
      <html lang="fa" dir="rtl">
        <head>
          <meta charset="UTF-8" />
          <style>
            @font-face {
              font-family: 'YekanBakh';
              src: url('http://localhost:3002/fonts/YekanBakhFaNum-Regular.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
            }
            body { font-family: 'YekanBakh'; padding: 30px; background: #fafafa; }
            .invoice-container { background: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .logo { text-align: right; margin-bottom: 15px; }
            .logo img { max-width: 120px; height: auto; }
            h1 { color: #2c3e50; font-size: 16px; margin-bottom: 20px; text-align: center; }
            .info { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; background: #fdfdfd; border-radius: 8px; }
            .info p { margin: 5px 0; font-size: 14px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th, td { border: 1px solid #ddd; padding: 10px; }
            th { background-color: #f4f6f8; text-align: center; color: #555; }
            td { text-align: center; color: #333; }
            tbody tr:nth-child(even) { background-color: #fafafa; }
            tbody tr:hover { background-color: #f1f7ff; }
            .total { margin-top: 20px; text-align: left; font-size: 14px; font-weight: bold; color: #2c3e50; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="logo">
              <img src="http://localhost:3002/homepage/logo.png" alt="لوگو"/>
            </div>
            <h1>فاکتور  </h1>

            <div class="info">
              <p>نام مشتری: ${order.customerName}</p>
              <p>شناسه سفارش :${order.id}</p>
              <p>تاریخ صدور: ${new Date(order.createdAt).toLocaleDateString("fa-IR")}</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>محصول</th>
                  <th>ویژگی ‌ها</th>
                  <th>تعداد</th>
                  <th>قیمت</th>
                  <th>وضعیت</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item: any) => `
                    <tr>
                      <td>${item.variant.product.title}</td>
                      <td>${item.variant.attributeValues
                        ?.map((av: any) => `${av.attribute.name}: ${av.value}`)
                        .join(", ")}</td>
                      <td>${item.quantity}</td>
                      <td>${item.finalPrice?.toLocaleString("fa-IR")} تومان</td>
                      <td>${statusMap[item.status?.trim()] ?? item.status}</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="total">
              مبلغ کل: ${order.totalPrice.toLocaleString("fa-IR")} تومان
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.id}.pdf`);
    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطا در تولید PDF" });
  }
}