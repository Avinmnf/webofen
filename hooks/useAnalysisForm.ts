"use client";

import { useState } from "react";

export function useAnalysisForm() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    url: "",
  });

  const [errors, setErrors] = useState<{ name?: string; phoneNumber?: string; url?: string }>({});

  const setName = (name: string) => setFormData((prev) => ({ ...prev, name }));
  const setPhoneNumber = (phoneNumber: string) => setFormData((prev) => ({ ...prev, phoneNumber }));
  const setUrl = (url: string) => setFormData((prev) => ({ ...prev, url }));

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "نام الزامی است";
    if (!/^09[0-9]{9}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "شماره موبایل معتبر نیست";
    if (!formData.url.trim()) newErrors.url = "آدرس سایت الزامی است";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getUserInfo = () => ({
    name: formData.name,
    phoneNumber: formData.phoneNumber,
  });

  const resetForm = () => {
    setFormData({ name: "", phoneNumber: "", url: "" });
    setErrors({});
  };

  return {
    formData,
    errors,
    setName,
    setPhoneNumber,
    setUrl,
    validateForm,
    getUserInfo,
    resetForm,
  };
}