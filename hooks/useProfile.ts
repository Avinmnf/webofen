// hooks/useProfile.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  address?: string;
  birthDate?: string;
  imageUrl?: string;
  role: { id: string; name: string };
  createdAt: string;
};

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/profile", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role.name,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا در دریافت پروفایل");
      }
      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(
    async (updateData: Partial<UserProfile>) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
            "x-user-role": user.role.name,
          },
          body: JSON.stringify(updateData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "خطا در بروزرسانی پروفایل");
        }
        const result = await res.json();
        setProfile(result.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
};
