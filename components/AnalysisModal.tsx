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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phoneNumber.trim()) {
      onStartAnalysis({ name: name.trim(), phoneNumber: phoneNumber.trim() });
      // عدم پاک کردن فرم بلافاصله - منتظر می‌مانیم تا مودال بسته شود
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName("");
      setPhoneNumber("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-scale-in">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            اطلاعات تماس
          </h2>
          <p className="text-gray-600 mb-6">
            لطفا نام و شماره تماس خود را وارد کنید تا نتایج تحلیل برای شما ارسال شود.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
               <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                نام و نام خانوادگی
              </label>
             <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-400"
                placeholder="مثال: علی محمدی"
                required
                disabled={loading}
                />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                شماره تماس
              </label>
                <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-400"
                placeholder="مثال: 09123456789"
                required
                disabled={loading}
                />
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
                disabled={loading || !name.trim() || !phoneNumber.trim()}
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