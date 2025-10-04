import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone, code, userId } = req.body;
  if (!phone || !code || !userId) return res.status(400).json({ error: "Phone, code and userId are required" });

  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (!graphqlUrl) return res.status(500).json({ error: "GRAPHQL_URL missing" });

  try {
    // Get current user
    const userRes = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query GetUser($id: ID!) {
            user(where: { id: $id }) { id otpCode otpExpires }
          }
        `,
        variables: { id: userId },
      }),
    });

    const userJson = await userRes.json();
    const user = userJson?.data?.user;
    if (!user) return res.status(400).json({ error: "کاربری یافت نشد" });

    if (String(user.otpCode) !== String(code)) return res.status(400).json({ error: "کد تایید اشتباه است" });
    if (!user.otpExpires || new Date(user.otpExpires).getTime() < Date.now())
      return res.status(400).json({ error: "کد تایید منقضی شده است" });

    // Update phone
    await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation UpdatePhone($id: ID!, $phone: String!) {
            updateUser(where: { id: $id }, data: { phone: $phone, otpCode: null, otpExpires: null }) {
              id
              phone
            }
          }
        `,
        variables: { id: userId, phone },
      }),
    });

    return res.status(200).json({ success: true, phone });
  } catch (err: any) {
    console.error("verify-otp (profile) error:", err);
    return res.status(500).json({ error: err.message });
  }
}
