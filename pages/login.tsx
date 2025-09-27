import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // اضافه شد

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
    router.push('/login-phone');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f8fc] to-white p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-800 mb-48">
        <div className="text-center">
          <h2 className="text-3xl font-bold">ورود</h2>
          <p className="text-gray-500 text-sm mt-1">لطفاً اطلاعات حساب خود را وارد کنید</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* رمز عبور با آیکون چشم */}
          <div className="relative">
            <label className="block text-gray-600 text-sm mb-1">رمز عبور</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="حداقل ۸ کاراکتر"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-2 text-gray-600 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-2 mt-4 pr-2 flex items-center px-2 text-gray-400"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
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
            className={`w-full py-3 rounded-xl text-white font-semibold cursor-pointer shadow-md transition ${
              loading ? "bg-[#6FD6E5]/50 cursor-not-allowed" : "bg-[#6FD6E5] hover:bg-[#5cb8c6]"
            }`}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handlePhoneLogin}
            className="text-[#27b5cb] font-medium underline cursor-pointer hover:text-[#5cb8c6]"
          >
            ورود با شماره تلفن
          </button>
        </div>

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
