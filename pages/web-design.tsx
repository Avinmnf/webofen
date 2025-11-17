import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Resume from "@/components/resume/resume";
import WebDesignModule from "@/components/webdesign/webdesignmodule";
import ConsultationModal from "@/components/ConsultationModal";
export default function WebDesign() {
  const [open, setOpen] = useState(false);
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

<button
  type="button"
  onClick={() => setOpen(true)}
  className="bg-[#29b0cb] cursor-pointer text-white text-sm sm:text-md rounded-md py-1 sm:py-2 px-4 sm:px-6 mt-4 sm:mt-6 hover:bg-[#1e99b2] transition-all"
>
  دریافت مشاوره
</button>


              <ConsultationModal isOpen={open} onClose={() => setOpen(false)} />
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
                />
              </div>
              <div className="relative mx-auto aspect-[1] rounded-lg overflow-hidden">
                <Image
                  src="/web-design/web-videocover3Asset 16.png"
                  alt="متخصصان سئو وبوفن - دکتر مجتبی خداخواه"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <WebDesignModule />
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
            />
          </div>
        </div>
      </section>
    </main>
  );
}
