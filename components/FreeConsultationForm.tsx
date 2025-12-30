"use client";
import React, { useState } from "react";
import { useForms, FormPayload } from "@/hooks/useform";

export default function FreeConsultationForm() {
  const { submitForm, loading } = useForms();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [domain, setDomain] = useState("");
  const [service, setService] = useState("");
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    phone: false,
    domain: false,
    service: false,
  });

  const handleSubmit = async () => {
    const newFieldErrors = {
      name: !name,
      phone: !phone,
      domain: !domain,
      service: !service,
    };
    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some(Boolean)) return;

    const payload: FormPayload = {
      title: "درخواست نوبت",
      fields: [
        { label: "نام و نام خانوادگی", type: "text", content: name },
        { label: "تلفن همراه", type: "text", content: phone },
        { label: "نام دامنه", type: "text", content: domain },
        { label: "خدمت مورد نظر", type: "text", content: service },
      ],
    };

    const result = await submitForm(payload);

    if (result) {
      setSuccess(true);
      setShowSuccessModal(true);
      setName("");
      setPhone("");
      setDomain("");
      setService("");
      setFieldErrors({
        name: false,
        phone: false,
        domain: false,
        service: false,
      });
    }
  };

  const getInputClass = (hasError: boolean) =>
    `w-full h-12 bg-[#f7f8fc] rounded-lg px-4 text-sm border ${
      hasError ? "border-red-500" : "border-transparent"
    } focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200`;

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 text-gray-600">

        {/* NAME */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="نام و نام خانوادگی"
            className={getInputClass(fieldErrors.name)}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, name: false }));
            }}
          />
        </div>

        {/* PHONE */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="تلفن همراه"
            className={getInputClass(fieldErrors.phone)}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setFieldErrors((prev) => ({ ...prev, phone: false }));
            }}
          />
        </div>

        {/* DOMAIN */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="نام دامنه"
            className={getInputClass(fieldErrors.domain)}
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setFieldErrors((prev) => ({ ...prev, domain: false }));
            }}
          />
        </div>

        {/* SERVICE */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="خدمت مورد نظر"
            className={getInputClass(fieldErrors.service)}
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              setFieldErrors((prev) => ({ ...prev, service: false }));
            }}
          />
        </div>

        {/* BUTTON */}
        <div className="flex-none">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-12 w-full lg:w-auto cursor-pointer bg-[#6FD6E5] text-white rounded-lg font-medium transition-all duration-200 hover:bg-[#5ac7d7] whitespace-nowrap px-6"
          >
            {loading ? "در حال ارسال..." : "درخواست نوبت"}
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-xl animate-fadeIn">
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
