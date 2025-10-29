'use client';
import React, { useState } from "react";
import { useForms, FormPayload } from "@/hooks/useform";

export default function GuidanceForm() {
  const { submitForm, loading } = useForms();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    message: false
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    // Reset errors
    setErrors({
      name: false,
      phone: false,
      message: false
    });

    // Validate fields
    const newErrors = {
      name: !name,
      phone: !phone,
      message: !message
    };

    if (newErrors.name || newErrors.phone || newErrors.message) {
      setErrors(newErrors);
      return;
    }

    const payload: FormPayload = {
      title: "درخواست مشاوره رایگان",
      fields: [
        { label: "نام", type: "textarea", content: name },
        { label: "تلفن همراه", type: "text", content: phone },
        { label: "پیام", type: "textarea", content: message },
      ],
    };

    const result = await submitForm(payload);

    if (result) {
      // Clear fields
      setName("");
      setPhone("");
      setMessage("");

      // Show modal
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="bg-white w-full lg:w-[30%] rounded-2xl p-6 relative">
      {/* Form Header */}
      <div className="flex items-center text-xl mb-4">
        <div className="w-2 h-10 bg-[#6fd6e5] rounded-2xl ml-2"></div>
        <span className="text-gray-700 font-semibold">درخواست</span>
        <span className="text-[#1d546b] mr-1 font-semibold">مشاوره رایگان</span>
      </div>

      {/* Inputs */}
      <input
        className={`w-full border py-2 rounded-md px-1 text-gray-500 mb-4 ${
          errors.name ? 'border-red-500' : 'border-gray-200'
        }`}
        placeholder="نام"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors(prev => ({...prev, name: false}));
        }}
      />
      <input
        className={`w-full border py-2 rounded-md px-1 text-gray-500 mb-4 ${
          errors.phone ? 'border-red-500' : 'border-gray-200'
        }`}
        placeholder="تلفن همراه"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          if (errors.phone) setErrors(prev => ({...prev, phone: false}));
        }}
      />
      <textarea
        className={`w-full h-26 border px-1 py-2 rounded-md text-gray-500 mb-4 ${
          errors.message ? 'border-red-500' : 'border-gray-200'
        }`}
        placeholder="پیام خود را بنویسید"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (errors.message) setErrors(prev => ({...prev, message: false}));
        }}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-[#1d546b] cursor-pointer text-white py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "در حال ارسال..." : "ارسال"}
      </button>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-2/6 max-w-[90%] text-center shadow-xl animate-fadeIn scale-95 transform transition-all duration-300">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-[#6FD6E5]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-700 text-lg mb-5">
               فرم شما با موفقیت ارسال شد. <br />
              همکاران ما در اسرع وقت با شما تماس خواهند گرفت.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-[#6FD6E5] text-white rounded-full font-medium hover:bg-[#5ac7d7] transition-colors duration-200"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
