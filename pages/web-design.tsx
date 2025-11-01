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
    { title: "طراحی سایت رستوران", desc: "سفارش آنلاین غذا و خواراکی" },
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
        <div className="max-w-[1250px] m-auto flex justify-center">
          <div className="relative w-1/2  md:w-[60%] rounded-lg overflow-hidden">
            <div className="mt-40">
              <h1 className="text-[#0364af] text-4xl font-semibold">
                طراحی سایت شما
              </h1>
              <p className="text-[#0364af] text-3xl font-semibold mt-3">
                با <span className="text-[#29b0cb]">cms ما </span> دیده شوید
              </p>
              <p className="text-gray-600 w-2/3 mt-6">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
                استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه وس
                مجله کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت
                سیبت
              </p>
              <button className="bg-[#29b0cb] tex-md rounded-md py-1 px-2 mt-6">
                دریافت مشاوره
              </button>
            </div>
          </div>
          <div className="relative w-1/2 mx-auto md:w-[40%] aspect-[12/12] rounded-lg overflow-hidden">
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
      <section className="max-w-[1250px] m-auto mt-10 md:mt-20">
        <div className="flex flex-col lg:flex-row gap-8 justify-center mx-auto items-centerY">
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
          <div className="w-full lg:w-7/12">
            {/* Title + Icon */}
            <div className="flex items-start">
              <div className="mr-4">
                <h1 className="text-[#0364af] text-lg md:text-lg">
                  طراحی سایت
                </h1>
                <div className="flex flex-wrap items-center text-sm md:text-lg">
                  <p className="text-[#0364af] text-2xl mt-2">
                    <span className="text-[#29b0cb]">cms</span> اختصاصی سایت{" "}
                  </p>
                </div>
                <p className="text-gray-600 mt-6">
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
            <div className="grid grid-cols-6 gap-2 min-h-[100px] mt-10">
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
      <section className="bg-[#f7f8fc] pb-4 w-full rounded-2xl mt-10">
        <div className="max-w-[1250px] m-auto gap-6 flex justify-center pt-10">
          <div className="relative w-1/2  rounded-lg overflow-hidden">
            <div className="aspect-[10/1] flex flex-col items-center md:items-start justify-between">
              <Image
                width={210}
                height={150}
                src="/homepage/logo.png"
                alt="logo"
                priority
              />
            </div>
            <h1 className="text-[#0364af] text-2xl font-semibold">
              پکیج های طراحی سایت
            </h1>

            <p className="text-gray-600 mt-6">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
              استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله
              در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد
            </p>
            <div className="w-full mx-auto">
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packageoptions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => toggleSelect(item.title)}
                      className={`flex items-center gap-3 p-3 rounded-lg`}
                    >
                      <div className="w-[25%] flex flex-col items-center md:items-start justify-between">
                        <Image
                          width={210}
                          height={150}
                          src="/web-design/web-orangecheckAsset 7.png"
                          alt="logo"
                          priority
                        />
                      </div>

                      <div className="leading-tight">
                        <p className="text-sm text-gray-800 font-medium">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button className="bg-[#29b0cb] py-2 px-2 rounded-md w-40 text-white">
                دریافت مشاوره
              </button>
              <button className="bg-[#29b0cb] py-2 px-2 rounded-md w-40 text-white">
                درباره ما
              </button>
            </div>
          </div>
          <div className="w-full md:w-3/4 lg:w-1/2 mx-auto">
            <div className="bg-white rounded-2xl p-6">
              <div className="text-center mb-6">
                <p className="text-[#0364af] text-lg font-semibold">
                  سایتت را انتخاب کن
                </p>
                <p className="text-gray-600 text-sm">
                  لورم ایپسوم متن ساختگی با تولید سادگی
                </p>
              </div>

              <form className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => toggleSelect(item.title)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition`}
                  >
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center border transition 
                  ${
                    selected.includes(item.title)
                      ? "bg-[#0364af] border-[#0364af]"
                      : "border-[#0364af] bg-white"
                  }`}
                    >
                      {selected.includes(item.title) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5 text-white"
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
                      <p className="text-sm text-[#0364af] font-medium">
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
        <div className="max-w-[1250px] m-auto pt-10">
          <div className="text-center mb-10">
            <p className="text-[#29b0cb] text-2xl">
              {" "}
              <span className="text-[#253e5f]">نمونه کار </span>طراحی سایت
            </p>
            <p className="text-gray-700 text-sm mt-2">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوما
            </p>
          </div>
          <Resume />
        </div>
      </section>
      <section>
        <div className="w-11/12 m-auto pt-10">
          <div className="relative mx-auto aspect-[19/6] rounded-lg overflow-hidden">
            <Image
              src="/web-design/web-techAsset 13.png"
              alt="کلینیک تخصصی سئو وبوفن - خدمات سئو و بهینه‌سازی سایت"
              fill
              className="object-contain"
              priority
            />
          </div>        </div>
      </section>
    </main>
  );
}
