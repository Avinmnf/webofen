'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="flex items-center justify-center min-h-screen bg-[#f7f8fc]  relative overflow-hidden">


      {/* کارت فرم */}
      <div className="w-full max-w-lg bg-white rounded-md shadow-lg p-10 mb-42 relative z-10">
          <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">ثبت‌ نام</h1>
          <p className="text-gray-500 mt-1 text-sm">
            لطفاً اطلاعات خود را وارد کنید
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* نام */}
          <input
            name="name"
            type="text"
            placeholder="نام و نام خانوادگی"
            className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* ایمیل */}
          <input
            name="email"
            type="email"
            placeholder="ایمیل"
            className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600"
            value={form.email}
            onChange={handleChange}
          />

          {/* شماره تلفن */}
       <input
        name="phone"
        type="tel"
        className=" w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600 placeholder:text-right"
        value={form.phone}
        onChange={handleChange}
        placeholder=" شماره تلفن"
      />


          {/* رمز عبور */}
          <input
            name="password"
            type="password"
            placeholder="رمز عبور"
            className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600"
            value={form.password}
            onChange={handleChange}
            required
          />

     


          {/* دکمه ثبت */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full text-white font-semibold transition shadow-md ${
              loading
                   ? "bg-[#6FD6E5]/50 cursor-not-allowed"
                : "bg-[#6FD6E5] hover:bg-[#5cb8c6]"
            }`}
          >
            {loading ? "در حال ثبت‌نام..." : " ثبت نام"}
          </button>
        </form>

        {/* لینک ورود */}
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
