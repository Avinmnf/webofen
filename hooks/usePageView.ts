import { useEffect } from "react";

interface PageViewOptions {
  slug: string;
  title?: string;
}

export function usePageView({ slug, title }: PageViewOptions) {
  useEffect(() => {
    if (!slug) return;

    // Only call once per page load
    fetch("/api/proxy/page-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title }),
    }).catch((err) => {
      console.error("Failed to record page view:", err);
    });
  }, [slug, title]);
}
