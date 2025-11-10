import type { NextApiRequest, NextApiResponse } from "next";

const ZARINPAL_API_BASE =
  process.env.ZARINPAL_SANDBOX === "true"
    ? "https://sandbox.zarinpal.com/pg/v4/payment"
    : "https://api.zarinpal.com/pg/v4/payment";

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID as string;
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL as string;
const FRONTEND_URL = process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Missing orderId" });
    }

    // Fetch order totalPrice from your backend GraphQL API
    const orderQuery = `
      query ($id: ID!) {
        order(where: { id: $id }) { id totalPrice }
      }
    `;
    const orderRes = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: orderQuery, variables: { id: orderId } }),
    });
    const orderData = await orderRes.json();
    const totalPrice = orderData.data?.order?.totalPrice;

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order totalPrice" });
    }

    // IMPORTANT: callback URL now points to frontend domain (Next.js)
    const callbackUrl = `${FRONTEND_URL}/api/zarinpal/verify?orderId=${orderId}`;

    const paymentRes = await fetch(`${ZARINPAL_API_BASE}/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: totalPrice,
        callback_url: callbackUrl,
        description: `پرداخت سفارش ${orderId}`,
        metadata: { orderId },
      }),
    });

    const data = await paymentRes.json();

    if (data.data?.code === 100) {
      const startPayUrl =
        process.env.ZARINPAL_SANDBOX === "true"
          ? `https://sandbox.zarinpal.com/pg/StartPay/${data.data.authority}`
          : `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`;

      return res.json({
        success: true,
        authority: data.data.authority,
        startPay: startPayUrl,
      });
    }

    return res.status(400).json({
      success: false,
      message: data.errors || "Payment request failed",
    });
  } catch (err) {
    console.error("Zarinpal request error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
