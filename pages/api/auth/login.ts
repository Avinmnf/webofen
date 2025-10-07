import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import { sendLoginSms } from "./loginSms";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation($email: String!, $password: String!) {
            authenticateUserWithJWT(email: $email, password: $password) {
              token
              user {
                id
                name
                email
                phone
                role { id name }
              }
            }
          }
        `,
        variables: { email, password },
      }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { token, user } = data.authenticateUserWithJWT;

    // 1️⃣ Set token cookie
    setCookie("token", token, {
      req,
      res,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // 2️⃣ Send login SMS if phone exists
    if (user.phone) {
      sendLoginSms({
        userId: user.id,
        userName: user.name,
        userPhone: user.phone,
      }).catch((err) => console.error("[LOGIN SMS] Failed:", err));
    } else {
      console.warn("[LOGIN SMS] User has no phone number, skipping SMS");
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
