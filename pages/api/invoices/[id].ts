// /pages/api/invoices/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

interface InputValue {
  fieldName: string;
  value: string;
}

interface OrderItem {
  id: string;
  variant: { product: { title: string } };
  quantity: number;
  originalPrice: number;
  finalPrice: number;
  status: string;
  adminStatus: string;
  inputValues?: InputValue[];
}

interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  totalPrice: number;
  items: OrderItem[];
}

const adminStatusMap: Record<string, string> = {
  pending: "در انتظار بررسی",
  in_progress: "در حال انجام",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  out_of_time: "مهلت گذشته",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "فقط متد POST مجاز است" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "شناسه سفارش معتبر نیست" });
  }

  try {
    const order: Order = req.body;

    if (!order || typeof order !== "object" || !Array.isArray(order.items)) {
      return res.status(400).json({ error: "داده سفارش معتبر نیست" });
    }

    const fontPath = path.join(process.cwd(), "public/fonts/YekanBakhFaNum-Regular.ttf");
    if (!fs.existsSync(fontPath)) {
      return res.status(500).json({ error: "فونت فارسی پیدا نشد" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${id}.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 40, layout: "portrait" });
    doc.registerFont("Yekan", fontPath);
    doc.pipe(res);

    // عنوان
    doc.font("Yekan").fontSize(24).fillColor("#333333")
      .text("Invoice", { align: "center" });
    doc.moveDown(1);

    // اطلاعات سفارش - چپ‌چین
   doc.font("Yekan").fontSize(12)
      .text(`شناسه سفارش\u200C: ${order.id}`, { align: "right" })
      .text(`تاریخ\u200C: ${new Date(order.createdAt).toLocaleDateString("fa-IR")}`, { align: "right" })
      .text(`نام مشتری\u200C: ${order.customerName}`, { align: "right" })
      .text(`مبلغ کل\u200C: ${order.totalPrice.toLocaleString()} تومان`, { align: "right" })
      .moveDown();

    // جدول
    const tableTop = doc.y;
    const colWidths = [30, 150, 150, 50, 70, 80]; 
    const headers = ["ردیف", "محصول", "ویژگی", "تعداد", "قیمت", "وضعیت"];

    // هدر جدول با رنگ زمینه
    let x = doc.page.margins.left;
    headers.forEach((header, i) => {
      doc.rect(x, tableTop, colWidths[i], 25).fill("#f3f3f3");
      doc.fillColor("#000").font("Yekan").fontSize(12)
        .text(header, x, tableTop + 7, { width: colWidths[i], align: "center" });
      x += colWidths[i];
    });

    // خطوط افقی هدر
    doc.moveTo(doc.page.margins.left, tableTop)
      .lineTo(doc.page.width - doc.page.margins.right, tableTop)
      .stroke();
    doc.moveTo(doc.page.margins.left, tableTop + 25)
      .lineTo(doc.page.width - doc.page.margins.right, tableTop + 25)
      .stroke();

    let y = tableTop + 25;

    // ردیف‌ها
    order.items.forEach((item, index) => {
      x = doc.page.margins.left;
      const attrText = item.inputValues?.map(iv => `${iv.fieldName}: ${iv.value}`).join(", ") || "-";

      const rowData = [
        (index + 1).toString(),
        item.variant.product.title,
        attrText,
        item.quantity.toString(),
        item.finalPrice.toLocaleString() + " Toman",
        adminStatusMap[item.adminStatus] || item.adminStatus,
      ];

      rowData.forEach((text, i) => {
        doc.fillColor("#000").font("Yekan").fontSize(10)
          .text(text, x, y + 7, { width: colWidths[i], align: "center" });

        // خطوط عمودی ستون
        doc.moveTo(x, y)
          .lineTo(x, y + 25)
          .stroke();
        x += colWidths[i];
      });

      // خط پایین ردیف
      doc.moveTo(doc.page.margins.left, y + 25)
        .lineTo(doc.page.width - doc.page.margins.right, y + 25)
        .stroke();

      y += 25;

      if (y > doc.page.height - doc.page.margins.bottom - 50) {
        doc.addPage();
        y = doc.page.margins.top;
      }
    });

    doc.end();
  } catch (err) {
    console.error("Invoice PDF generation error:", err);
    res.status(500).json({ error: "Error generating invoice PDF" });
  }
}
