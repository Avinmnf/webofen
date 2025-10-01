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
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-600">اطلاعات کاربری</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6 space-y-3">
        <div className="w-24 h-24 rounded-full bg-[#1d546b] flex items-center justify-center text-white text-xl font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Profile Fields */}
      <div className="bg-white p-6  space-y-4 text-black border-r border-gray-300 w-1/2">
        <div className="flex items-center gap-2">
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
              <circle
                cx="12"
                cy="6"
                r="4"
                stroke="#4d4d4d"
                stroke-width="1.5"
              ></circle>{" "}
              <path
                d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634"
                stroke="#4d4d4d"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>{" "}
            </g>
          </svg>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSaveProfile}
            className="w-full p-3 bg-gray-100 rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
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
              <g id="style=doutone">
                {" "}
                <g id="email">
                  {" "}
                  <path
                    id="vector (Stroke)"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.88534 5.2371C3.20538 5.86848 2.75 6.89295 2.75 8.5V15.5C2.75 17.107 3.20538 18.1315 3.88534 18.7629C4.57535 19.4036 5.61497 19.75 7 19.75H17C18.385 19.75 19.4246 19.4036 20.1147 18.7629C20.7946 18.1315 21.25 17.107 21.25 15.5V8.5C21.25 6.89295 20.7946 5.86848 20.1147 5.2371C19.4246 4.59637 18.385 4.25 17 4.25H7C5.61497 4.25 4.57535 4.59637 3.88534 5.2371ZM2.86466 4.1379C3.92465 3.15363 5.38503 2.75 7 2.75H17C18.615 2.75 20.0754 3.15363 21.1353 4.1379C22.2054 5.13152 22.75 6.60705 22.75 8.5V15.5C22.75 17.393 22.2054 18.8685 21.1353 19.8621C20.0754 20.8464 18.615 21.25 17 21.25H7C5.38503 21.25 3.92465 20.8464 2.86466 19.8621C1.79462 18.8685 1.25 17.393 1.25 15.5V8.5C1.25 6.60705 1.79462 5.13152 2.86466 4.1379Z"
                    fill="#696969"
                  ></path>{" "}
                  <path
                    id="vector (Stroke)_2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19.3633 7.31026C19.6166 7.63802 19.5562 8.10904 19.2285 8.3623L13.6814 12.6486C12.691 13.4138 11.3089 13.4138 10.3185 12.6486L4.77144 8.3623C4.44367 8.10904 4.38328 7.63802 4.63655 7.31026C4.88982 6.98249 5.36083 6.9221 5.6886 7.17537L11.2356 11.4616C11.6858 11.8095 12.3141 11.8095 12.7642 11.4616L18.3113 7.17537C18.6391 6.9221 19.1101 6.98249 19.3633 7.31026Z"
                    fill="#BFBFBF"
                  ></path>{" "}
                </g>{" "}
              </g>{" "}
            </g>
          </svg>
          <div
            onClick={() => setShowEmailModal(true)}
            className="w-full p-3 bg-gray-100 rounded-lg"
          >
            {profile.email}
          </div>
        </div>
        <div className="flex items-center gap-2">
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
                d="M15.1008 15.0272L15.6446 15.5437V15.5437L15.1008 15.0272ZM15.5562 14.5477L15.0124 14.0312V14.0312L15.5562 14.5477ZM17.9729 14.2123L17.5987 14.8623H17.5987L17.9729 14.2123ZM19.8834 15.312L19.5092 15.962L19.8834 15.312ZM20.4217 18.7584L20.9655 19.275L20.9655 19.2749L20.4217 18.7584ZM19.0012 20.254L18.4574 19.7375L19.0012 20.254ZM17.6763 20.9631L17.75 21.7095L17.6763 20.9631ZM7.8154 16.4752L8.3592 15.9587L7.8154 16.4752ZM3.75185 6.92574C3.72965 6.51212 3.37635 6.19481 2.96273 6.21701C2.54911 6.23921 2.23181 6.59252 2.25401 7.00613L3.75185 6.92574ZM9.19075 8.80507L9.73454 9.32159L9.19075 8.80507ZM9.47756 8.50311L10.0214 9.01963L9.47756 8.50311ZM9.63428 5.6931L10.2467 5.26012L9.63428 5.6931ZM8.3733 3.90961L7.7609 4.3426V4.3426L8.3733 3.90961ZM4.7177 3.09213C4.43244 3.39246 4.44465 3.86717 4.74498 4.15244C5.04531 4.4377 5.52002 4.42549 5.80529 4.12516L4.7177 3.09213ZM11.0632 13.0559L11.607 12.5394L11.0632 13.0559ZM10.6641 19.8123C11.0148 20.0327 11.4778 19.9271 11.6982 19.5764C11.9186 19.2257 11.8129 18.7627 11.4622 18.5423L10.6641 19.8123ZM15.113 20.0584C14.7076 19.9735 14.3101 20.2334 14.2252 20.6388C14.1403 21.0442 14.4001 21.4417 14.8056 21.5266L15.113 20.0584ZM15.6446 15.5437L16.1 15.0642L15.0124 14.0312L14.557 14.5107L15.6446 15.5437ZM17.5987 14.8623L19.5092 15.962L20.2575 14.662L18.347 13.5623L17.5987 14.8623ZM19.8779 18.2419L18.4574 19.7375L19.545 20.7705L20.9655 19.275L19.8779 18.2419ZM8.3592 15.9587C4.48307 11.8778 3.83289 8.43556 3.75185 6.92574L2.25401 7.00613C2.35326 8.85536 3.13844 12.6403 7.27161 16.9917L8.3592 15.9587ZM9.73454 9.32159L10.0214 9.01963L8.93377 7.9866L8.64695 8.28856L9.73454 9.32159ZM10.2467 5.26012L8.98569 3.47663L7.7609 4.3426L9.02189 6.12608L10.2467 5.26012ZM9.19075 8.80507C8.64695 8.28856 8.64626 8.28929 8.64556 8.29002C8.64533 8.29028 8.64463 8.29102 8.64415 8.29152C8.6432 8.29254 8.64223 8.29357 8.64125 8.29463C8.63928 8.29675 8.63724 8.29896 8.63515 8.30127C8.63095 8.30588 8.6265 8.31087 8.62182 8.31625C8.61247 8.32701 8.60219 8.33931 8.5912 8.3532C8.56922 8.38098 8.54435 8.41511 8.51826 8.45588C8.46595 8.53764 8.40921 8.64531 8.36117 8.78033C8.26346 9.0549 8.21022 9.4185 8.27675 9.87257C8.40746 10.7647 8.99202 11.9644 10.5194 13.5724L11.607 12.5394C10.1793 11.0363 9.82765 10.1106 9.7609 9.65511C9.72871 9.43536 9.76142 9.31957 9.77436 9.28321C9.78163 9.26277 9.78639 9.25709 9.78174 9.26437C9.77948 9.26789 9.77498 9.27451 9.76742 9.28407C9.76363 9.28885 9.75908 9.29437 9.75364 9.30063C9.75092 9.30375 9.74798 9.30706 9.7448 9.31056C9.74321 9.31231 9.74156 9.3141 9.73985 9.31594C9.739 9.31686 9.73813 9.31779 9.73724 9.31873C9.7368 9.3192 9.73612 9.31992 9.7359 9.32015C9.73522 9.32087 9.73454 9.32159 9.19075 8.80507ZM10.5194 13.5724C12.0422 15.1757 13.1924 15.806 14.0699 15.9485C14.5201 16.0216 14.8846 15.9632 15.1606 15.8544C15.2955 15.8012 15.4023 15.7387 15.4824 15.6819C15.5223 15.6535 15.5556 15.6266 15.5825 15.6031C15.5959 15.5913 15.6078 15.5803 15.6181 15.5703C15.6233 15.5654 15.628 15.5606 15.6324 15.5562C15.6346 15.554 15.6368 15.5518 15.6388 15.5497C15.6398 15.5487 15.6408 15.5477 15.6417 15.5467C15.6422 15.5462 15.6429 15.5454 15.6432 15.5452C15.6439 15.5444 15.6446 15.5437 15.1008 15.0272C14.557 14.5107 14.5577 14.51 14.5583 14.5093C14.5586 14.509 14.5592 14.5083 14.5597 14.5078C14.5606 14.5069 14.5615 14.506 14.5623 14.5051C14.5641 14.5033 14.5658 14.5015 14.5675 14.4998C14.5708 14.4965 14.574 14.4933 14.577 14.4904C14.5831 14.4846 14.5885 14.4796 14.5933 14.4754C14.6029 14.467 14.61 14.4616 14.6146 14.4584C14.6239 14.4517 14.623 14.454 14.6102 14.459C14.5909 14.4666 14.5001 14.4987 14.3103 14.4679C13.9078 14.4025 13.0391 14.0472 11.607 12.5394L10.5194 13.5724ZM8.98569 3.47663C7.9721 2.04305 5.94388 1.80119 4.7177 3.09213L5.80529 4.12516C6.32812 3.57471 7.24855 3.61795 7.7609 4.3426L8.98569 3.47663ZM18.4574 19.7375C18.1783 20.0313 17.8864 20.1887 17.6026 20.2167L17.75 21.7095C18.497 21.6357 19.1016 21.2373 19.545 20.7705L18.4574 19.7375ZM10.0214 9.01963C10.9889 8.00095 11.0574 6.40678 10.2467 5.26012L9.02189 6.12608C9.44404 6.72315 9.3793 7.51753 8.93377 7.9866L10.0214 9.01963ZM19.5092 15.962C20.3301 16.4345 20.4907 17.5968 19.8779 18.2419L20.9655 19.2749C22.2705 17.901 21.8904 15.6019 20.2575 14.662L19.5092 15.962ZM16.1 15.0642C16.4854 14.6584 17.086 14.5672 17.5987 14.8623L18.347 13.5623C17.2485 12.93 15.8862 13.1113 15.0124 14.0312L16.1 15.0642ZM11.4622 18.5423C10.4785 17.9241 9.43149 17.0876 8.3592 15.9587L7.27161 16.9917C8.42564 18.2067 9.56897 19.1241 10.6641 19.8123L11.4622 18.5423ZM17.6026 20.2167C17.0561 20.2707 16.1912 20.2842 15.113 20.0584L14.8056 21.5266C16.0541 21.788 17.0742 21.7762 17.75 21.7095L17.6026 20.2167Z"
                fill="#545454"
              ></path>{" "}
            </g>
          </svg>
          <div
            onClick={() => setShowPhoneModal(true)}
            className="w-full p-3 bg-gray-100 rounded-lg"
          >
            {profile.phone || "بدون شماره"}
          </div>
        </div>

        <button
          onClick={logout}
          className="py-1 flex items-center cursor-pointer rounded-lg text-gray-600 text-sm mt-6 hover:text-red-700"
        >
          <svg
            className="w-5 h-5 ml-2"
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
