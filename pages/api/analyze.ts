// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from "next";

const ANALYZER_URL = process.env.ANALYZE_URL|| "http://localhost:4000";
const GRAPHQL_URL = process.env.GRAPHQL_URL || "http://localhost:3000/api/graphql";

interface AnalysisResult {
  id: string;
  url: string;
  status: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  createdAt: string;
  result?: any;
  privateData?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      return await handlePost(req, res);
    }

    if (req.method === "GET") {
      return await handleGet(req, res);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (err: any) {
    console.error("❌ Unexpected API error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { url, options } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 130000);

    console.log("🌐 Starting analysis for URL:", url);

    // ارسال درخواست به سرور آنالیز
    const response = await fetch(`${ANALYZER_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, options }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Analyzer failed with status: ${response.status}`);
    }


    const analyzerResult = await response.json();

    // ذخیره آنالیز در GraphQL و دریافت ID
    const savedAnalysis = await saveAnalysisToGraphQL(analyzerResult);
    
    if (!savedAnalysis) {
      throw new Error("Failed to save analysis to database");
    }

    console.log("✅ Analysis completed and saved with ID:", savedAnalysis.id);

    // بازگشت نتیجه با ID
    const result: AnalysisResult = {
      id: savedAnalysis.id,
      url: savedAnalysis.url,
      status: "completed",
      performance: Math.round((analyzerResult.scores?.performance || 0) * 100),
      accessibility: Math.round((analyzerResult.scores?.accessibility || 0) * 100),
      bestPractices: Math.round((analyzerResult.scores?.bestPractices || 0) * 100),
      seo: Math.round((analyzerResult.scores?.seo || 0) * 100),
      createdAt: new Date().toISOString(),
      result: analyzerResult,
      privateData: analyzerResult.issues || [],
    };

    return res.status(200).json(result);

  } catch (err: any) {
    console.error("❌ Analysis failed:", err.message);

    // Fallback: دریافت آخرین آنالیز از دیتابیس
    try {
      console.warn("⚠️ Using fallback - fetching last analysis from database");
      
      const lastAnalysis = await getLastAnalysisFromGraphQL();
      if (lastAnalysis) {
        return res.status(200).json(lastAnalysis);
      }

      throw new Error("No fallback analysis available");
    } catch (fallbackError) {
      console.error("❌ Fallback also failed:", fallbackError);
      return res.status(500).json({ 
        error: "Analysis failed and no fallback available", 
        details: err.message 
      });
    }
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const query = `
      query {
        analyses {
          id
          url
          status
          performance
          accessibility
          bestPractices
          seo
          createdAt
          result
          privateData
        }
      }
    `;

    const graphqlResponse = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!graphqlResponse.ok) {
      throw new Error(`GraphQL request failed: ${graphqlResponse.status}`);
    }

    const json = await graphqlResponse.json();

    if (json.errors) {
      console.error("❌ GraphQL errors:", json.errors);
      return res.status(500).json({ error: "GraphQL errors", details: json.errors });
    }

    const analyses: AnalysisResult[] = json.data?.analyses || [];

    // اگر ID مشخص شده، آنالیز مربوطه را پیدا کن
    if (id && id !== "undefined" && id !== "null") {
      const analysis = analyses.find(a => a.id === id);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }
      return res.status(200).json(analysis);
    }

    // بازگشت تمام آنالیزها
    return res.status(200).json(analyses);

  } catch (err: any) {
    console.error("❌ Failed to fetch analyses:", err);
    return res.status(500).json({ error: "Failed to fetch analyses", details: err.message });
  }
}

async function saveAnalysisToGraphQL(result: any): Promise<any> {
  const mutation = `
    mutation CreateAnalysis($data: AnalysisCreateInput!) {
      createAnalysis(data: $data) {
        id
        url
        status
        performance
        accessibility
        bestPractices
        seo
        createdAt
        result
        privateData
      }
    }
  `;

  const variables = {
    data: {
      url: result.url,
      status: "completed",
      performance: Math.round((result.scores?.performance || 0) * 100),
      accessibility: Math.round((result.scores?.accessibility || 0) * 100),
      bestPractices: Math.round((result.scores?.bestPractices || 0) * 100),
      seo: Math.round((result.scores?.seo || 0) * 100),
      result: result,
      privateData: result.issues || [],
    },
  };

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error("❌ Failed to save analysis to GraphQL:", data.errors);
      return null;
    }

    return data.data.createAnalysis;
  } catch (err) {
    console.error("❌ GraphQL request failed:", err);
    return null;
  }
}

async function getLastAnalysisFromGraphQL(): Promise<AnalysisResult | null> {
  const query = `
    query {
      analyses {
        id
        url
        status
        performance
        accessibility
        bestPractices
        seo
        createdAt
        result
        privateData
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    if (data.errors || !data.data?.analyses || data.data.analyses.length === 0) {
      return null;
    }

    // بازگشت آخرین آنالیز (جدیدترین)
    const analyses = data.data.analyses as AnalysisResult[];
    return analyses.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  } catch (err) {
    console.error("❌ Failed to fetch last analysis:", err);
    return null;
  }
}