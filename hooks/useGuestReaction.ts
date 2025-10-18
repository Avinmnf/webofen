// hooks/useGuestReaction.ts
import { useEffect, useState, useCallback } from "react";

export function getGuestId(): string {
  if (typeof window === "undefined") return "";
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
}

export type ReactionType = "like" | "dislike";

interface UseGuestReactionProps {
  postId: string;
  initialLikes?: number;
  initialDislikes?: number;
}

export function useGuestReaction({
  postId,
  initialLikes = 0,
  initialDislikes = 0,
}: UseGuestReactionProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [hasReacted, setHasReacted] = useState<ReactionType | null>(null);

  // Check localStorage for existing reaction
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(`reaction-${postId}`);
    if (stored === "like" || stored === "dislike") setHasReacted(stored);
  }, [postId]);

  const handleReaction = useCallback(
    async (type: ReactionType) => {
      if (hasReacted === type) return; // prevent duplicate reaction
      if (!postId) return;

      const guestId = getGuestId();
      try {
        const res = await fetch("/api/proxy/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: guestId,
            module: "post",
            targetId: postId,
            value: type === "like" ? 5 : 1,
          }),
        });

        if (!res.ok) throw new Error("Failed to save reaction");
        // Optimistic UI update
        if (type === "like") setLikes((prev) => prev + 1);
        else setDislikes((prev) => prev + 1);

        setHasReacted(type);
        localStorage.setItem(`reaction-${postId}`, type);
      } catch (err) {
        console.error(err);
      }
    },
    [hasReacted, postId]
  );

  return { likes, dislikes, hasReacted, handleReaction };
}
