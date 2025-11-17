// pages/api/zarinpal/sms/payment-success.ts
import type { NextApiRequest, NextApiResponse } from "next";

function formatPhoneNumber(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("989") && digits.length === 12) return digits;
  if (digits.startsWith("09") && digits.length === 11)
    return "98" + digits.slice(1);
  if (digits.startsWith("9") && digits.length === 10) return "98" + digits;
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { orderId, customerName, customerPhone, totalPrice } = req.body;

    console.log("[USER SMS] Starting payment_success SMS for", customerPhone);

    const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
    const smsEventQuery = `
      query {
        smsEvents(where: { value: { equals: "payment_success" }, isActive: { equals: true } }) {
          id
          patternCode
          variables
        }
      }
    `;

    const smsEventRes = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: smsEventQuery }),
    }).then((r) => r.json());

    const smsEvent = smsEventRes.data?.smsEvents?.[0];
    if (!smsEvent) {
      console.warn("[USER SMS] ⚠️ No active 'payment_success' event found");
      return res.status(200).json({ success: false });
    }

    const formattedPhone = formatPhoneNumber(customerPhone);
    if (!formattedPhone) {
      console.warn("[USER SMS] ⚠️ Invalid phone number:", customerPhone);
      return res.status(200).json({ success: false });
    }

    const smsVars: Record<string, any> = {};
    for (const varName of smsEvent.variables || []) {
      switch (varName) {
        case "id":
          smsVars[varName] = orderId;
          break;
        case "customer_name":
          smsVars[varName] = customerName;
          break;
        case "total_price":
          smsVars[varName] = totalPrice;
          break;
        default:
          smsVars[varName] = "";
      }
    }

    // Send SMS via ippanel
    const smsPayload = {
      op: "pattern",
      user: process.env.FARAZSMS_USER || "",
      pass: process.env.FARAZSMS_PASS || "",
      fromNum: process.env.FARAZSMS_FROM || "",
      toNum: formattedPhone,
      patternCode: smsEvent.patternCode,
      inputData: [smsVars],
    };

    const smsRes = await fetch("http://ippanel.com/api/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(smsPayload),
    });

    const smsText = await smsRes.text();
    console.log(`[USER SMS] Sent to ${formattedPhone}:`, smsText);

    // Log in CMS via GraphQL
    const logMutation = `
      mutation ($data: SmsLogCreateInput!) {
        createSmsLog(data: $data) { id }
      }
    `;

    await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: logMutation,
        variables: {
          data: {
            order: { connect: { id: orderId } },
            user: null,
            event: { connect: { id: smsEvent.id } },
            eventType: "payment_success",
            statusValue: smsText.includes("Sent") ? "sent" : "failed",
            message: `Payment success SMS sent to ${formattedPhone}: ${smsText}`,
          },
        },
      }),
    });

    console.log(`[USER SMS] ✅ Payment success SMS logged for ${formattedPhone}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[USER SMS] ❌ Error sending payment_success SMS:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
