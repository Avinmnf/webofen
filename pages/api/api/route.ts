import { NextRequest, NextResponse } from "next/server";

const ANALYZE_URL =
  process.env.NEXT_PUBLIC_ANALYZE_URL || "http://localhost:4000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 /api/analyze request body:", body);

    if (!body?.url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(`${ANALYZE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Analyzer API returned error:", errorText);

      return NextResponse.json(
        { error: "Analyzer API returned error", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Analyzer API success:", data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔥 Error in /api/analyze:", error);
    return NextResponse.json(
      { error: "Failed to connect to analyzer service", details: error.message },
      { status: 500 }
    );
  }
}
