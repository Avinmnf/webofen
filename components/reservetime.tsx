"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForms, FormPayload } from "@/hooks/useform";

export default function Reservetime() {
  const { submitForm, loading } = useForms();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // modal state
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
  });

  const handleSubmit = async () => {
    setErrors({ name: false, phone: false });
    setSuccess(false);

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
        { label: "نام و نام خانوادگی", type: "text", content: name },
        { label: "تلفن همراه", type: "text", content: phone },
      ],
    };

    const result = await submitForm(payload);

    if (result) {
      setSuccess(true);
      setShowSuccessModal(true); // show modal
      setName("");
      setPhone("");
    }
  };

  return (
    <motion.div
      className="relative w-full aspect-[3/4] sm:aspect-[15/3] overflow-hidden flex items-start"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative w-full aspect-[3/4] sm:aspect-[15/3] overflow-hidden flex items-start">
        {/* Desktop Image */}
        <Image
          src="/homepage/timereserve.png"
          alt="Desktop slide"
          fill
          className="object-cover hidden sm:block"
        />
        {/* Mobile Image */}
        <Image
          src="/homepage/timeresmobile.png"
          alt="Mobile slide"
          fill
          className="object-cover block sm:hidden"
        />
        <div className="absolute top-25 md:top-6 md:right-4 items-start z-10 p-10 md:p-4 pt-10 rounded-xl">
          <div className="mt-10">
            <p className="text-lg md:text-3xl text-white mb-4">
              قبل از ثبت نوبت می‌توانید از ما
              <span className="text-[#1d546b]"> مشاوره رایگان </span>
              دریافت کنید :
            </p>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-10">
            <input
              type="text"
              placeholder="نام و نام خانوادگی"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: false }));
              }}
              className={`bg-[#f7f8fc] text-gray-700 rounded-lg p-2 px-4 text-sm border transition-all duration-200 ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                  : "border-transparent focus:outline-none focus:border-[#1d546b] focus:ring-2 focus:ring-[#1d546b]"
              }`}
            />
            <input
              type="text"
              placeholder="تلفن همراه"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone)
                  setErrors((prev) => ({ ...prev, phone: false }));
              }}
              className={`bg-[#f7f8fc] text-gray-700 rounded-lg p-2 px-4 text-sm border transition-all duration-200 ${
                errors.phone
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                  : "border-transparent focus:outline-none focus:border-[#1d546b] focus:ring-2 focus:ring-[#1d546b]"
              }`}
            />
            <div className="w-full lg:w-auto flex justify-center">
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-32 h-10 bg-[#1d546b] text-white rounded-xl whitespace-nowrap px-3"
              >
                {loading ? "در حال ارسال..." : "ثبت درخواست"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-2/6 max-w-[90%] text-center shadow-xl animate-fadeIn scale-95 transform transition-all duration-300">
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
    </motion.div>
  );
}
