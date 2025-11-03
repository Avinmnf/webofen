import React from "react";
import Image from "next/image";

export default function AboutUs() {
  const items = [
    {
      src: "/web-design/web-orangecheckAsset 7.png",
      title: "بیشترین رضایت مشتریان",
      text: " تخصصی وب‌سایت شما پشتیبانی کامل و ارائه گزارش‌های دقیق و یشسی سی سی سیسیس بهینه‌سازی تخصصی وب‌سایت شما برای رشد واقعی در گوگل",
    },
    {
      src: "/web-design/web-orangecheckAsset 7.png",
      title: "نیروهای مجرب و متخصص",
      text: " تخصصی وب‌سایت شما پشتیبانی کامل و ارائه گزارش‌های دقیق و یشسی سی سی سیسیس بهینه‌سازی تخصصی وب‌سایت شما برای رشد واقعی در گوگل",
    },
    {
      src: "/web-design/web-orangecheckAsset 7.png",
      title: "ارائه کد نویسی",
      text: " تخصصی وب‌سایت شما پشتیبانی کامل و ارائه گزارش‌های دقیق و یشسی سی سی سیسیس بهینه‌سازی تخصصی وب‌سایت شما برای رشد واقعی در گوگل",
    },
    {
      src: "/web-design/web-orangecheckAsset 7.png",
      title: "پشتیبانی خدمات",
      text: " تخصصی وب‌سایت شما پشتیبانی کامل و ارائه گزارش‌های دقیق و یشسی سی سی سیسیس بهینه‌سازی تخصصی وب‌سایت شما برای رشد واقعی در گوگل",
    },
  ];

  return (
    <main>
      <section className="bg-[#f7f8fc] pb-4 w-full rounded-2xl">
        <div className="max-w-[1250px] m-auto flex flex-col md:flex-row justify-center md:py-20 py-5 px-4 gap-10">
          {/* Left content */}
          <div className="relative w-full md:w-[60%] rounded-lg overflow-visible">
            <div className="relative">
              <h1 className="text-[#0364af] text-4xl font-semibold">
                درباره ما
              </h1>

              {/* Container for gray box and SVG */}
              <div className="relative mt-10 w-full md:w-5/6">
                {/* SVG positioned above gray box */}
                <svg
                  className="absolute -top-5 right-8 w-12 h-12 z-10"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 75.8 54.52"
                >
                  <g data-name="Layer 1">
                    <g>
                      <path
                        fill="#29b0cb"
                        d="M61.9,31.34c-2.32,0-4.62.29-6.82-.05-6.5-1.01-10.92-4.78-12.75-11.09-1.8-6.19-.19-11.72,4.64-16C51.95-.22,57.74-.93,63.83,1.64c8.26,3.49,12.93,12.14,11.81,21.38-.86,7.04-3.99,13.03-8.38,18.45-4.08,5.04-8.95,9.16-14.57,12.39-.25.14-.5.39-.76.41-.71.05-1.69.26-2.05-.1-.36-.36-.37-1.5-.07-2.03,2.41-4.27,4.94-8.48,7.41-12.71,1.61-2.75,3.2-5.52,4.69-8.08Z"
                      />
                      <path
                        fill="#29b0cb"
                        d="M20.25,31.13c-2.39,0-4.8.32-7.09-.06-6.44-1.07-10.75-4.92-12.49-11.18-1.73-6.2-.07-11.72,4.8-15.95C10.45-.39,16.21-1.07,22.22,1.5c8.52,3.64,13.15,12.55,11.7,22.11-1.3,8.53-5.73,15.37-11.6,21.41-3.47,3.57-7.42,6.55-11.78,8.98-.79.44-1.6.88-2.38.06-.77-.81-.33-1.62.13-2.39,3.66-6.24,7.32-12.48,10.98-18.72.38-.65.72-1.33.98-1.82Z"
                      />
                    </g>
                  </g>
                </svg>

                {/* Gray box */}
                <div className="bg-[#e8e8e8] rounded-2xl p-8 relative">
                  <p className="text-gray-600 leading-8">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و
                    با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه
                    و مجله کتاب‌های زیادی در شصت و سه درصد گذشته حال و آینده،
                    شناخت.
                  </p>
                </div>
              </div>

              <button className="bg-[#29b0cb] text-white tex-md rounded-md py-1 px-6 mt-6 hover:bg-[#1e99b2] transition-all">
                دریافت مشاوره
              </button>
            </div>
          </div>

          {/* Right image grid */}
          <div className="w-full md:w-[40%] grid grid-cols-2 sm:grid-cols-3 gap-6 md:mt-0">
            {[
              "/about-us/about-us-person1Asset 10.png",
              "color-#0364af",
              "/about-us/about-us-person1Asset 11.png",
              "color-#0364af",
              "/about-us/about-us-person1Asset 12.png",
              "color-#0364af",
            ].map((item, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-3xl overflow-hidden"
              >
                {item.startsWith("color-") ? (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: item.replace("color-", "") }}
                  />
                ) : (
                  <Image
                    src={item}
                    alt={`About us person ${i + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="pb-4 w-full">
        <div className="md:max-w-[1250px] w-full m-auto py-20 px-4">
          <div className="mb-12 text-center md:text-start">
            <p className="text-[#0364af] text-lg ">وبوفن</p>
            <h2 className="text-[#6fd6e5] text-3xl  mt-2">چرا ما ؟</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 justify-between">
            {items.map((item, i) => (
              <div
                key={i}
                className="gap-4 bg-white w-full sm:w-[48%] md:w-[23%] rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative w-14 h-14">
                    <Image
                      src={item.src}
                      alt={`Why us ${i + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-[#253e5f] leading-relaxed text-sm">
                    {item.title}
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm mr-2">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
<section>
  <div className="w-11/12 m-auto">
    <div className="relative mx-auto aspect-[22/10] rounded-lg overflow-hidden">
      <Image
        src="/about-us/about-us-costumersAsset 27.png"
        alt="کلینیک تخصصی سئو وبوفن - خدمات سئو و بهینه‌سازی سایت"
        fill
        className="object-contain"
        priority
      />
      <p className="absolute inset-0 flex top-20 justify-center text-white text-2xl font-bold">
         مشتریان <span className="text-[#29b0cb] mr-1"> وبوفن </span>
      </p>
    </div>
  </div>
</section>

      {/* Responsibility Section */}
      <section className="pb-4 w-full">
        <div className="max-w-[1250px] m-auto flex flex-col md:flex-row justify-center py-20 px-4 gap-10">
          {/* Left content */}
          <div className="relative w-full md:w-[60%] rounded-lg overflow-visible mt-2">
            <div className="relative">
              <div className="mb-2">
                <p className="text-[#0364af] text-lg ">وبوفن</p>
                <h2 className="text-[#6fd6e5] text-xl  mt-2">
                  مسئولیت اجتمایی
                </h2>
              </div>

              <div className="relative w-full md:w-5/6">
                <div>
                  <p className="text-gray-600 leading-8">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و
                    با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه
                    و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی
                    تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[40%] grid grid-cols-4 gap-4 md:mt-0">
            {[
              "/about-us/about-us-donateAsset 15.png",
              "/about-us/about-us-donate2Asset 17.png",
              "/about-us/about-us-donate3Asset 22.png",
              "/about-us/about-us-donate4Asset 24.png",
            ].map((src, i) => (
              <div
                key={i}
                className="relative aspect-[6/17] rounded-3xl overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`About us image ${i + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
