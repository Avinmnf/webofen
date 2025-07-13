import { useState, useEffect } from 'react';

type Post = {
  id: string;
  title: string;
  slug: string;
  content?: any; // adjust type as needed
  imageUrl?: string;
  imageAlt?: string;
  description?: string;
  createdAt?: string;
  category?: { id: string; title: string };
  tags?: { name: string }[];
};

export function usePostBySlug(slug: string | null) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:3003/posts/${slug}`);
        if (!res.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await res.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}
