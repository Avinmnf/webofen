const API_BASE = process.env.NEXT_PUBLIC_ANALYZE_URL || "http://localhost:4000";

export async function startAnalysis(url: string, name: string, phoneNumber: string) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, userInfo: { name, phoneNumber } }),
  });
  return res.json();
}

export async function getAnalysis(id: string) {
  const res = await fetch(`${API_BASE}/analysis/${id}`);
  return res.json();
}
