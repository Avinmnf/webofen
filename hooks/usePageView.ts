import { useEffect, useRef } from "react";

interface PageViewOptions {
  slug: string;
  title?: string;
  type?: "article" | "product";
}

export function usePageView({ slug, title, type }: PageViewOptions) {
  const hasCounted = useRef(false);

  useEffect(() => {
    if (!slug || hasCounted.current) return;

    fetch("/api/proxy/pages-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, source: "web", type }),
    }).catch((err) => console.error("Failed to record page view:", err));

    console.log("Page view recorded:", slug, title, type);

    hasCounted.current = true; // mark as counted
  }, [slug, title, type]);
}
