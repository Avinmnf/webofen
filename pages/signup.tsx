'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // اضافه شده

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`api/proxy/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Signup failed');
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f8fc] relative overflow-hidden">
      <div className="w-full max-w-lg bg-white rounded-md shadow-lg p-10 mb-42 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">ثبت‌ نام</h1>
          <p className="text-gray-500 mt-1 text-sm">لطفاً اطلاعات خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            type="text"
            placeholder="نام و نام خانوادگی"
            className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="ایمیل"
            className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="phone"
            type="tel"
            className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600 placeholder:text-right"
            value={form.phone}
            onChange={handleChange}
            placeholder="شماره تلفن"
          />

          {/* رمز عبور با آیکون چشم */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="رمز عبور"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600 pr-10"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400"
            >
              {showPassword ? (
                // آیکون چشم باز
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                // آیکون چشم بسته
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.35-3.827M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full text-white cursor-pointer font-semibold transition shadow-md ${
              loading ? "bg-[#6FD6E5]/50 cursor-not-allowed" : "bg-[#6FD6E5] hover:bg-[#5cb8c6]"
            }`}
          >
            {loading ? "در حال ثبت‌نام..." : "ثبت نام"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          از قبل حساب کاربری دارید؟{" "}
          <span
            className="text-cyan-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            وارد شوید
          </span>
        </p>
      </div>
    </div>
  );
}
