import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function WebDesign() {
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
        <div className="max-w-[1250px] m-auto flex justify-cente pt-10">
          <div className="relative w-1/2  rounded-lg overflow-hidden">
            <div className="aspect-[15/1] flex flex-col items-center md:items-start justify-between">
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
              نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد،
            </p>
          </div>
          <div className=" w-1/2 mx-auto">
            <div className="bg-white rounded-xl">
              <div className="text-center">
                <p className="text-[#0364af]">سایتت را انتخاب کن</p>
                <p className="text-gray-600">
                  لورم ایپسوم متن ساختگی با تولید سادگی
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
