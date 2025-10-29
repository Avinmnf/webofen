import type { NextApiRequest, NextApiResponse } from "next";

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/api/graphql";
const ANALYZE_URL =
  process.env.NEXT_PUBLIC_ANALYZE_URL || "http://localhost:4000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url, id } = req.method === "GET" ? req.query : req.body;

  // ================= GET =================
  if (req.method === "GET") {
    if (!id && !url)
      return res.status(400).json({ message: "ID یا URL الزامی است." });

    const record = id
      ? await findAnalysisById(id as string)
      : await findAnalysisByUrl(url as string);

    if (!record)
      return res.status(404).json({ message: "رکورد پیدا نشد." });

    return res.status(200).json({
      url: record.url,
      status: record.status,
      scores: {
        performance: record.performance || 0,
        accessibility: record.accessibility || 0,
        bestPractices: record.bestPractices || 0,
        seo: record.seo || 0,
      },
      metrics: record.result?.metrics || {},
      issues: record.result?.issues || [],
      title: record.result?.title || "",
      analysisId: record.id,
    });
  }

  // ================= POST =================
  if (req.method === "POST") {
    if (!url) return res.status(400).json({ message: "URL الزامی است." });

    const normalized = normalizeAndValidateUrl(url);
    if (!normalized.isValid)
      return res.status(400).json({ message: `فرمت URL نامعتبر است: ${url}` });
    const finalUrl = normalized.url;

    // بررسی رکورد
    const existing = await findAnalysisByUrl(finalUrl);
    const analysisId = existing
      ? existing.id
      : await upsertAnalysis(finalUrl);

    // اجرای مستقیم آنالیز
    await updateAnalysisStatus(analysisId, "running");
    const analyzeRes = await fetch(`${ANALYZE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: finalUrl }),
    });

    if (!analyzeRes.ok) {
      const errorText = await analyzeRes.text();
      await updateAnalysisStatus(analysisId, "failed");
      return res.status(500).json({ message: "خطای آنالیز", errorText });
    }

    const result = await analyzeRes.json();
    const scores = processScores(result.scores || {});
    await updateAnalysisWithResults(analysisId, result, scores);
    await updateAnalysisStatus(analysisId, "completed");

    return res.status(200).json({
      analysisId,
      status: "completed",
      ...result,
    });
  }

  return res.status(405).json({ message: "Method not allowed" });

  // ================= Helper Functions =================

  async function findAnalysisById(id: string) {
    const query = `
      query ($id: ID!) {
        analyses(where: { id: { equals: $id } }) {
          id url status result performance accessibility bestPractices seo
        }
      }`;
    const r = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { id } }),
    });
    const data = await r.json();
    return data.data?.analyses?.[0] || null;
  }

  async function findAnalysisByUrl(url: string) {
    const query = `
      query ($url: String!) {
        analyses(where: { url: { equals: $url } }) {
          id url status result performance accessibility bestPractices seo
        }
      }`;
    const r = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { url } }),
    });
    const data = await r.json();
    return data.data?.analyses?.[0] || null;
  }

  async function upsertAnalysis(url: string) {
    const mutation = `
      mutation CreateAnalysis($url: String!) {
        createAnalysis(data: { url: $url, status: "pending" }) { id }
      }`;
    const r = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation, variables: { url } }),
    });
    const data = await r.json();
    return data.data.createAnalysis.id;
  }

  async function updateAnalysisStatus(id: string, status: string) {
    const mutation = `
      mutation UpdateStatus($id: ID!, $status: String!) {
        updateAnalysis(where: { id: $id }, data: { status: $status }) { id status }
      }`;
    await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation, variables: { id, status } }),
    });
  }

  async function updateAnalysisWithResults(
    id: string,
    result: any,
    scores: Record<string, number>
  ) {
    const mutation = `
      mutation UpdateResults(
        $id: ID!,
        $status: String!,
        $result: JSON!,
        $performance: Float!,
        $accessibility: Float!,
        $bestPractices: Float!,
        $seo: Float!
      ) {
        updateAnalysis(
          where: { id: $id },
          data: {
            status: $status,
            result: $result,
            performance: $performance,
            accessibility: $accessibility,
            bestPractices: $bestPractices,
            seo: $seo
          }
        ) { id }
      }`;
    await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: mutation,
        variables: { id, status: "completed", result, ...scores },
      }),
    });
  }

  function normalizeAndValidateUrl(input: string): { isValid: boolean; url: string } {
    try {
      let url = input.trim();
      if (!url.includes("://")) url = "https://" + url;
      const parsed = new URL(url);
      const normalized = `https://${parsed.hostname.replace(/^www\./, "")}${parsed.pathname}`;
      return { isValid: true, url: normalized };
    } catch {
      return { isValid: false, url: "" };
    }
  }

  function processScores(scores: any): Record<string, number> {
    return {
      performance: scores?.performance || 0,
      accessibility: scores?.accessibility || 0,
      bestPractices: scores?.bestPractices || 0,
      seo: scores?.seo || 0,
    };
  }
}
