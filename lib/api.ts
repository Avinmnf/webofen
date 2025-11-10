const ANALYZE_URL = process.env.NEXT_PUBLIC_ANALYZE_URL || "http://localhost:4000";

export async function startAnalysis(url: string, name: string, phoneNumber: string) {
  const res = await fetch(`${ANALYZE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, userInfo: { name, phoneNumber } }),
  });
  return res.json();
}

export async function getAnalysis(id: string) {
  const res = await fetch(`${ANALYZE_URL}/analysis/${id}`);
  return res.json();
}
