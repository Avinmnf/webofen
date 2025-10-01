import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "Phone and code are required" });

  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
const JWT_SECRET = process.env.AUTH_SECRET!;
  if (!graphqlUrl || !JWT_SECRET) return res.status(500).json({ error: "GRAPHQL_URL or JWT_SECRET missing in env" });

  try {
    // 1. پیدا کردن کاربر با شماره تلفن
    const userRes = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query FindUser($phone: String!) {
            users(where: { phone: { equals: $phone } }) {
              id
              name
              email
              phone
              otpCode
              otpExpires
              role { name }
            }
          }
        `,
        variables: { phone },
      }),
    });

    const userJson = await userRes.json();
    const user = userJson.data?.users?.[0];

    if (!user) {
      return res.status(400).json({ error: "کاربری با این شماره یافت نشد" });
    }

    // 2. بررسی OTP
    if (String(user.otpCode) !== String(code)) return res.status(400).json({ error: "کد تایید اشتباه است" });
    if (!user.otpExpires || new Date(user.otpExpires).getTime() < Date.now())
      return res.status(400).json({ error: "کد تایید منقضی شده است" });

    // 3. پاک کردن OTP بعد از استفاده
    await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation ClearOtp($id: ID!) {
            updateUser(where: { id: $id }, data: { otpCode: null, otpExpires: null }) {
              id
            }
          }
        `,
        variables: { id: user.id },
      }),
    });

    // 4. ساخت JWT
    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role?.name || "client",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. ست کردن کوکی (برای اینکه بعد از رفرش هم لاگین بمونه)
    setCookie("token", token, {
      req,
      res,
      maxAge: 60 * 60 * 24 * 7, // 7 روز
      path: "/",
      httpOnly: true,           // امن‌تر
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ user, token });
  } catch (err: any) {
    console.error("Server error in verify-otp:", err);
    return res.status(500).json({ error: err.message });
  }
}