import { useEffect, useState } from "react";

export type PageView = {
  id: string;
  url: string;
  title: string;
  viewedAt: string;
};

export type PageViewsData = {
  pageViews: PageView[];
  counts: Record<string, number>;
};

export default function usePageViews() {
  const [data, setData] = useState<PageViewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageViews = async () => {
      setLoading(true);
      setError(null);
      try {
        const pageViews: PageView[] = await fetch("/api/proxy/get-pages-views").then(res => res.json());

        // Compute counts per URL
        const counts: Record<string, number> = {};
        pageViews.forEach((pv) => {
          counts[pv.url] = (counts[pv.url] || 0) + 1;
        });

        setData({ pageViews, counts });
      } catch (err: any) {
        setError(err.message || "Failed to fetch page views");
      } finally {
        setLoading(false);
      }
    };

    fetchPageViews();
  }, []);

  const getCount = (url: string) => {
    return data?.counts[url] || 0;
  };

  return { data, loading, error, getCount };
}
