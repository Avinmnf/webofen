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
      <div className="p-6 text-center text-gray-500">در حال بارگذاری...</div>
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
        // Update phone in profile after OTP verification
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
    <div className="p-4 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-600">اطلاعات کاربری</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6 space-y-3">
        <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Profile Fields */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4 text-black">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSaveProfile}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
        />

        <div
          onClick={() => setShowEmailModal(true)}
          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 cursor-pointer"
        >
          {profile.email}
        </div>

        <div
          onClick={() => setShowPhoneModal(true)}
          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 cursor-pointer"
        >
          {profile.phone || "بدون شماره"}
        </div>

        <button
          onClick={logout}
          className="px-3 py-1 flex items-center cursor-pointer rounded-lg text-gray-600 text-sm mt-2"
        >
          <svg
          className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M14 7.63636L14 4.5C14 4.22386 13.7761 4 13.5 4L4.5 4C4.22386 4 4 4.22386 4 4.5L4 19.5C4 19.7761 4.22386 20 4.5 20L13.5 20C13.7761 20 14 19.7761 14 19.5L14 16.3636"
                stroke="#454545"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M10 12L21 12M21 12L18.0004 8.5M21 12L18 15.5"
                stroke="#454545"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
          خروج از حساب کاربری
        </button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">تغییر ایمیل</h2>
            <input
              type="email"
              placeholder="ایمیل جدید"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="w-1/2 py-2 bg-gray-300 rounded-lg"
              >
                انصراف
              </button>
              <button
                onClick={requestEmailChange}
                className="w-1/2 py-2 bg-purple-600 text-white rounded-lg"
              >
                ارسال کد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-600">
              تغییر شماره موبایل
            </h2>

            {phoneStep === "input" && (
              <>
                <input
                  type="tel"
                  placeholder="شماره جدید"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-4 text-gray-600 text-end"
                />
                {phoneError && (
                  <p className="text-red-600 mb-2">{phoneError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPhoneModal(false)}
                    className="w-1/2 py-2 bg-gray-300 rounded-lg"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={requestPhoneChange}
                    disabled={phoneLoading}
                    className="w-1/2 py-2 bg-purple-600 text-white rounded-lg"
                  >
                    ارسال کد
                  </button>
                </div>
              </>
            )}

            {phoneStep === "otp" && (
              <>
                <p className="text-sm text-gray-600 mb-2">{otpSentMessage}</p>
                <input
                  type="text"
                  placeholder="کد تایید"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-4 text-gray-500"
                />
                {phoneError && (
                  <p className="text-red-600 mb-2">{phoneError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setPhoneStep("input");
                      setPhoneOtp("");
                      setPhoneError("");
                    }}
                    className="w-1/2 py-2 bg-gray-300 rounded-lg"
                  >
                    بازگشت
                  </button>
                  <button
                    onClick={verifyPhoneOtp}
                    disabled={phoneLoading}
                    className="w-1/2 py-2 bg-purple-600 text-white rounded-lg"
                  >
                    تایید کد
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
