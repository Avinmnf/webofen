import type { NextApiRequest, NextApiResponse } from "next";

interface SendSmsParams {
  phones: string[];
  patternCode: string;
  variables?: Record<string, any>;
}

export async function sendSms({ phones, patternCode, variables }: SendSmsParams) {
  const username = process.env.NEXT_PUBLIC_FARAZSMS_USER || process.env.FARAZSMS_USER || "";
  const password = process.env.NEXT_PUBLIC_FARAZSMS_PASS || process.env.FARAZSMS_PASS || "";
  const from = process.env.NEXT_PUBLIC_FARAZSMS_FROM || process.env.FARAZSMS_FROM || "";

  if (!username || !password || !from) {
    console.error("[SMS] ❌ Missing FarazSMS credentials in .env");
    throw new Error("[SMS] Missing FarazSMS credentials");
  }

  if (!phones?.length) {
    console.warn("[SMS] ⚠️ No recipient phone numbers provided.");
    return null;
  }

  const results: Record<string, string | null> = {};

  for (const phone of phones) {
    const formattedPhone = phone.replace(/^0/, "98"); // normalize if needed
    const payload = {
      op: "pattern",
      user: username,
      pass: password,
      fromNum: from,
      toNum: formattedPhone,
      patternCode,
      inputData: [variables ?? {}],
    };

    try {
      const res = await fetch("http://ippanel.com/api/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const text = await res.text();
      console.log(`[SMS] ✅ Sent to ${formattedPhone}:`, text);
      results[formattedPhone] = text;
    } catch (err) {
      console.error(`[SMS] ❌ Error sending to ${formattedPhone}:`, err);
      results[formattedPhone] = null;
    }
  }

  return results;
}
