'use client';
import React, { useState } from "react";
import { useForms, FormPayload } from "@/hooks/useform";

export default function FreeConsultationForm() {
  const { submitForm, loading } = useForms();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [domain, setDomain] = useState("");
  const [service, setService] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    const payload: FormPayload = {
      title: "درخواست نوبت",
      fields: [
        { label: "نام و نام خانوادگی", type: "text", content: name || "" },
        { label: "تلفن همراه", type: "text", content: phone || "" },
        { label: "نام دامنه", type: "text", content: domain || "" },
        { label: "خدمت مورد نظر", type: "text", content: service || "" },
      ],
    };

    const result = await submitForm(payload);

    if (result) {
      setSuccess(true);
      setName("");
      setPhone("");
      setDomain("");
      setService("");
    } else {
      setError("خطا در ارسال فرم. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div className="">
      

      {success && (
        <p className="text-green-500 mb-4 text-sm">
          فرم با موفقیت ارسال شد!
        </p>
      )}
      {error && (
        <p className="text-red-500 mb-4 text-sm">{error}</p>
      )}

<div className="flex gap-4 w-full items-center">
  <input
    type="text"
    placeholder="نام و نام خانوادگی"
    className=" bg-[#f7f8fc] rounded-lg px-12 py-2 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <input
    type="text"
    placeholder="تلفن همراه"
    className=" bg-[#f7f8fc] rounded-lg px-12 py-2 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
  />
  <input
    type="text"
    placeholder="نام دامنه"
    className=" bg-[#f7f8fc] rounded-lg px-12 py-2 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
    value={domain}
    onChange={(e) => setDomain(e.target.value)}
  />
  <input
    type="text"
    placeholder="خدمت مورد نظر"
    className=" bg-[#f7f8fc] rounded-lg px-10 py-2 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
    value={service}
    onChange={(e) => setService(e.target.value)}
  />
  <button
    onClick={handleSubmit}
    disabled={loading}
  className="h-10 bg-[#6FD6E5] text-white rounded-lg font-light transition-all duration-200 hover:bg-[#5ac7d7] whitespace-nowrap px-3"
  >
    {loading ? "در حال ارسال..." : "درخواست نوبت"}
  </button>
</div>

    </div>
  );
}
