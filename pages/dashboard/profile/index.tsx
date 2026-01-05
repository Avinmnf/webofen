"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { logout, loading: authLoading } = useAuth();
  const { profile, loading, error, updateProfile } = useProfile();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [phoneStep, setPhoneStep] = useState<"input" | "otp">("input");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [otpSentMessage, setOtpSentMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [tempPhone, setTempPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  if (authLoading || loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );

  if (!profile)
    return (
      <div className="p-6 text-center text-gray-500">
        {error || "You are not logged in."}
      </div>
    );

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ name, address });
    } catch (err) {
      console.error(err);
    }
  };

  const requestEmailChange = async () => {
    try {
      await updateProfile({ email: newEmail });
      setShowEmailModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const requestPhoneChange = async () => {
    setPhoneLoading(true);
    setPhoneError("");
    setOtpSentMessage("");

    if (!newPhone) {
      setPhoneError("شماره تلفن نمی‌تواند خالی باشد");
      setPhoneLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/profile/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: newPhone, userId: profile.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSentMessage(`کد تایید برای شماره ${newPhone} ارسال شد`);
        setTempPhone(newPhone);
        setPhoneStep("otp");
      } else {
        setPhoneError(data.error || "مشکلی پیش آمد");
      }
    } catch (err: any) {
      setPhoneError(err.message);
    }

    setPhoneLoading(false);
  };

  const verifyPhoneOtp = async () => {
    setPhoneLoading(true);
    setPhoneError("");

    try {
      const res = await fetch("/api/auth/profile/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: tempPhone,
          code: phoneOtp,
          userId: profile.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        await updateProfile({ phone: tempPhone } as any);
        setShowPhoneModal(false);
        setPhoneStep("input");
        setPhoneOtp("");
      } else {
        setPhoneError(data.error || "کد تایید اشتباه است");
      }
    } catch (err: any) {
      setPhoneError(err.message);
    }

    setPhoneLoading(false);
  };

  return (
    <div className="h-full bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">اطلاعات کاربری</h1>
          <p className="text-gray-500 mt-2">مدیریت حساب کاربری و اطلاعات شخصی</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Avatar Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1d546b] to-[#2a7a9c] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
                <p className="text-gray-500 text-sm">کاربر عادی</p>
              </div>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="p-6 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">نام و نام خانوادگی</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleSaveProfile}
                  className="w-full p-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d546b]/20 focus:border-[#1d546b] outline-none transition-all"
                  placeholder="نام خود را وارد کنید"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ایمیل</label>
              <div 
                onClick={() => setShowEmailModal(true)}
                className="relative cursor-pointer group"
              >
                <div className="w-full p-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg group-hover:border-[#1d546b] transition-all">
                  <span className="text-gray-800">{profile.email}</span>
                  <span className="text-xs text-[#1d546b] font-medium mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    تغییر
                  </span>
                </div>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">شماره موبایل</label>
              <div 
                onClick={() => setShowPhoneModal(true)}
                className="relative cursor-pointer group"
              >
                <div className="w-full p-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg group-hover:border-[#1d546b] transition-all">
                  <span className={profile.phone ? "text-gray-800" : "text-black"}>
                    {profile.phone || "ثبت نشده"}
                  </span>
                  <span className="text-xs text-[#1d546b] font-medium mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {profile.phone ? "تغییر" : "افزودن"}
                  </span>
                </div>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">آدرس</label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={handleSaveProfile}
                  className="w-full p-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1d546b]/20 focus:border-[#1d546b] outline-none transition-all"
                  placeholder="آدرس خود را وارد کنید"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-6 mt-6 border-t border-gray-100">
              <button
                onClick={logout}
                className="flex items-center justify-center w-full py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all group"
              >
                <svg className="w-5 h-5 ml-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>خروج از حساب کاربری</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">تغییر ایمیل</h2>
            <p className="text-sm text-black mb-4">ایمیل جدید خود را وارد کنید</p>
            <input
              type="email"
              placeholder="email@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-[#1d546b]/20 focus:border-[#1d546b] outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={requestEmailChange}
                className="flex-1 py-3 bg-[#1d546b] text-white hover:bg-[#164259] rounded-lg transition-colors"
              >
                ارسال کد تایید
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {phoneStep === "input" ? "تغییر شماره موبایل" : "تایید شماره موبایل"}
            </h2>

            {phoneStep === "input" ? (
              <>
                <p className="text-sm text-gray-600 mb-4">شماره موبایل جدید خود را وارد کنید</p>
                <input
                  type="tel"
                  placeholder="09××××××××"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#1d546b]/20 focus:border-[#1d546b] outline-none text-center"
                />
                {phoneError && (
                  <p className="text-red-600 text-sm mb-3">{phoneError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPhoneModal(false)}
                    className="flex-1 py-3 text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={requestPhoneChange}
                    disabled={phoneLoading}
                    className="flex-1 py-3 bg-[#1d546b] text-white hover:bg-[#164259] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {phoneLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                        در حال ارسال
                      </span>
                    ) : "ارسال کد تایید"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-2">{otpSentMessage}</p>
                <p className="text-xs text-gray-500 mb-4">کد ارسال شده به شماره {tempPhone} را وارد کنید</p>
                <input
                  type="text"
                  placeholder="کد تایید ۶ رقمی"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  maxLength={6}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#1d546b]/20 focus:border-[#1d546b] outline-none text-center text-lg tracking-widest"
                />
                {phoneError && (
                  <p className="text-red-600 text-sm mb-3">{phoneError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setPhoneStep("input");
                      setPhoneOtp("");
                      setPhoneError("");
                    }}
                    className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    بازگشت
                  </button>
                  <button
                    onClick={verifyPhoneOtp}
                    disabled={phoneLoading}
                    className="flex-1 py-3 bg-[#1d546b] text-white hover:bg-[#164259] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {phoneLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                        در حال تایید
                      </span>
                    ) : "تایید کد"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}