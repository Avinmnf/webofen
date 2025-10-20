'use client';
import React, { useState } from "react";
import { useForms, FormPayload } from "@/hooks/useform";

export default function GuidanceForm() {
  const { submitForm, loading } = useForms();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    message: false
  });

  const handleSubmit = async () => {
    // Reset errors
    setErrors({
      name: false,
      phone: false,
      message: false
    });
    setSuccess(false);

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
      setSuccess(true);
      setName("");
      setPhone("");
      setMessage("");
    }
  };

  return (
    <div className="bg-white w-full lg:w-[30%] rounded-2xl p-6">
      <div className="flex items-center text-xl mb-4">
        <div className="w-2 h-10 bg-[#6fd6e5] rounded-2xl ml-2"></div>
        <span className="text-gray-700 font-semibold">درخواست</span>
        <span className="text-[#1d546b] mr-1 font-semibold">مشاوره رایگان</span>
      </div>

      {success && <p className="text-green-500 mb-4">فرم با موفقیت ارسال شد!</p>}

      <input
        className={`w-full border py-2 rounded-md px-1 text-gray-500 mb-4 ${
          errors.name ? 'border-red-500' : 'border-gray-200'
        }`}
        placeholder="نام"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) {
            setErrors(prev => ({...prev, name: false}));
          }
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
          if (errors.phone) {
            setErrors(prev => ({...prev, phone: false}));
          }
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
          if (errors.message) {
            setErrors(prev => ({...prev, message: false}));
          }
        }}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-[#1d546b] cursor-pointer text-white py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "در حال ارسال..." : "ارسال"}
      </button>
    </div>
  );
}