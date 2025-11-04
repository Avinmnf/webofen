import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import WebDesignForm from "../webdesignform";
export default function WebDesignModule() {
      const [selected, setSelected] = useState<string[]>([]);
      const [activeOption, setActiveOption] = useState<string | null>(null);
      const [selectedModules, setSelectedModules] = useState<string[]>([]);
      const [step, setStep] = useState<1 | 2>(1);


  const options = [
    { title: "طراحی سایت فروشگاهی", desc: "امکان فروش محصولات" },
    { title: "طراحی سایت گردشگری", desc: "خدمات سفر، راهنما تور و گردشگری" },
    { title: "طراحی سایت خبری", desc: "پلتفرم خبرگزاری و اشتراک خبر" },
    { title: "طراحی سایت خدماتی", desc: "ارائه خدمات به کاربران اینترنتی" },
    { title: "طراحی سایت آموزشی", desc: "آموزش آنلاین در بستر دیجیتال" },
    { title: "طراحی سایت شرکتی", desc: "معرفی محصولات و خدمات شرکتی" },
    { title: "طراحی سایت رستوران", desc: "سفارش آنلاین غذا و خوراکی" },
    { title: "طراحی سایت املاک", desc: "فروش و اجاره املاک و مستغلات" },
    { title: "طراحی سایت پزشکی", desc: "ارائه خدمات پزشکی و نوبت دهی آنلاین" },
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

    return (
 <section className="bg-[#f7f8fc] pb-4 w-full rounded-2xl mt-8 sm:mt-10 md:mt-12">
        <div className="max-w-[1250px] m-auto gap-4 sm:gap-6 flex flex-col lg:flex-row justify-center pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8">
          <div className="relative w-full lg:w-1/2 rounded-lg overflow-hidden">
            <div className="aspect-[10/1] flex flex-col items-center md:items-start justify-between">
              <Image
                width={210}
                height={150}
                src="/homepage/logo.png"
                alt="logo"
                priority
                className="w-32 sm:w-40 md:w-48 lg:w-52 xl:w-60"
              />
            </div>
            <h1 className="text-[#0364af] text-xl sm:text-2xl font-semibold mt-4 md:text-start text-center">
              پکیج های طراحی سایت
            </h1>

            <p className="text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
              استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله
              در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10">
              <button className="bg-[#29b0cb] py-2 px-2 sm:px-4 rounded-md w-full sm:w-40 text-white text-sm sm:text-md">
                دریافت مشاوره
              </button>
              <button className="bg-[#29b0cb] py-2 px-2 sm:px-4 rounded-md w-full sm:w-40 text-white text-sm sm:text-md">
                درباره ما
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 mx-auto mt-6 lg:mt-0">
            <div className="bg-white rounded-2xl p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-[#0364af] text-lg font-semibold">
                  سایتت را انتخاب کن
                </p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  لورم ایپسوم متن ساختگی با تولید سادگی
                </p>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
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
                            setStep(2); // go to next step
                          }}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer  transition-all duration-300
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
                    <p className="text-[#0364af] text-sm sm:text-base font-semibold text-center sm:text-start">
                      ماژول‌های مورد نیاز برای {activeOption}
                    </p>

                    {/* Modules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {modules.map((mod, index) => (
                        <div
                          key={index}
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>

                          <div className="leading-tight">
                            <p className="text-sm sm:text-sm text-[#0364af] font-medium">
                              {mod.title}
                            </p>
                            <p className="text-xs sm:text-sm text-[#0364af] font-medium">
                              {mod.desc}
                            </p>
                            <p className="text-xs text-gray-500">
                              {mod.price.toLocaleString("fa-IR")} تومان
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <p className="text-gray-600 text-sm">جمع کل:</p>
                      <p className="text-[#0364af] font-semibold text-base">
                        {totalPrice.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-3 mt-4">
                      <button
                        onClick={() => {
                          setStep(1);
                          setSelectedModules([]);
                        }}
                        className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm"
                      >
                        بازگشت
                      </button>
                      <button className="bg-[#0364af] text-white rounded-md px-4 py-2 text-sm">
                        ثبت نهایی
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    );
}