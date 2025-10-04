import type { NextApiRequest, NextApiResponse } from "next";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone, userId } = req.body;
  if (!phone || !userId) return res.status(400).json({ error: "Phone and userId required" });

  const code = generateOTP();
  const expires = new Date(Date.now() + 5 * 60 * 1000);
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (!graphqlUrl) return res.status(500).json({ error: "GRAPHQL_URL missing" });

  try {
    // Check if phone is taken by another user
    const existsRes = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query CheckPhone($phone: String!) {
            users(where: { phone: { equals: $phone } }) { id }
          }
        `,
        variables: { phone },
      }),
    });

    const existsJson = await existsRes.json();
    const existingUser = existsJson?.data?.users?.[0];
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ error: "این شماره قبلاً ثبت شده است" });
    }

    // Save OTP on current user
    await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation UpdateUser($id: ID!, $otpCode: String, $otpExpires: DateTime) {
            updateUser(where: { id: $id }, data: { otpCode: $otpCode, otpExpires: $otpExpires }) { id }
          }
        `,
        variables: { id: userId, otpCode: code, otpExpires: expires.toISOString() },
      }),
    });

    // Send SMS
    const username = process.env.FARAZSMS_USER || "";
    const password = process.env.FARAZSMS_PASS || "";
    const from = process.env.FARAZSMS_FROM || "";
    const pattern = process.env.FARAZSMS_PATTERN || "";

    const smsRes = await fetch("http://ippanel.com/api/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        op: "pattern",
        user: username,
        pass: password,
        fromNum: from,
        toNum: phone,
        patternCode: pattern,
        inputData: [{ token: code }],
      }),
    });

    if (smsRes.ok) return res.status(200).json({ success: true, otpSentTo: phone });
    else return res.status(500).json({ error: "ارسال پیامک با خطا مواجه شد" });
  } catch (err: any) {
    console.error("send-otp (profile) error:", err);
    return res.status(500).json({ error: err.message });
  }
}
