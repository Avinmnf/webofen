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
    <div>
      
      {success && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm text-center">
            فرم با موفقیت ارسال شد!
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Desktop Layout - همه چیز در یک خط */}
      <div className="hidden lg:flex   gap-4 w-full items-center ">
        <input
          type="text"
          placeholder="نام و نام خانوادگی"
    className=" bg-[#f7f8fc]  rounded-lg px-10 py-2 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="تلفن همراه"
    className=" bg-[#f7f8fc] rounded-lg px-10 py-2 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="نام دامنه"
    className=" bg-[#f7f8fc] rounded-lg px-10 py-2 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
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
          className="h-12 cursor-pointer bg-[#6FD6E5] text-white rounded-lg font-medium transition-all duration-200 hover:bg-[#5ac7d7] whitespace-nowrap px-6 min-w-[140px]"
        >
          {loading ? "در حال ارسال..." : "درخواست نوبت"}
        </button>
      </div>

      {/* Tablet Layout - 2 ستونی */}
      <div className="hidden md:flex lg:hidden flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="نام و نام خانوادگی"
    className=" bg-[#f7f8fc] rounded-lg px-12  py-2 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
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
    className=" bg-[#f7f8fc] rounded-lg px-12 py-2 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 cursor-pointer bg-[#6FD6E5] text-white rounded-lg font-medium transition-all duration-200 hover:bg-[#5ac7d7] px-6"
        >
          {loading ? "در حال ارسال..." : "درخواست نوبت"}
        </button>
      </div>

      {/* Mobile Layout - عمودی */}
      <div className="flex md:hidden flex-col gap-4 pl-8 pr-8">
        <input
          type="text"
          placeholder="نام و نام خانوادگی"
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="تلفن همراه"
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="نام دامنه"
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <input
          type="text"
          placeholder="خدمت مورد نظر"
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 cursor-pointer bg-[#6FD6E5] text-white rounded-lg font-medium transition-all duration-200 hover:bg-[#5ac7d7] px-6"
        >
          {loading ? "در حال ارسال..." : "درخواست نوبت"}
        </button>
      </div>
    </div>
  );
}