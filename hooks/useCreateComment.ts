// hooks/useCreateComment.ts
import { useState, useCallback } from "react";

interface CreateCommentParams {
  fullName: string;
  email: string;
  subject?: string;
  body: string;
  contentType: "post" | "product";
  pageSlug: string;
  parentId?: string;
  productId?: string;
}

interface CreateCommentResponse {
  id: string;
  fullName: string;
  pageSlug: string;
  parent?: { id: string };
  orderItem?: { id: string };
}

export const useCreateComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<CreateCommentResponse | null>(null);

  const createComment = useCallback(
    async (data: CreateCommentParams) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/proxy/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // send cookies for auth
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to create comment");
        }

        setComment(result.comment);
        setLoading(false);
        return result.comment;
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setLoading(false);
        return null;
      }
    },
    []
  );

  return { createComment, loading, error, comment };
};
