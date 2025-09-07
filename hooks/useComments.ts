// hooks/useComments.ts
import { useState, useEffect } from "react";

export interface Comment {
  id: string;
  fullName: string;
  subject?: string;
  body: string;
  createdAt: string;
  parent?: { id: string };
  children?: Comment[];
}

interface UseCommentsParams {
  contentType: "post" | "product";
  pageSlug: string;
}

export const useComments = ({ contentType, pageSlug }: UseCommentsParams) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contentType || !pageSlug) return;

    const fetchComments = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/proxy/comments?contentType=${encodeURIComponent(contentType)}&pageSlug=${encodeURIComponent(pageSlug)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch comments");
        }

        setComments(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [contentType, pageSlug]);

  return { comments, loading, error };
};
