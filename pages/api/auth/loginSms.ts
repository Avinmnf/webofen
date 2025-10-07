import { sendSms } from "./sendSms";

function formatPhoneNumber(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("989") && digits.length === 12) return digits;
  if (digits.startsWith("09") && digits.length === 11) return "98" + digits.slice(1);
  if (digits.startsWith("9") && digits.length === 10) return "98" + digits;
  console.warn(`[LOGIN SMS] ⚠️ Unrecognized phone format: ${phone}`);
  return null;
}

export async function sendLoginSms({
  userId,
  userName,
  userPhone,
}: {
  userId: string;
  userName: string;
  userPhone: string;
}) {
  console.log("[LOGIN SMS] Starting sendLoginSms...", { userId, userName, userPhone });

  const formattedPhone = formatPhoneNumber(userPhone);
  if (!formattedPhone) {
    console.warn("[LOGIN SMS] ⚠️ Phone is empty or invalid");
    return;
  }

  try {
    const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/api/graphql";

    // 1. Get the login_user SMS event
    const eventQuery = `
      query {
        smsEvents(where: { value: { equals: "login_user" }, isActive: { equals: true } }) {
          id
          patternCode
          variables
        }
      }
    `;

    const eventRes = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: eventQuery }),
    });

    const eventJson = await eventRes.json();
    const smsEvent = eventJson.data?.smsEvents?.[0];
    if (!smsEvent) {
      console.warn("[LOGIN SMS] No active 'login_user' SMS event found");
      return;
    }

    // 2. Prepare variables
    const smsVars: Record<string, string> = {};
    for (const varName of smsEvent.variables || []) {
      smsVars[varName] = varName === "name" ? userName : "";
    }

    // 3. Send SMS
    const smsResults = await sendSms({
      phones: [formattedPhone],
      patternCode: smsEvent.patternCode,
      variables: smsVars,
    });
    console.log("[LOGIN SMS] SMS sent result:", smsResults);

    // 4. Log SMS to backend via GraphQL
    const logMutation = `
      mutation ($data: SmsLogCreateInput!) {
        createSmsLog(data: $data) { id }
      }
    `;

    const logRes = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: logMutation,
        variables: {
          data: {
            user: { connect: { id: userId } },
            event: { connect: { id: smsEvent.id } },
            eventType: "login_user",
            statusValue: smsResults?.[formattedPhone]?.includes("Sent") ? "ارسال شد" : "ناموفق",
            message: `Login SMS sent to user: ${smsResults?.[formattedPhone]}`,
          },
        },
      }),
    });

    const logJson = await logRes.json();
    console.log("[LOGIN SMS] SMS logged:", logJson);

    console.log(`[LOGIN SMS] ✅ SMS sent and logged for ${formattedPhone}`);
  } catch (err) {
    console.error("[LOGIN SMS] ❌ Error sending login SMS:", err);
  }
}
