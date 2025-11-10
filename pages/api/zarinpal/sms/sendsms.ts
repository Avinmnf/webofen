// pages/api/sms/smssend.ts
import type { NextApiRequest, NextApiResponse } from "next";

interface SendSmsParams {
  phones: string[];
  patternCode: string;
  variables?: Record<string, any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phones, patternCode, variables }: SendSmsParams = req.body;

    const username = process.env.FARAZSMS_USER || "";
    const password = process.env.FARAZSMS_PASS || "";
    const from = process.env.FARAZSMS_FROM || "";

    if (!username || !password || !from) {
      return res.status(500).json({ error: "SMS credentials missing" });
    }

    const results: Record<string, string | null> = {};

    for (const phone of phones) {
      const payload = {
        op: "pattern",
        user: username,
        pass: password,
        fromNum: from,
        toNum: phone,
        patternCode,
        inputData: [variables ?? {}],
      };

      try {
        const smsRes = await fetch("http://ippanel.com/api/select", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const text = await smsRes.text();
        console.log(`[SMS] Sent to ${phone}:`, text);
        results[phone] = text;
      } catch (err) {
        console.error(`[SMS] Error sending to ${phone}:`, err);
        results[phone] = null;
      }
    }

    return res.status(200).json({ results });
  } catch (err) {
    console.error("[SMS] ❌ Error in sendSms API:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
