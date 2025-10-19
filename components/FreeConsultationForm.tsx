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

  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    phone: false,
    domain: false,
    service: false,
  });

  const handleSubmit = async () => {
    // بررسی خالی بودن فیلدها
    const newFieldErrors = {
      name: !name,
      phone: !phone,
      domain: !domain,
      service: !service,
    };
    setFieldErrors(newFieldErrors);

    // اگر فیلدی خالی بود، ارسال نشود
    if (Object.values(newFieldErrors).some(Boolean)) {
      return;
    }

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
    `bg-[#f7f8fc] rounded-lg px-10 py-2 text-sm border ${
      hasError ? "border-red-500" : "border-transparent"
    } focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200`;

  return (
    <div>
      {success && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm text-center">
            فرم با موفقیت ارسال شد!
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-4">
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
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="h-12 cursor-pointer bg-[#6FD6E5] text-white rounded-lg font-medium transition-all duration-200 hover:bg-[#5ac7d7] whitespace-nowrap px-6 min-w-[140px]"
        >
          {loading ? "در حال ارسال..." : "درخواست نوبت"}
        </button>
      </div>
    </div>
  );
}
