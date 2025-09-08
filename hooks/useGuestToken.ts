import { useState } from "react";
import { useEffect } from "react";
export function useGuestToken() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingToken = localStorage.getItem("guestToken");

    if (existingToken) {
      setToken(existingToken);
      setLoading(false);
      return;
    }

    async function fetchToken() {
      try {
        const res = await fetch("/api/proxy/guesttoken");
        if (!res.ok) throw new Error("Failed to fetch guest token");

        const data = await res.json();
        setToken(data.token);
        localStorage.setItem("guestToken", data.token);
      } catch (err) {
        console.error("Error fetching guest token:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, []);

  return { token, loading };
}
