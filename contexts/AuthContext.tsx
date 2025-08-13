'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Fetch current user from backend
  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:3003/me', {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Not authenticated');

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    }
  };

  // Automatically fetch user on mount
  useEffect(() => {
    fetchUser();

    // Listen to global login/logout events
    const handleLogin = () => fetchUser();
    const handleLogout = () => setUser(null);

    window.addEventListener('user-logged-in', handleLogin);
    window.addEventListener('user-logged-out', handleLogout);

    return () => {
      window.removeEventListener('user-logged-in', handleLogin);
      window.removeEventListener('user-logged-out', handleLogout);
    };
  }, []);

  // Manual refresh if needed
  const refreshUser = async () => await fetchUser();

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:3003/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid login');

      const data = await res.json();
      setUser(data.user);

      // Notify other components
      window.dispatchEvent(new Event('user-logged-in'));

      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch('http://localhost:3003/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    // Clear localStorage
    localStorage.removeItem('cartBackup');
    localStorage.removeItem('customerInfo');

    setUser(null);

    // Notify other components
    window.dispatchEvent(new Event('user-logged-out'));

    // Optionally redirect
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
