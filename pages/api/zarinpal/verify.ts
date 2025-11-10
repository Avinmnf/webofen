import type { NextApiRequest, NextApiResponse } from "next";
import { graphqlRequest } from "@/lib/graphqlClient";

const ZARINPAL_API_BASE =
  process.env.ZARINPAL_SANDBOX === "true"
    ? "https://sandbox.zarinpal.com/pg/v4/payment"
    : "https://api.zarinpal.com/pg/v4/payment";

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID as string;
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL as string;
const FRONTEND_URL = process.env.NEXT_PUBLIC_WEBOFEN || "http://localhost:3002";

function formatPhoneNumber(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("989") && digits.length === 12) return digits;
  if (digits.startsWith("09") && digits.length === 11) return "98" + digits.slice(1);
  if (digits.startsWith("9") && digits.length === 10) return "98" + digits;
  return null;
}

// Send SMS to admins via the API route
async function sendOrderCreatedSmsToAdmins({
  orderId,
  customerName,
  totalPrice,
}: {
  orderId: string;
  customerName: string;
  totalPrice: number;
}) {
  try {
    const smsEventQuery = `
      query {
        smsEvents(where: { 
          value: { equals: "new_order" }, 
          isActive: { equals: true } 
        }) {
          id
          patternCode
          variables
          roles { id name users { id name phone } }
        }
      }
    `;
    const smsEventRes = await graphqlRequest(smsEventQuery, {});
    const smsEvent = smsEventRes.smsEvents?.[0];
    if (!smsEvent) return;

    const adminPhonesSet = new Set<string>();
    for (const role of smsEvent.roles) {
      for (const user of role.users) {
        const formatted = formatPhoneNumber(user.phone);
        if (formatted) adminPhonesSet.add(formatted);
      }
    }
    const adminPhones = Array.from(adminPhonesSet);
    if (adminPhones.length === 0) return;

    const smsVars: Record<string, any> = {};
    for (const varName of smsEvent.variables || []) {
      switch (varName) {
        case "id": smsVars[varName] = orderId; break;
        case "customer_name": smsVars[varName] = customerName; break;
        case "total_price": smsVars[varName] = totalPrice; break;
        default: smsVars[varName] = "";
      }
    }

    // Send SMS via API route
    const smsRes = await fetch(`${FRONTEND_URL}/api/sms/smssend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phones: adminPhones,
        patternCode: smsEvent.patternCode,
        variables: smsVars,
      }),
    });
    const smsResults = await smsRes.json();

    // Log each SMS in CMS
    for (const phone of adminPhones) {
      await graphqlRequest(
        `
        mutation ($data: SmsLogCreateInput!) {
          createSmsLog(data: $data) { id }
        }
      `,
        {
          data: {
            order: { connect: { id: orderId } },
            user: null,
            event: { connect: { id: smsEvent.id } },
            eventType: "order_admin",
            statusValue: smsResults.results?.[phone]?.includes("Sent") ? "sent" : "failed",
            message: `Order created SMS sent to ${phone}: ${smsResults.results?.[phone]}`,
          },
        }
      );
    }
  } catch (err) {
    console.error("Error sending order-created SMS to admins:", err);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const Authority = req.query.Authority as string;
    const Status = req.query.Status as string;
    const orderId = req.query.orderId as string;

    if (!Authority || !Status || !orderId || Status !== "OK") {
      return res.redirect(`${FRONTEND_URL}/payment/fail`);
    }

    // Fetch order info
    const orderQuery = `
      query ($id: ID!) {
        order(where: { id: $id }) { 
          id totalPrice status transactionId customerName customerPhone
        }
      }
    `;
    const orderRes = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: orderQuery, variables: { id: orderId } }),
    });
    const orderData = await orderRes.json();
    const order = orderData.data?.order;

    if (!order?.totalPrice) return res.redirect(`${FRONTEND_URL}/payment/fail`);

    // Verify payment with Zarinpal
    const verifyRes = await fetch(`${ZARINPAL_API_BASE}/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: order.totalPrice,
        authority: Authority,
      }),
    });

    const verifyData = await verifyRes.json();
    const code = verifyData.data?.code;
    const ref_id = verifyData.data?.ref_id;

    if (code === 100 || code === 101) {
      // Update order in GraphQL
      const updateMutation = `
        mutation UpdateOrder($id: ID!, $data: OrderUpdateInput!) {
          updateOrder(where: { id: $id }, data: $data) { id status transactionId }
        }
      `;
      const updateRes = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: updateMutation,
          variables: {
            id: orderId,
            data: { status: "pending", transactionId: String(ref_id || "") },
          },
        }),
      });

      const updateJson = await updateRes.json();
      const successParams = new URLSearchParams({
        paymentSuccess: "true",
        ...(ref_id && { ref_id: String(ref_id) }),
        ...((updateJson.errors || []).length && { orderUpdate: "failed" }),
      });

      // Send admin SMS via API
      await sendOrderCreatedSmsToAdmins({
        orderId,
        customerName: order.customerName,
        totalPrice: order.totalPrice,
      });

      // Send payment success SMS to user via API route
      await fetch(`${FRONTEND_URL}/api/zarinpal/sms/payment-success`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          totalPrice: order.totalPrice,
        }),
      }).catch((err) => console.error("[USER SMS] ❌ Error calling SMS API:", err));

      return res.redirect(302, `${FRONTEND_URL}/payment/success?${successParams.toString()}`);
    }

    return res.redirect(`${FRONTEND_URL}/payment/fail`);
  } catch (err) {
    console.error("💥 Zarinpal verify error:", err);
    return res.redirect(`${FRONTEND_URL}/payment/fail`);
  }
}
