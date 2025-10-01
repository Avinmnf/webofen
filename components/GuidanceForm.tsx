'use client';
import React, { useState } from "react";
import { useForms, FormPayload } from "@/hooks/useform";

export default function GuidanceForm() {
  const { submitForm, loading } = useForms();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    const payload: FormPayload = {
      title: "درخواست مشاوره رایگان",
      fields: [
        { label: "نام", type: "textarea", content: name || "" },
        { label: "شماره تماس", type: "textarea", content: phone || "" },
        { label: "پیام", type: "textarea", content: message || "" },
      ],
    };

    const result = await submitForm(payload);

    if (result) {
      setSuccess(true);
      setName("");
      setPhone("");
      setMessage("");
    } else {
      setError("خطا در ارسال فرم");
    }
  };

  return (
    <div className="bg-white w-full lg:w-[30%] rounded-lg p-6">
      <div className="flex items-center text-xl mb-4">
        <div className="w-2 h-10 bg-[#6fd6e5] rounded-2xl ml-2"></div>
        <span className="text-gray-700 font-semibold">درخواست</span>
        <span className="text-[#1d546b] mr-1 font-semibold">مشاوره رایگان</span>
      </div>

      {success && <p className="text-green-500 mb-4">فرم با موفقیت ارسال شد!</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        className="w-full border border-gray-200 py-2 rounded-md px-1 text-gray-500 mb-4"
        placeholder="نام"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full border border-gray-200 py-2 rounded-md px-1 text-gray-500 mb-4"
        placeholder="شماره تماس"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <textarea
        className="w-full h-26 border border-gray-200 px-1 py-2 rounded-md text-gray-500 mb-4"
        placeholder="پیام خود را بنویسید"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-[#1d546b] text-white py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "در حال ارسال..." : "ارسال"}
      </button>
    </div>
  );
}
