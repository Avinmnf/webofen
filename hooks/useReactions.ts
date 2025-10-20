import { useState, useEffect, useCallback, useMemo } from "react";

interface Reaction {
  id: string;
  value: number;
  createdAt: string;
}

interface UseReactionsReturn {
  reactions: Reaction[];
  reactionCounts: Record<number, number>;
  totalCount: number;
  loading: boolean;
  error: string | null;
  handleReaction: (value: number) => void; // just update counts locally
  refetch: () => void;
}

export function useReactions(module: string, targetId: string): UseReactionsReturn {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReactions = useCallback(async () => {
    if (!module || !targetId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/proxy/getreactions?module=${module}&targetId=${targetId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch reactions");
      setReactions(data.reactions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [module, targetId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  // group counts dynamically
  const reactionCounts = useMemo(() => {
    return reactions.reduce((acc, r) => {
      acc[r.value] = (acc[r.value] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }, [reactions]);

  const totalCount = reactions.length;

  // handle reaction: just update local state for UI
  const handleReaction = (value: number) => {
    // increment the count locally
    setReactions(prev => [...prev, { id: Date.now().toString(), value, createdAt: new Date().toISOString() }]);

  };

  return { reactions, reactionCounts, totalCount, loading, error, handleReaction, refetch: fetchReactions };
}
