import { useEffect } from "react";

interface PageViewOptions {
  slug: string;
  title?: string;
  type?: "article" | "product";
}

export function usePageView({ slug, title, type }: PageViewOptions) {
  useEffect(() => {
    if (!slug) return;

    fetch("/api/proxy/pages-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, source: "web", type }),
    }).catch((err) => console.error("Failed to record page view:", err));

    console.log("Page view recorded:", slug, title, type);
  }, [slug, title, type]);
}
