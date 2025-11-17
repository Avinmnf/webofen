'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForms, FormPayload } from "@/hooks/useform";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const { submitForm, loading } = useForms();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ name: false, phone: false });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    setErrors({ name: false, phone: false });

    const newErrors = {
      name: !name,
      phone: !phone,
    };

    if (newErrors.name || newErrors.phone) {
      setErrors(newErrors);
      return;
    }

    const payload: FormPayload = {
      title: "درخواست مشاوره رایگان",
      fields: [
        { label: "نام", type: "text", content: name },
        { label: "تلفن همراه", type: "text", content: phone },
      ],
    };

    const result = await submitForm(payload);

    if (result) {
      setShowSuccess(true);
      setName("");
      setPhone("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg"
          >
            {!showSuccess ? (
              <>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">درخواست مشاوره رایگان</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">نام</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
                      }}
                      className={`w-full border px-3 py-2 rounded-md text-gray-700 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">لطفاً نام خود را وارد کنید</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">شماره تماس</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
                      }}
                      className={`w-full border px-3 py-2 rounded-md text-gray-700 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">لطفاً شماره تماس خود را وارد کنید</p>}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                  >
                    انصراف
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-[#1d546b] text-white rounded-md hover:bg-[#15435a] transition disabled:opacity-50"
                  >
                    {loading ? "در حال ارسال..." : "ارسال"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">اطلاعات شما با موفقیت ارسال شد</h3>
                <p className="text-gray-600 text-sm mb-6">کارشناسان ما به زودی با شما تماس خواهند گرفت.</p>
                <button
                  onClick={() => { setShowSuccess(false); onClose(); }}
                  className="bg-[#29b0cb] text-white rounded-lg px-6 py-2 text-sm font-medium hover:bg-[#1ea0b5] transition"
                >
                  متوجه شدم
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
