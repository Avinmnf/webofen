"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForms, FormPayload } from "@/hooks/useform";

// Define the props interface
interface WebDesignFormProps {
  selectedModules: string[];
  activeOption: string | null;
  totalPrice: number;
}

export default function WebDesignForm({ 
  selectedModules, 
  activeOption, 
  totalPrice 
}: WebDesignFormProps) {
  const { submitForm, loading } = useForms();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    number: false,
  });

  const handleSubmit = async () => {
    setErrors({ name: false, number: false });

    const newErrors = {
      name: !name,
      number: !number,
    };

    if (newErrors.name || newErrors.number) {
      setErrors(newErrors);
      return;
    }

    // Create the payload with selected modules
    const payload: FormPayload = {
      title: "فرم سفارش طراحی سایت",
      fields: [
        { label: "نام کاربر", type: "text", content: name },
        { label: "شماره تماس", type: "text", content: number },
        { 
          label: "نوع سایت انتخابی", 
          type: "text", 
          content: activeOption || "تعیین نشده" 
        },
        { 
          label: "ماژول‌های انتخابی", 
          type: "textarea", 
          content: selectedModules.length > 0 
            ? selectedModules.join(", ")
            : "هیچ ماژولی انتخاب نشده"
        },
        { 
          label: "مبلغ کل", 
          type: "text", 
          content: `${totalPrice.toLocaleString("fa-IR")} تومان` 
        },
        { 
          label: "تعداد ماژول‌ها", 
          type: "text", 
          content: selectedModules.length.toString() 
        },
      ],
    };

    const result = await submitForm(payload);

    if (result) {
      setShowSuccessModal(true);
      setName("");
      setNumber("");
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <p className="text-[#0364af] text-lg font-semibold">
          تکمیل اطلاعات سفارش
        </p>
        <p className="text-gray-600 text-xs sm:text-sm mt-1">
          پس از ثبت اطلاعات، کارشناسان ما در سریع‌ترین زمان با شما تماس خواهند گرفت
        </p>
      </motion.div>

      {/* Selection Summary */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="mb-6 p-4 bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-[#0364af]/15"
>
  <div className="flex items-center justify-between mb-3">
    <p className="text-[#0364af] font-semibold text-sm">سفارش شما</p>
    <div className="w-6 h-6 bg-[#0364af]/10 rounded-full flex items-center justify-center">
      <svg className="w-3 h-3 text-[#0364af]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
  
  <div className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-600">{activeOption}</span>
      <span className="text-[#0364af] font-medium">{selectedModules.length} ماژول</span>
    </div>
    
    <div className="flex justify-between items-center pt-2 border-t border-[#0364af]/10">
      <span className="text-gray-700 font-medium">جمع کل</span>
      <span className="text-[#29b0cb] font-semibold text-base">
        {totalPrice.toLocaleString("fa-IR")} تومان
      </span>
    </div>
  </div>

  {selectedModules.length > 0 && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-3 pt-3 border-t border-[#0364af]/10"
    >
      <div className="flex flex-wrap gap-1">
        {selectedModules.map((module, index) => (
          <span
            key={index}
            className="inline-block bg-white text-[#0364af] text-xs px-2 py-1 rounded-md border border-[#0364af]/20"
          >
            {module}
          </span>
        ))}
      </div>
    </motion.div>
  )}
</motion.div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-4 sm:p-6 border border-[#0364af]/20 shadow-lg"
      >
        {/* Input Fields */}
        <div className="space-y-4">
          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm text-[#0364af] font-medium mb-2">
              نام و نام خانوادگی
            </label>
            <motion.input
              type="text"
              placeholder="نام کامل خود را وارد کنید"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
              }}
              whileFocus={{ scale: 1.02 }}
              className={`w-full bg-white text-gray-700 rounded-lg p-3 text-sm border transition-all duration-300 ${
                errors.name
                  ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : "border-[#0364af]/40 focus:border-[#0364af] focus:ring-2 focus:ring-[#0364af]/20"
              }`}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                لطفاً نام خود را وارد کنید
              </motion.p>
            )}
          </motion.div>

          {/* Phone Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm text-[#0364af] font-medium mb-2">
              شماره تماس
            </label>
            <motion.input
              type="tel"
              placeholder="09xxxxxxxxx"
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
                if (errors.number) setErrors((prev) => ({ ...prev, number: false }));
              }}
              whileFocus={{ scale: 1.02 }}
              className={`w-full bg-white text-gray-700 rounded-lg p-3 text-sm border transition-all duration-300 ${
                errors.number
                  ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  : "border-[#0364af]/40 focus:border-[#0364af] focus:ring-2 focus:ring-[#0364af]/20"
              }`}
            />
            {errors.number && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                لطفاً شماره تماس خود را وارد کنید
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <motion.button
            onClick={handleSubmit}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(3, 100, 175, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-[#ff894f] text-white rounded-lg py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                در حال ارسال...
              </>
            ) : (
              <>
                ارسال اطلاعات
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  className="w-8 h-8 text-green-500"
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
              </motion.div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                اطلاعات شما با موفقیت ثبت شد
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                کارشناسان ما به زودی با شما تماس خواهند گرفت. 
                از اعتماد شما متشکریم.
              </p>
              
              <motion.button
                onClick={() => setShowSuccessModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#0364af] to-[#29b0cb] text-white rounded-lg px-6 py-2 text-sm font-medium"
              >
                متوجه شدم
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}