// hooks/useTickets.ts
import { useState, useEffect } from "react";

export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  user?: { id: string; name: string };
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  replies: Reply[];
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/proxy/tickets");
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      setTickets(data.tickets);
    } catch (err: any) {
      setError(err.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }) => {
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
    });
    if (!res.ok) throw new Error("Failed to create ticket");
    await fetchTickets();
  };

  const createReply = async (ticketId: string, content: string) => {
    const res = await fetch(`/api/proxy/tickets/${ticketId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to create reply");
    const data = await res.json();

    // ✅ Update local state so reply appears instantly
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, replies: [...t.replies, data.reply] } : t
      )
    );
    return data.reply;
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return { tickets, loading, error, createTicket, createReply, refreshTickets: fetchTickets };
}
