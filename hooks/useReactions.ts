// hooks/useReactions.ts
import { useEffect, useState } from "react";

// Create guest ID utility
export function getGuestId(): string {
  if (typeof window === 'undefined') {
    return 'temp-guest-id';
  }
  
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
}

export function useReactions(module: string, targetId: string) {
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [hasReacted, setHasReacted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch reaction counts and user's reaction
  const fetchReactions = async () => {
    try {
      setError(null);
      const guestId = getGuestId();
      console.log("🔄 Fetching reactions for:", { module, targetId, guestId });
      
      const res = await fetch(`/api/proxy/reactions-get/${module}/${targetId}?guestId=${guestId}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("📥 Fetched reaction data:", data);
      
      // Handle response whether it has success flag or not
      if (data.success !== false && data.counts !== undefined) {
        setReactionCounts(data.counts || {});
        setHasReacted(data.userReaction || null);
      } else {
        setError(data.error || "Failed to fetch reactions");
      }
    } catch (err) {
      console.error("❌ Failed to fetch reactions:", err);
      setError("Failed to load reactions");
    }
  };

  // ✅ Submit a new reaction
  const handleReaction = async (value: "like" | "dislike") => {
    if (hasReacted) {
      throw new Error("Already reacted");
    }

    try {
      setLoading(true);
      setError(null);
      const guestId = getGuestId();
      
      console.log("📤 Sending reaction:", { module, targetId, value, guestId });
      
      const res = await fetch(`/api/proxy/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          module, 
          targetId, 
          value, 
          guestId 
        }),
      });
      
      const data = await res.json();
      console.log("📨 Reaction response:", data);
      
      if (data.success) {
        await fetchReactions(); // Refresh counts
        return true;
      } else {
        throw new Error(data.error || "Reaction save failed");
      }
    } catch (err) {
      console.error("❌ Error saving reaction:", err);
      setError(err instanceof Error ? err.message : "Failed to save reaction");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (module && targetId) {
      fetchReactions();
    }
  }, [module, targetId]);

  return { 
    reactionCounts, 
    handleReaction, 
    loading, 
    hasReacted,
    error,
    refreshReactions: fetchReactions 
  };
}