// pages/login.tsx
import React, { useState, FormEvent } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role?: {
    id: string;
    name: string;
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3003/auth/login', {
        method: 'POST',
        credentials: 'include', // مهم برای ارسال و دریافت کوکی
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err: unknown) {
      // چون err از نوع unknown هست، باید اینطوری چک کنیم
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return (
      <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
        <h2>خوش آمدید، {user.name}!</h2>
        <p>ایمیل شما: {user.email}</p>
      </div>
    );
  }

  return (
    <form className='text-black' onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>ورود</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="email">ایمیل:</label><br />
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="username"
          style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="password">رمز عبور:</label><br />
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: 10,
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'در حال ورود...' : 'ورود'}
      </button>
    </form>
  );
}
