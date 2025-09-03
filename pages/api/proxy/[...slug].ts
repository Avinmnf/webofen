// pages/api/proxy/[...slug].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { generateApiKey } from "@/lib/apiKey";

const SHARED_SECRET = process.env.API_SECRET_NAME || "this-is-a-very-random-secret";
const apiUrl = process.env.NEXT_PUBLIC_CMS_API;
if (!apiUrl) throw new Error("NEXT_PUBLIC_CMS_API env variable not set");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.slug) return res.status(400).json({ error: "Missing slug parameter" });

  const slug = Array.isArray(req.query.slug) ? req.query.slug.join("/") : req.query.slug!;
  const { slug: _removed, ...restQuery } = req.query;

  const queryParams = new URLSearchParams();
  Object.entries(restQuery).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((v) => queryParams.append(key, v));
    else if (value !== undefined) queryParams.append(key, value as string);
  });

  const queryString = queryParams.toString();
  const targetUrl = `${apiUrl}/${slug}${queryString ? "?" + queryString : ""}`;

  try {
    // copy headers from the client request
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === "string") headers[key] = value;
      else if (Array.isArray(value)) headers[key] = value.join(", ");
    }

    // attach API key
    headers["x-api-key"] = generateApiKey(SHARED_SECRET);

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      credentials: "include",
    };

    if (["POST", "PUT", "PATCH"].includes(req.method || "") && Object.keys(req.body || {}).length > 0) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const proxyRes = await fetch(targetUrl, fetchOptions);

    // forward all Set-Cookie headers from the API
// forward Set-Cookie header from API (Web fetch)
const setCookieHeader = proxyRes.headers.get("set-cookie");
if (setCookieHeader) {
  res.setHeader("Set-Cookie", setCookieHeader);
}


    // parse JSON safely
    let data;
    try {
      data = await proxyRes.json();
    } catch {
      data = { message: "No JSON response from backend" };
    }

    res.status(proxyRes.status).json(data);
  } catch (err: any) {
    console.error("Proxy error:", err);
    console.error("Target URL:", targetUrl);

    // distinguish network-level errors from backend response errors
    if (err.type === "system" || err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      return res.status(502).json({
        error: "Cannot reach backend server",
        details: err.message,
        targetUrl,
      });
    }

    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
