import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Resume from "@/components/resume/resume";
export default function WebDesign() {
  const [selected, setSelected] = useState<string[]>([]);

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
    <main>
      <section className="bg-[#f7f8fc] pb-4 w-full rounded-2xl">
        <div className="max-w-[1250px] m-auto flex flex-col lg:flex-row justify-center md:p-0 px-4">
          <div className="relative w-full lg:w-1/2 xl:w-[60%] rounded-lg overflow-hidden">
            <div className="mt-8 sm:mt-12 md:mt-20 lg:mt-40">
              <h1 className="text-[#0364af] text-2xl sm:text-3xl md:text-4xl font-semibold">
                طراحی سایت شما
              </h1>
              <p className="text-[#0364af] text-xl sm:text-2xl md:text-3xl font-semibold mt-2 sm:mt-3">
                با <span className="text-[#29b0cb]">cms ما </span> دیده شوید
              </p>
              <p className="text-gray-600 w-full lg:w-2/3 mt-4 sm:mt-6 text-sm sm:text-base">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
                استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه وس
                مجله کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت
                سیبت
              </p>

              <button className="bg-[#29b0cb] cursor-pointer text-white text-sm sm:text-md rounded-md py-1 sm:py-2 px-4 sm:px-6 mt-4 sm:mt-6 hover:bg-[#1e99b2] transition-all">
                دریافت مشاوره
              </button>
            </div>
          </div>
          <div className="relative w-full lg:w-1/2 xl:w-[40%] mx-auto aspect-[12/12] rounded-lg overflow-hidden mt-6 lg:mt-0">
            <Image
              src="/web-design/web-heroAsset 11.png"
              alt="کلینیک تخصصی سئو وبوفن - خدمات سئو و بهینه‌سازی سایت"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>
      <section className="max-w-[1250px] m-auto mt-8 sm:mt-12 md:mt-20 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 justify-center mx-auto items-centerY">
          {/* Left Image */}
          <div className="w-full lg:w-5/12">
            <div className="relative aspect-[16/12] md:aspect-[13/10]">
              <Image
                src="/web-design/web-videocover1Asset 13.png"
                alt="متخصصان سئو وبوفن - دکتر مجتبی خداخواه"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Text Content */}
          <div className="w-full lg:w-7/12 mt-6 lg:mt-0">
            {/* Title + Icon */}
            <div className="flex items-start">
              <div className="md:mr-4">
                <h1 className="text-[#0364af] text-base sm:text-lg md:text-lg">
                  طراحی سایت
                </h1>
                <div className="flex flex-wrap items-center text-sm md:text-lg">
                  <p className="text-[#0364af] text-xl sm:text-2xl mt-2">
                    <span className="text-[#29b0cb]">cms</span> اختصاصی سایت{" "}
                  </p>
                </div>
                <p className="text-gray-600 mt-4 sm:mt-6 text-sm sm:text-base">
                  لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و
                  با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و
                  مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی
                  تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای
                  کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و
                  آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم
                  افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص
                  طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد قرار گیرد.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2 min-h-[80px] sm:min-h-[100px] mt-6 sm:mt-8 md:mt-10">
              <div className="relative mx-auto aspect-[1] rounded-lg overflow-hidden">
                <Image
                  src="/web-design/web-videocover2Asset 15.png"
                  alt="متخصصان سئو وبوفن - دکتر مجتبی خداخواه"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative mx-auto aspect-[1] rounded-lg overflow-hidden">
                <Image
                  src="/web-design/web-videocover3Asset 16.png"
                  alt="متخصصان سئو وبوفن - دکتر مجتبی خداخواه"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
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

              <form className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => toggleSelect(item.title)}
                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition`}
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center border transition 
                  ${
                    selected.includes(item.title)
                      ? "bg-[#0364af] border-[#0364af]"
                      : "border-[#0364af] bg-white"
                  }`}
                    >
                      {selected.includes(item.title) && (
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
                      <p className="text-xs sm:text-sm text-[#0364af] font-medium">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </form>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-[1250px] m-auto pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <p className="text-[#29b0cb] text-xl sm:text-2xl">
              {" "}
              <span className="text-[#253e5f]">نمونه کار </span>طراحی سایت
            </p>
            <p className="text-gray-700 text-xs sm:text-sm mt-1 sm:mt-2">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوما
            </p>
          </div>
          <Resume />
        </div>
      </section>
      <section>
        <div className="w-11/12 m-auto pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:px-8">
          <div className="relative mx-auto aspect-[19/6] rounded-lg overflow-hidden">
            <Image
              src="/web-design/web-techAsset 13.png"
              alt="کلینیک تخصصی سئو وبوفن - خدمات سئو و بهینه‌سازی سایت"
              fill
              className="object-contain"
              priority
            />
          </div>        
        </div>
      </section>
    </main>
  );
}