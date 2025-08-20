'use client';

import Link from 'next/link';
import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // use the context so header updates when user changes
  const { login, user } = useAuth();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const ok = await login(email, password);
      if (!ok) throw new Error('Login failed');
      // at this point AuthContext.user is set, header re-renders automatically
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return (
      <div className="max-w-md mx-auto p-8 pt-20 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">
          خوش آمدید، {user.name} !
        </h2>
        <p className="text-gray-600">ایمیل شما: {user.email}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto pt-20 bg-white p-8 rounded-xl shadow-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">ورود</h2>

      {error && (
        <p className="mb-4 text-red-600 font-medium bg-red-100 p-3 rounded">
          {error}
        </p>
      )}

      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
          ایمیل
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="example@example.com"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
          رمز عبور
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="********"
        />
      </div>

      <Link className="text-blue-950 text-sm" href="/signup">
        ایجاد حساب کاربری
      </Link>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-md text-white font-semibold transition mt-5 ${
          loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'در حال ورود...' : 'ورود'}
      </button>
    </form>
  );
}
