import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import WebDesignForm from "../webdesignform";
import Link from "next/link";
import ConsultationModal from "@/components/ConsultationModal";

export default function WebDesignModule() {
  const [selected, setSelected] = useState<string[]>([]);
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1); // Added step 3 for the form
  const [open, setOpen] = useState(false);

  const options = [
    { title: "طراحی سایت فروشگاهی", desc: "امکان فروش محصولات" },
    { title: "طراحی سایت گردشگری", desc: "خدمات سفر، راهنما تور و گردشگری" },
    { title: "طراحی سایت خبری", desc: "پلتفرم خبرگزاری و اشتراک خبر" },
    { title: "طراحی سایت خدماتی", desc: "ارائه خدمات به کاربران اینترنتی" },
    { title: "طراحی سایت آموزشی", desc: "آموزش آنلاین در بستر دیجیتال" },
    { title: "طراحی سایت شرکتی", desc: "معرفی محصولات و خدمات شرکتی" },
    { title: "طراحی سایت رستوران", desc: "سفارش آنلاین غذا و خوراکی" },
    { title: "طراحی سایت املاک", desc: "فروش و اجاره املاک و مستغلات" },
    { title: "طراحی سایت پزشکی", desc: "ارائه خدمات پزشکی و نوبت دهی " },
    { title: "طراحی سایت بیمه", desc: "خدمات بیمه گذاری آنلاین" },
    { title: "طراحی سایت صرافی", desc: "معامله و تبادلات ارزدیجیتال" },
    { title: "طراحی سایت کتابخوان", desc: "ارائه ایبوک و کتابخوان آنلاین" },
  ];

  const modules = [
    { title: "ماژول تنظیمات", desc: "امکان فروش محصولات", price: 300000 },
    { title: "ماژول سئو", desc: "پلتفرم خبرگذاری و اشتراک خبر", price: 150000 },
    { title: "ماژول شبکه اجتماعی", desc: "امکان فروش محصولات", price: 200000 },
    { title: "ماژول درگاه پرداخت", desc: "امکان فروش محصولات", price: 350000 },
    { title: "ماژول وبلاگ", desc: "امکان فروش محصولات", price: 350000 },
    { title: "ماژول پشتیبانی", desc: "امکان فروش محصولات", price: 350000 },
    { title: "ماژول فرم ساز", desc: "امکان فروش محصولات", price: 350000 },
    { title: "ماژول نظر و کامنت", desc: "امکان فروش محصولات", price: 350000 },
    { title: "ماژول ارسال پیامک", desc: "امکان فروش محصولات", price: 350000 },
    { title: "ماژول آنالیز", desc: "امکان فروش محصولات", price: 350000 },
  ];

  const toggleModule = (title: string) => {
    setSelectedModules((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const totalPrice = selectedModules.reduce((sum, title) => {
    const mod = modules.find((m) => m.title === title);
    return sum + (mod ? mod.price : 0);
  }, 0);

  const packageoptions = [
    { title: "توجه ویژه به (UI و UX)", desc: "طراحی توسط تیم تخصصی" },
    { title: "دریافت رایگان سورس کد", desc: "تحویل رایگان سورس کد پروژه" },
    {
      title: "توجه به سئو از ابتدای طراحی",
      desc: "طبق الگوریتم‌های بهینه سازی",
    },
    { title: "صفرتا‌صد کدنویسی اختصاصی", desc: "کدنویسی مطابق تکنولوژی روز" },
    { title: "ارائه نسخه هماهنگ با سایت", desc: "طراحی نسخه بهینه و سینک" },
    { title: "پشتیبانی یکساله رایگان", desc: "یکسال پشتیبانی فنی رایگان" },
  ];

  const toggleSelect = (title: string) => {
    setSelected((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleFinalSubmit = () => {
    setStep(3); // Move to form step
  };

  const handleBackFromForm = () => {
    setStep(2); // Go back to modules step
  };

  return (
    <section className="bg-[#f7f8fc] pb-4 w-full rounded-2xl mt-8 sm:mt-10 md:mt-12">
      <div className="max-w-[1250px] m-auto gap-4 sm:gap-6 flex flex-col lg:flex-row justify-center pt-6 sm:pt-8 md:pt-10">
        <div className="relative w-full lg:w-1/2 rounded-lg overflow-hidden">
          <div className="aspect-[10/1] flex flex-col items-center md:items-start justify-between">
            <Image
              className="py-2"
              width={180}
              height={150}
              src="/logos/logo.png"
              alt="logo"
              priority
            />
          </div>
          <h2 className="text-[#0364af] text-xl sm:text-2xl font-semibold mt-4 md:text-start text-center">
            انواع طراحی سایت
          </h2>
          <p className="text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base md:p-0 p-4 ">
            ما در هر پروژه طراحی سایت، ابتدا نیازهای فنی و محتوایی شما را بررسی
            کرده و سپس ساختار مناسبی را برای سایت پیشنهاد می‌کنیم. نتیجه این
            رویکرد، وب‌سایتی است که هم از نظر ظاهر حرفه‌ای است و هم از نظر فنی و
            سئو استاندارد و قابل اعتماد.
          </p>
          <div className="w-full mx-auto">
            <div className="">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:gap-3 sm:gap-4">
                {packageoptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => toggleSelect(item.title)}
                    className={`flex items-center p-2 sm:p-3 rounded-lg`}
                  >
                    <div className="w-[30%] sm:w-[25%] flex flex-col items-center md:items-start justify-between">
                      <Image
                        width={210}
                        height={150}
                        src="/web-design/web-orangecheckAsset 7.png"
                        alt="logo"
                        priority
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                      />
                    </div>

                    <div className="leading-tight">
                      <p className="text-xs sm:text-sm text-gray-800 font-medium">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:px-0 px-6 sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="bg-[#29b0cb] cursor-pointer py-2 px-2 sm:px-4 rounded-md w-full sm:w-40 text-white text-sm sm:text-md"
            >
              دریافت مشاوره
            </button>

            <ConsultationModal isOpen={open} onClose={() => setOpen(false)} />

            <Link href={"/about-us"}>
              <button className="bg-[#29b0cb] cursor-pointer py-2 px-2 sm:px-4 rounded-md w-full sm:w-40 text-white text-sm sm:text-md">
                درباره ما
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-1/2 mx-auto mt-6 lg:mt-0">
          <div className="bg-white rounded-2xl p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-4 sm:mb-6">
                    <motion.h3
                      className="text-[#0364af] text-lg font-semibold"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                    >
                    تعرفه و قیمت طراحی سایت
                    </motion.h3>
                    <motion.p
                      className="text-gray-600 text-xs sm:text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      مناسب ترین گزینه را برای کسب و کار خود انتخاب کنید
                    </motion.p>
                  </div>
                  <motion.div
                    key="step1-options"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    {options.map((item, index) => {
                      const isActive = activeOption === item.title;
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setActiveOption(item.title);
                            setStep(2);
                          }}
                          className={`flex items-center gap-3 p-3 rounded-lg  max-h-98 cursor-pointer  transition-all duration-300
                          ${
                            isActive
                              ? "border-[#0364af] bg-[#0364af]/5"
                              : "border-[#0364af]/40 hover:border-[#0364af]"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center border transition-all duration-300
                            ${
                              isActive
                                ? "bg-[#0364af] border-[#0364af]"
                                : "border-[#0364af] bg-white"
                            }`}
                          >
                            {isActive && (
                              <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </motion.svg>
                            )}
                          </div>

                          <div className="leading-tight">
                            <p className="text-sm text-[#0364af] font-medium">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-4"
                >
                  <p className="text-[#0364af] text-sm sm:text-base font-semibold text-center py-2">
                    ماژول‌های مورد نیاز برای {activeOption}
                  </p>

                  {/* Modules */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-98 overflow-y-auto">
                    {modules.map((mod, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => toggleModule(mod.title)}
                        className={`flex items-center gap-3 p-2 sm:p-3 rounded-lg cursor-pointer  transition-all duration-300 ${
                          selectedModules.includes(mod.title)
                            ? "border-[#0364af] bg-[#0364af]/10"
                            : "border-[#0364af]/30 hover:border-[#0364af]/50"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center border transition ${
                            selectedModules.includes(mod.title)
                              ? "bg-[#0364af] border-[#0364af]"
                              : "border-[#0364af] bg-white"
                          }`}
                        >
                          {selectedModules.includes(mod.title) && (
                            <motion.svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </motion.svg>
                          )}
                        </div>

                        <div className="leading-tight">
                          <p className="text-sm sm:text-sm text-[#0364af] font-medium">
                            {mod.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {mod.price.toLocaleString("fa-IR")} تومان
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Total Price */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200"
                  >
                    <p className="text-gray-600 text-sm">جمع کل:</p>
                    <p className="text-[#0364af] font-semibold text-base">
                      {totalPrice.toLocaleString("fa-IR")} تومان
                    </p>
                  </motion.div>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-between gap-3 mt-4"
                  >
                    <motion.button
                      onClick={() => {
                        setStep(1);
                        setSelectedModules([]);
                        setActiveOption(null);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm"
                    >
                      بازگشت
                    </motion.button>
                    <motion.button
                      onClick={handleFinalSubmit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#ff894f] text-white rounded-md px-4 py-2 text-sm"
                    >
                      ثبت نهایی
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Back button for form */}
                  <motion.button
                    onClick={handleBackFromForm}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 text-gray-600 mb-4 text-sm hover:text-gray-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    بازگشت به انتخاب ماژول
                  </motion.button>

                  {/* Web Design Form Component */}
                  <WebDesignForm
                    selectedModules={selectedModules}
                    activeOption={activeOption}
                    totalPrice={totalPrice}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
