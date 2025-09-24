import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (success) {
      router.push('/dashboard');
    } else {
      setError('ایمیل یا رمز عبور اشتباه است');
    }
    
    setLoading(false);
  };

  const handlePhoneLogin = () => {
    router.push('/login-phone'); // هدایت به صفحه ورود با شماره
  };

  const handleSignup = () => {
    router.push('/signup'); // هدایت به صفحه ثبت‌نام
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f8fc] to-white p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-800 mb-48">
        
        {/* عنوان */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">ورود</h2>
          <p className="text-gray-500 text-sm mt-1">
            لطفاً اطلاعات حساب خود را وارد کنید
          </p>
        </div>

        {/* پیام خطا */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        {/* فرم ورود */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ایمیل */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600"
              required
            />
          </div>

          {/* رمز عبور */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="حداقل ۸ کاراکتر"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600"
              required
            />
          </div>

          {/* دکمه ورود */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition ${
              loading ? "bg-[#6FD6E5]/50 cursor-not-allowed" : "bg-[#6FD6E5] hover:bg-[#5cb8c6]"
            }`}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        {/* ورود با شماره تلفن */}
        <div className="mt-4 text-center">
          <button
            onClick={handlePhoneLogin}
            className="text-[#27b5cb] font-medium underline cursor-pointer hover:text-[#5cb8c6]"
          >
            ورود با شماره تلفن
          </button>
        </div>

        {/* ثبت نام */}
        <div className="mt-2 text-center text-gray-600 text-sm">
        حساب کاربری ندارید؟{" "}
          <span
            className="text-cyan-600 font-medium cursor-pointer hover:underline"
            onClick={handleSignup}
          >
            ثبت‌ نام کنید
          </span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
