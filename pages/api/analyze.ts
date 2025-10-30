import type { NextApiRequest, NextApiResponse } from "next";

const ANALYZER_URL = process.env.NEXT_PUBLIC_ANALYZE_URL || "http://localhost:4000";
const GRAPHQL_URL = process.env.GRAPHQL_URL || "http://localhost:3000/api/graphql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        // ---------- سعی می‌کنیم Analyzer را فراخوانی کنیم ----------
        try {
          const response = await fetch(`${ANALYZER_URL}/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
            signal: controller.signal,
          });

          clearTimeout(timeout);

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return res.status(response.status).json(data);
          } else {
            const text = await response.text();
            console.error("❌ Analyzer returned non-JSON:", text);
            throw new Error("Analyzer returned non-JSON");
          }
        } catch (err: any) {
          console.warn("⚠️ Analyzer not reachable, fetching last saved result from GraphQL", err.message);

          // ---------- fallback: دریافت آخرین تحلیل ذخیره شده ----------
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

          const contentType = graphqlResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const json = await graphqlResponse.json();
            if (json.errors) {
              console.error("❌ GraphQL returned errors:", json.errors);
              return res.status(500).json({ error: "GraphQL errors", details: json.errors });
            }

            const analyses = json.data.analyses;
            if (!analyses || analyses.length === 0) {
              return res.status(404).json({ error: "No analysis found in DB" });
            }

            const lastAnalysis = analyses[analyses.length - 1]; // آخرین رکورد
            return res.status(200).json(lastAnalysis);
          } else {
            const text = await graphqlResponse.text();
            console.error("❌ GraphQL returned non-JSON:", text);
            return res.status(500).json({ error: "GraphQL returned non-JSON", body: text });
          }
        }
      } catch (err: any) {
        console.error("❌ Failed POST to Analyzer or fallback:", err);
        return res.status(500).json({ error: "Failed to perform analysis", details: err.message });
      }
    }

    // ---------- GET: دریافت همه analyses ----------
    if (req.method === "GET") {
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

        const contentType = graphqlResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const json = await graphqlResponse.json();
          if (json.errors) {
            console.error("❌ GraphQL returned errors:", json.errors);
            return res.status(500).json({ error: "GraphQL errors", details: json.errors });
          }

          return res.status(200).json(json.data.analyses);
        } else {
          const text = await graphqlResponse.text();
          console.error("❌ GraphQL returned non-JSON:", text);
          return res.status(500).json({ error: "GraphQL returned non-JSON", body: text });
        }
      } catch (err: any) {
        console.error("❌ Failed GET from GraphQL:", err);
        return res.status(500).json({ error: "Failed to reach GraphQL", details: err.message });
      }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (err: any) {
    console.error("❌ Unexpected API error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
