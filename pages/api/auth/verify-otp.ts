import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { sendLoginSms } from "./loginSms";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("[VERIFY OTP] Request received", { body: req.body });

  if (req.method !== "POST") {
    console.log("[VERIFY OTP] Method not allowed");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, code } = req.body;
  if (!phone || !code) {
    console.log("[VERIFY OTP] Missing phone or code");
    return res.status(400).json({ error: "Phone and code are required" });
  }

  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  const JWT_SECRET = process.env.AUTH_SECRET!;
  if (!graphqlUrl || !JWT_SECRET) {
    console.error("[VERIFY OTP] GRAPHQL_URL or JWT_SECRET missing");
    return res.status(500).json({ error: "GRAPHQL_URL or JWT_SECRET missing in env" });
  }

  try {
    // 1. Find user by phone
    console.log("[VERIFY OTP] Fetching user from GraphQL");
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
    console.log("[VERIFY OTP] GraphQL user response:", userJson);

    const user = userJson.data?.users?.[0];
    if (!user) {
      console.log("[VERIFY OTP] User not found");
      return res.status(400).json({ error: "کاربری با این شماره یافت نشد" });
    }

    // 2. Check OTP
    console.log("[VERIFY OTP] Checking OTP", { userOtp: user.otpCode, inputCode: code });
    if (String(user.otpCode) !== String(code)) {
      console.log("[VERIFY OTP] OTP mismatch");
      return res.status(400).json({ error: "کد تایید اشتباه است" });
    }

    if (!user.otpExpires || new Date(user.otpExpires).getTime() < Date.now()) {
      console.log("[VERIFY OTP] OTP expired");
      return res.status(400).json({ error: "کد تایید منقضی شده است" });
    }

    // 3. Clear OTP
    console.log("[VERIFY OTP] Clearing OTP in DB");
    const clearRes = await fetch(graphqlUrl, {
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
    const clearJson = await clearRes.json();
    console.log("[VERIFY OTP] OTP cleared response:", clearJson);

    // 4. Create JWT
    console.log("[VERIFY OTP] Generating JWT");
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

    // 5. Set cookie
    console.log("[VERIFY OTP] Setting token cookie");
    setCookie("token", token, {
      req,
      res,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // 6. Send login SMS
    console.log("[VERIFY OTP] Sending login SMS");
    await sendLoginSms({
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
    });

    console.log("[VERIFY OTP] Login success, returning user and token");
    return res.status(200).json({ user, token });
  } catch (err: any) {
    console.error("[VERIFY OTP] Server error:", err);
    return res.status(500).json({ error: err.message });
  }
}
