import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_API}/signup`, {
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
    <div className="max-w-md mx-auto p-6  rounded-md shadow-sm  bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">ثبت‌ نام</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">نام</label>
          <input
            name="name"
            type="text"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300 text-gray-600"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">ایمیل</label>
          <input
            name="email"
            type="email"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300 text-gray-600"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">رمز عبور</label>
          <input
            name="password"
            type="password"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300 text-gray-600"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="حداقل ۸ کاراکتر"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-100 p-2 rounded ">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white font-semibold transition ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
        </button>
      </form>
    </div>
  );
}
