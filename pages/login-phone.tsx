import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Head from "next/head";

const LoginPhonePage = () => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const { loginWithPhone } = useAuth();
  const router = useRouter();

  const sendOtp = async () => {
    setError("");
    setInfoMessage("");

    if (!phone) {
      setError("شماره تلفن نمی‌تواند خالی باشد");
      return;
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("شماره تلفن وارد شده معتبر نیست");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setInfoMessage(`کد تایید برای شماره ${phone} پیامک شد`);
        setStep("otp");
      } else {
        setError(data.error || "خطا در ارسال کد تایید");
      }
    } catch (err: any) {
      setError("خطا در ارتباط با سرور");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!loginWithPhone) {
      setError("ورود با شماره در دسترس نیست");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const success = await loginWithPhone(phone, otp);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("کد تایید یا شماره تلفن اشتباه است");
      }
    } catch (err: any) {
      setError("خطا در تأیید کد");
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>ورود به حساب کاربری با شماره | وبوفن</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f8fc] to-white p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-800">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              {step === "phone" ? "ورود با شماره تلفن" : "وارد کردن کد تایید"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {step === "phone" ? "لطفاً شماره تلفن خود را وارد کنید" : "لطفاً کد تأیید را وارد کنید"}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {step === "otp" && infoMessage && (
            <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-sm">
              {infoMessage}
            </div>
          )}

          {step === "phone" && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-600 text-sm mb-2">شماره تلفن</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09121234567"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6FD6E5] outline-none text-gray-700"
                  required
                />
              </div>
              <button
                onClick={sendOtp}
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition ${
                  loading
                    ? "bg-[#6FD6E5]/50 cursor-not-allowed"
                    : "bg-[#6FD6E5] hover:bg-[#5cb8c6]"
                }`}
              >
                {loading ? "در حال ارسال کد..." : "ارسال کد تأیید"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-600 text-sm mb-2">کد تایید</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="کد ۶ رقمی"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6FD6E5] outline-none text-gray-700 text-center"
                  required
                />
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition ${
                  loading
                    ? "bg-[#6FD6E5]/50 cursor-not-allowed"
                    : "bg-[#6FD6E5] hover:bg-[#5cb8c6]"
                }`}
              >
                {loading ? "در حال تایید..." : "تایید کد"}
              </button>

              <button
                onClick={() => setStep("phone")}
                disabled={loading}
                className="w-full text-[#27b5cb] font-medium underline hover:text-[#5cb8c6] text-sm"
              >
                ویرایش شماره تلفن
              </button>
            </div>
          )}

          <div className="text-center text-gray-600 text-sm">
            حساب کاربری ندارید؟{" "}
            <span
              className="text-cyan-600 font-medium cursor-pointer hover:underline"
              onClick={() => router.push("/signup")}
            >
              ثبت‌ نام کنید
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPhonePage;