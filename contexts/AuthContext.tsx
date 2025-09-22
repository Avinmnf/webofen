import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface Role { id: string; name: string; }
export interface User { id: string; name: string; email: string; phone?: string; role: Role; }

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithPhone: (phone: string, code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>; // اضافه کردن refreshUser
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
    refreshUser(); // mount شدن و بررسی لاگین از کوکی
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        await refreshUser(); // بعد از لاگین، اطلاعات کاربر را از /me بگیر
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
        await refreshUser(); // بعد از OTP، user از کوکی /me گرفته شود
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
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
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
