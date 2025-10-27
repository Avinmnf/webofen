import type { NextApiRequest, NextApiResponse } from "next";

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/api/graphql";
const ANALYZE_URL = process.env.ANALYZE_URL || "http://localhost:4000";

const processingUrls = new Set<string>();

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

    const resultJson = record.result || {};
    const scores = {
      performance: record.performance || 0,
      accessibility: record.accessibility || 0,
      bestPractices: record.bestPractices || 0,
      seo: record.seo || 0,
    };

    return res.status(200).json({
      url: record.url,
      status: record.status,
      scores,
      metrics: resultJson.metrics || {},
      issues: resultJson.issues || [],
      title: resultJson.title || "",
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

    // بررسی اگر قبلاً آنالیز کامل شده
    const existing = await findAnalysisByUrl(finalUrl);
    if (existing && existing.status === "completed") {
      return res.status(200).json({
        ...existing.result,
        analysisId: existing.id,
        status: existing.status,
      });
    }

    // بررسی اگر در حال پردازش است → برگرداندن pending
    const analysisId = existing ? existing.id : await upsertAnalysis(finalUrl);
    if (processingUrls.has(finalUrl)) {
      return res.status(200).json({ analysisId, status: "pending" });
    }

    processingUrls.add(finalUrl);

    // اجرای آنالیز در پس‌زمینه
    (async () => {
      try {
        await updateAnalysisStatus(analysisId, "running");

        const analyzeRes = await fetch(`${ANALYZE_URL}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: finalUrl }),
        });

        if (!analyzeRes.ok) {
          const errorText = await analyzeRes.text();
          await updateAnalysisStatus(analysisId, "failed");
          console.error("خطای آنالیز:", errorText);
          return;
        }

        const result = await analyzeRes.json();
        const scores = processScores(result.scores || {});
        await updateAnalysisWithResults(analysisId, result, scores);
        await updateAnalysisStatus(analysisId, "completed");
      } catch (err: any) {
        console.error("❌ خطا در آنالیز پس‌زمینه:", err);
        await updateAnalysisStatus(analysisId, "failed");
      } finally {
        processingUrls.delete(finalUrl);
      }
    })();

    return res.status(200).json({ analysisId, status: "pending" });
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
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { id } }),
    });
    const data = await res.json();
    return data.data?.analyses?.[0] || null;
  }

  async function findAnalysisByUrl(url: string) {
    const query = `
      query ($url: String!) {
        analyses(where: { url: { equals: $url } }) {
          id url status result performance accessibility bestPractices seo
        }
      }`;
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { url } }),
    });
    const data = await res.json();
    return data.data?.analyses?.[0] || null;
  }

  async function upsertAnalysis(url: string) {
    const existing = await findAnalysisByUrl(url);
    if (existing) return existing.id;

    const mutation = `
      mutation CreateAnalysis($url: String!) {
        createAnalysis(data: { url: $url, status: "pending" }) { id }
      }`;
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation, variables: { url } }),
    });
    const data = await res.json();
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
      body: JSON.stringify({ query: mutation, variables: { id, status: "completed", result, ...scores } }),
    });
  }

  function normalizeAndValidateUrl(input: string): { isValid: boolean; url: string } {
    try {
      let url = input.trim();
      if (!url.includes("://")) url = "https://" + url;
      const parsed = new URL(url);
      const normalized = `https://${parsed.hostname.replace(/^www\./, "")}`;
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
