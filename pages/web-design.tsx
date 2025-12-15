import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Resume from "@/components/resume/resume";
import WebDesignModule from "@/components/webdesign/webdesignmodule";
import ConsultationModal from "@/components/ConsultationModal";
import SEO from "@/components/seo";

const SITE_URL = "https://webofen.com";

// اسکیما برای صفحه طراحی سایت
function generateWebDesignSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "طراحی سایت اختصاصی با CMS",
    description:
      "طراحی سایت حرفه‌ای با CMS اختصاصی، سریع، امن و قابل توسعه برای کسب‌وکارهای ایرانی",
    provider: {
      "@type": "Organization",
      name: "وبوفن",
      description: "تیم متخصص طراحی سایت و دیجیتال مارکتینگ",
    },
    areaServed: "IR",
    serviceType: "طراحی سایت",
    offers: {
      "@type": "Offer",
      description: "طراحی سایت اختصاصی با CMS شخصی‌سازی شده",
    },
  };
}

// اسکیما برای FAQ صفحه طراحی سایت

export default function WebDesign() {
  const [open, setOpen] = useState(false);

  // تولید اسکیماها
  const webDesignSchema = generateWebDesignSchema();

  return (
    <>
      <SEO
        title="طراحی سایت اختصاصی با CMS | تیم متخصص وبوفن"
        description="طراحی سایت حرفه‌ای با CMS اختصاصی، سریع، امن و قابل توسعه. سیستم مدیریت محتوای شخصی‌سازی شده برای رشد کسب‌وکار شما"
        keywords="طراحی سایت, CMS اختصاصی, طراحی وبسایت, سیستم مدیریت محتوا, سایت اختصاصی, برنامه نویسی سایت"
        canonical="https://webofen.com/web-design"
        ogType="website"
        ogImage="https://webofen.com/images/og-web-design.jpg"
      />

      {/* Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webDesignSchema) }}
      />

      <main>
        <section className="bg-[#f7f8fc] pb-4 w-full rounded-2xl">
          <div className="max-w-[1250px] m-auto flex flex-col lg:flex-row justify-center md:p-0 px-4">
            <div className="relative w-full lg:w-1/2 xl:w-[60%] rounded-lg overflow-hidden">
              <div className="mt-8 sm:mt-12 md:mt-20 lg:mt-40">
                <h1 className="text-[#0364af] text-2xl sm:text-3xl md:text-4xl font-semibold">
                  طراحی سایت
                </h1>
                <p className="text-[#0364af] text-xl sm:text-2xl md:text-3xl font-semibold mt-2 sm:mt-3">
                  با <span className="text-[#29b0cb]">cms ما </span> دیده شوید
                </p>
                <p className="text-gray-600 w-full lg:w-2/3 mt-4 sm:mt-6 text-sm sm:text-base">
                  برای اینکه کسب‌وکارتان دیده شود، به سایتی نیاز دارید که سریع،
                  حرفه‌ای و قابل اعتماد باشد. ما با طراحی سایت و CMS اختصاصی،
                  امکان مدیریت کامل سایت را بدون نیاز به دانش فنی برای شما فراهم
                  می‌کنیم. تمرکز شما فقط روی رشد کسب‌وکار خواهد بود؛ باقی کار را
                  ما انجام می‌دهیم.
                </p>

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="bg-[#29b0cb] cursor-pointer text-white text-sm sm:text-md rounded-md py-1 sm:py-2 px-4 sm:px-6 mt-4 sm:mt-6 hover:bg-[#1e99b2] transition-all"
                >
                  دریافت مشاوره
                </button>

                <ConsultationModal
                  isOpen={open}
                  onClose={() => setOpen(false)}
                />
              </div>
            </div>
            <div className="relative w-full lg:w-1/2 xl:w-[40%] mx-auto aspect-[12/12] rounded-lg overflow-hidden mt-6 lg:mt-0">
              <Image
                src="/web-design/web-heroAsset 11.png"
                alt="طراحی سایت اختصاصی با CMS - وبوفن"
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
                  alt="سیستم مدیریت محتوای اختصاصی - وبوفن"
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
                  <div className="flex flex-wrap items-center text-sm md:text-lg">
                    <h2 className="text-[#0364af] text-xl sm:text-2xl mt-2">
                      خدمات ما در{" "}
                      <span className="text-[#29b0cb]">طراحی سایت</span>
                    </h2>
                  </div>
                  <p className="text-gray-600 mt-4 text-sm sm:text-base">
                    ما وب‌سایت‌هایی طراحی می‌کنیم که فقط زیبا نیستند، بلکه
                    دقیقاً بر اساس اهداف کسب‌وکار شما ساخته شده‌اند. از طراحی
                    رابط کاربری مدرن و تجربه کاربری حرفه‌ای گرفته تا پیاده‌سازی
                    فنی بهینه، سریع و سازگار با سئو، همه‌چیز به‌صورت اختصاصی
                    انجام می‌شود. وب‌سایت شما مقیاس‌پذیر، امن و آماده رشد است و
                    به‌گونه‌ای توسعه داده می‌شود که در آینده نیز بتوان آن را
                    بدون محدودیت ارتقا داد.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2 min-h-[80px] sm:min-h-[100px] mt-6 sm:mt-8 md:mt-10">
                <div className="relative mx-auto aspect-[1] rounded-lg overflow-hidden">
                  <Image
                    src="/web-design/web-videocover2Asset 15.png"
                    alt="امکانات CMS اختصاصی - وبوفن"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative mx-auto aspect-[1] rounded-lg overflow-hidden">
                  <Image
                    src="/web-design/web-videocover3Asset 16.png"
                    alt="مدیریت آسان محتوا - وبوفن"
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
          <div className="max-w-[1250px] m-auto pt-6 sm:pt-8 md:pt-10">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-[#29b0cb] text-xl sm:text-2xl">
                <span className="text-[#253e5f]">نمونه کار </span>طراحی سایت
              </h2>
              <p className="text-gray-700 text-xs sm:text-sm mt-1 sm:mt-2">
                بخشی از نمونه های طراحی سایت توسط تیم ما
              </p>
            </div>
            <Resume />
          </div>
        </section>
        <section>
          <div className="max-w-[1250px] m-auto pt-6 sm:pt-8 md:pt-10 hidden md:block">
            <div className="relative mx-auto aspect-[19/6] overflow-hidden rounded-2xl">
              {/* Image */}
              <Image
                src="/web-design/technology.png"
                alt="تکنولوژی‌های مورد استفاده در طراحی سایت - وبوفن"
                fill
                className="object-contain"
              />

              {/* Overlay */}
              <div className="absolute text-center inset-0 top-14 right-0">
                <h2 className="text-white text-lg md:text-2xl font-bold">
                  تکنولوژی‌های <span className="text-[#29b0cb]">وبوفن</span>
                </h2>
                <p className="mt-2 text-gray-200 text-sm sm:text-base">
                  تکنولوژی‌های روز، پشتوانه‌ی نرم‌افزارهای ما
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
