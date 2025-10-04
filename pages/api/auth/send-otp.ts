import type { NextApiRequest, NextApiResponse } from "next";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone is required" });

  const code = generateOTP();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 دقیقه

  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (!graphqlUrl) return res.status(500).json({ error: "GRAPHQL URL missing in env" });

  try {
    // 1. پیدا کردن کاربر
    const findUserRes = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query FindUser($phone: String!) {
            users(where: { phone: { equals: $phone } }) {
              id
            }
          }
        `,
        variables: { phone },
      }),
    });

    const findUserJson = await findUserRes.json();
    console.log("FindUser response:", JSON.stringify(findUserJson, null, 2));

    let userId = findUserJson?.data?.users?.[0]?.id;

    if (userId) {
      // 2. آپدیت OTP و زمان انقضا در دیتابیس
      const updateRes = await fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation UpdateUser($id: ID!, $otpCode: String, $otpExpires: DateTime) {
              updateUser(
                where: { id: $id }
                data: { otpCode: $otpCode, otpExpires: $otpExpires }
              ) {
                id
                otpCode
                otpExpires
              }
            }
          `,
          variables: { id: userId, otpCode: code, otpExpires: expires.toISOString() },
        }),
      });

      const updateJson = await updateRes.json();
      console.log("UpdateUser response:", JSON.stringify(updateJson, null, 2));
    } else {
      // 3. ایجاد کاربر جدید با OTP و مقادیر پیش‌فرض برای فیلدهای اجباری
      const createRes = await fetch(graphqlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation CreateUser($phone: String!, $otpCode: String!, $otpExpires: DateTime!) {
              createUser(data: {
                phone: $phone,
                otpCode: $otpCode,
                otpExpires: $otpExpires,
                name: "Guest",
                email: $phone + "@guest.com",
                password: "guest1234"
              }) {
                id
                otpCode
                otpExpires
              }
            }
          `,
          variables: { phone, otpCode: code, otpExpires: expires.toISOString() },
        }),
      });

      const createJson = await createRes.json();
      console.log("CreateUser response:", JSON.stringify(createJson, null, 2));
      userId = createJson?.data?.createUser?.id;
    }

    console.log("Final userId:", userId, "OTP code:", code);

    // 4. ارسال SMS (FarazSMS)
    const username = process.env.FARAZSMS_USER || "";
    const password = process.env.FARAZSMS_PASS || "";
    const from = process.env.FARAZSMS_FROM || "";
    const pattern = process.env.FARAZSMS_PATTERN || "";

    if (!username || !password || !pattern)
      return res.status(500).json({ error: "FARAZSMS credentials missing" });

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

    const smsData = await smsRes.json();

    if (smsRes.ok) {
      return res.status(200).json({ success: true, otpSentTo: phone, userId, code });
    } else {
      return res.status(500).json({ error: smsData });
    }
  } catch (err: any) {
    console.error("Server error in send-otp:", err);
    return res.status(500).json({ error: err.message });
  }
}