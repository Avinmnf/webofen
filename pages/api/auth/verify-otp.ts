import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone, code, userId } = req.body; // userId indicates profile phone edit
  if (!phone || !code) return res.status(400).json({ error: "Phone and code are required" });

  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  const JWT_SECRET = process.env.AUTH_SECRET!;
  if (!graphqlUrl || !JWT_SECRET) return res.status(500).json({ error: "GRAPHQL_URL or JWT_SECRET missing" });

  try {
    let user;

    if (userId) {
      // Profile edit: find user by ID
      const userRes = await fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetUser($id: ID!) {
              user(where: { id: $id }) {
                id
                name
                email
                phone
                otpCode
                otpExpires
              }
            }
          `,
          variables: { id: userId },
        }),
      });
      const userJson = await userRes.json();
      user = userJson?.data?.user;
      if (!user) return res.status(400).json({ error: "کاربری یافت نشد" });
    } else {
      // Login: find user by phone
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
      user = userJson?.data?.users?.[0];
      if (!user) return res.status(400).json({ error: "کاربری با این شماره یافت نشد" });
    }

    // Verify OTP
    if (String(user.otpCode) !== String(code))
      return res.status(400).json({ error: "کد تایید اشتباه است" });

    if (!user.otpExpires || new Date(user.otpExpires).getTime() < Date.now())
      return res.status(400).json({ error: "کد تایید منقضی شده است" });

    // Clear OTP
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

    if (userId) {
      // 🔒 Double-check uniqueness before updating phone
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

      // ✅ Safe to update phone
      await fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation UpdatePhone($id: ID!, $phone: String!) {
              updateUser(where: { id: $id }, data: { phone: $phone }) {
                id
                phone
              }
            }
          `,
          variables: { id: userId, phone },
        }),
      });

      return res.status(200).json({ success: true, phone });
    }

    // Login flow: generate JWT
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

    setCookie("token", token, {
      req,
      res,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ user, token });
  } catch (err: any) {
    console.error("Server error in verify-otp:", err);
    return res.status(500).json({ error: err.message });
  }
}
