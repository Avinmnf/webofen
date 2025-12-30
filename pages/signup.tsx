import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "", 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailExistsModal, setShowEmailExistsModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`api/proxy/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data?.message?.includes("ایمیل")) {
          setShowEmailExistsModal(true);
        } else {
          throw new Error(data?.message || "Signup failed");
        }
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>ثبت‌نام | وبوفن</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f8fc] to-white p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-800">
          <div className="text-center">
            <h2 className="text-3xl font-bold">ثبت‌ نام</h2>
            <p className="text-gray-500 text-sm mt-1">لطفاً اطلاعات خود را وارد کنید</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-600 text-sm mb-2">نام و نام خانوادگی</label>
              <input
                name="name"
                type="text"
                placeholder="نام و نام خانوادگی"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6FD6E5] outline-none text-gray-700"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">ایمیل</label>
              <input
                name="email"
                type="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6FD6E5] outline-none text-gray-700"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">شماره تلفن</label>
              <input
                name="phone"
                type="tel"
                placeholder="09121234567"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6FD6E5] outline-none text-gray-700"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label className="block text-gray-600 text-sm mb-2">رمز عبور</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="حداقل ۸ کاراکتر"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6FD6E5] outline-none text-gray-700 pr-12"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 mt-6 flex items-center px-2 text-gray-400"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.35-3.827M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition ${
                loading
                  ? "bg-[#6FD6E5]/50 cursor-not-allowed"
                  : "bg-[#6FD6E5] hover:bg-[#5cb8c6]"
              }`}
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت نام"}
            </button>
          </form>

          <div className="text-center text-gray-600 text-sm">
            از قبل حساب کاربری دارید؟{" "}
            <span
              className="text-cyan-600 font-medium cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              وارد شوید
            </span>
          </div>
        </div>

        {showEmailExistsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-50 text-[#6FD6E5] w-14 h-14 flex items-center justify-center rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-2">ایمیل تکراری</h2>

                <p className="text-gray-600 text-sm mb-6">
                  این ایمیل قبلاً در سیستم ثبت شده است. لطفاً از ایمیل دیگری استفاده کنید یا وارد شوید.
                </p>

                <button
                  onClick={() => setShowEmailExistsModal(false)}
                  className="w-full py-3 bg-[#6FD6E5] text-white font-semibold rounded-xl shadow-md transition hover:bg-[#5cb8c6]"
                >
                  فهمیدم
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}