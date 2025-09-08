// contexts/GuestTokenContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type GuestContextType = {
  token: string | null;
  loading: boolean;
};

const GuestTokenContext = createContext<GuestContextType>({ token: null, loading: true });

export const GuestTokenProvider = ({ children }: { children: ReactNode }) => {
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
        const res = await fetch("/api/proxy/guesttoken"); // calls Express server via proxy
        if (!res.ok) throw new Error("Failed to fetch guest token");
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem("guestToken", data.token);
        // optional: set cookie for server-side requests
        document.cookie = `guestToken=${data.token}; path=/; max-age=${2 * 24 * 60 * 60}`;
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, []);

  return (
    <GuestTokenContext.Provider value={{ token, loading }}>
      {children}
    </GuestTokenContext.Provider>
  );
};

export const useGuestToken = () => useContext(GuestTokenContext);
