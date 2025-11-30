// components/AnalysisModal.tsx
"use client";

import { useState } from "react";

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAnalysis: (userInfo: { name: string; phoneNumber: string }) => void;
  loading: boolean;
}

export function AnalysisModal({ isOpen, onClose, onStartAnalysis, loading }: AnalysisModalProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phoneNumber?: string }>({});

  // اعتبارسنجی شماره تماس ایرانی
  const validatePhoneNumber = (phone: string): boolean => {
    // پاکسازی شماره (حذف فاصله و کاراکترهای غیرعددی)
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    // الگوهای شماره تلفن ایرانی
    const patterns = [
      /^09\d{9}$/, // موبایل: 09123456789
      /^9\d{9}$/,  // موبایل بدون صفر: 9123456789
      /^0\d{10}$/, // ثابت با کد شهر: 02112345678
      /^\+98\d{10}$/, // با کد کشور: +989123456789
      /^0098\d{10}$/, // با کد کشور: 00989123456789
      /^0\d{2}\d{7}$/, // ثابت: 0311234567
    ];

    return patterns.some(pattern => pattern.test(cleanPhone));
  };

  // اعتبارسنجی نام
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && /^[\u0600-\u06FF\s]+$/.test(name.trim());
  };

  // اعتبارسنجی فرم
  const validateForm = (): boolean => {
    const newErrors: { name?: string; phoneNumber?: string } = {};

    // اعتبارسنجی نام
    if (!name.trim()) {
      newErrors.name = "نام و نام خانوادگی الزامی است";
    } else if (!validateName(name)) {
      newErrors.name = "نام باید حداقل ۲ حرف و فقط شامل حروف فارسی باشد";
    }

    // اعتبارسنجی شماره تماس
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "شماره تماس الزامی است";
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "شماره تماس معتبر نیست (مثال: 09123456789)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // فرمت کردن شماره تلفن هنگام تایپ
  const formatPhoneNumber = (value: string): string => {
    // پاکسازی
    const cleanValue = value.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    if (cleanValue.startsWith('+98')) {
      return `+98 ${cleanValue.slice(3, 5)} ${cleanValue.slice(5, 8)} ${cleanValue.slice(8, 12)}`;
    } else if (cleanValue.startsWith('0098')) {
      return `0098 ${cleanValue.slice(4, 6)} ${cleanValue.slice(6, 9)} ${cleanValue.slice(9, 13)}`;
    } else if (cleanValue.startsWith('0')) {
      if (cleanValue.length <= 4) {
        return cleanValue;
      } else if (cleanValue.length <= 7) {
        return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4)}`;
      } else if (cleanValue.length <= 11) {
        return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4, 7)} ${cleanValue.slice(7)}`;
      } else {
        return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4, 7)} ${cleanValue.slice(7, 11)}`;
      }
    } else if (cleanValue.startsWith('9') && cleanValue.length <= 10) {
      if (cleanValue.length <= 3) {
        return `09 ${cleanValue.slice(1)}`;
      } else if (cleanValue.length <= 6) {
        return `09 ${cleanValue.slice(1, 4)} ${cleanValue.slice(4)}`;
      } else {
        return `09 ${cleanValue.slice(1, 4)} ${cleanValue.slice(4, 7)} ${cleanValue.slice(7)}`;
      }
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
    
    // پاک کردن خطا هنگام تایپ
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: undefined }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    // پاک کردن خطا هنگام تایپ
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // نرمال‌سازی شماره تلفن قبل از ارسال
      const normalizedPhone = phoneNumber.replace(/\s+/g, '');
      onStartAnalysis({ 
        name: name.trim(), 
        phoneNumber: normalizedPhone 
      });
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName("");
      setPhoneNumber("");
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              اطلاعات تماس
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 mb-6 text-sm">
            لطفا نام و شماره تماس معتبر خود را وارد کنید تا نتایج تحلیل برای شما ارسال شود.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                نام و نام خانوادگی *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-400 ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="مثال: علی محمدی"
                required
                disabled={loading}
                dir="rtl"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                شماره تماس *
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-400 ${
                  errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 text-right'
                }`}
                placeholder="مثال: 09123456789"
                required
                disabled={loading}
                dir="ltr"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phoneNumber}
                </p>
              )}
             
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال ثبت...</span>
                  </div>
                ) : (
                  "شروع تحلیل"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}