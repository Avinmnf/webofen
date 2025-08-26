import { useState, useEffect } from 'react';

type Post = {
  id: string;
  title: string;
  slug: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  description?: string;
  createdAt?: string;
  category?: { id: string; title: string };
  tags?: { name: string }[];
    ratings?: { value: number }[];
  _ratingsMeta?: { count: number };
};

export function usePostBySlug(slug?: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    // TypeScript now knows slug is string here
    const safeSlug = encodeURIComponent(slug);

    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/proxy/postbyslug/${safeSlug}`, {
          method: "GET",
        });

        if (!res.ok) throw new Error(`Failed to fetch post (status ${res.status})`);
        const data = await res.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}