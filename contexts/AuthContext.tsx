import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export interface Role { id: string; name: string; }
export interface User { id: string; name: string; email: string; phone?: string; role: Role; }

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithPhone: (phone: string, code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps { children: ReactNode; }

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!user;
  const router = useRouter();

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        await refreshUser();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const loginWithPhone = async (phone: string, code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      if (res.ok) {
        await refreshUser();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Phone login failed:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      // پاک کردن کوکی سمت کلاینت
      deleteCookie('token', { path: '/' });

      // درخواست به بک‌اند
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });

      // خالی کردن وضعیت کاربر
      setUser(null);

      // ریدایرکت به لاگین
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn, login, loginWithPhone, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
