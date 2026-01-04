import React from "react";
import Image from "next/image";
import { useState } from "react";
import ConsultationModal from "@/components/ConsultationModal";
import ClientsCarousel from "@/components/carousel/ClientsCarousel";
import SEO from "@/components/seo";

// Enhanced Schema for About Page
function generateAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "درباره وبوفن",
    description: "تیم متخصص وبوفن در زمینه طراحی سایت، توسعه سیستم‌های اختصاصی و ارائه راهکارهای دیجیتال مارکتینگ",
    url: "https://webofen.com/about-us",
    publisher: {
      "@type": "Organization",
      name: "وبوفن",
      url: "https://webofen.com",
      logo: "https://webofen.com/logo.png",
      description: "تیم متخصص طراحی سایت، توسعه سیستم‌های اختصاصی و ارائه راهکارهای دیجیتال مارکتینگ",
      foundingDate: "2023",
      areaServed: {
        "@type": "Country",
        name: "ایران"
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "تهران - سهروردی شمالی - کوچه مهاجر - پلاک 30",
        addressLocality: "تهران",
        addressCountry: "IR"
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+982188515914",
        email: "webofenco@gmail.com",
        availableLanguage: ["fa"]
      },
      sameAs: [
        "https://instagram.com/webofen",
        "https://t.me/webofenlearn"
      ],
      knowsAbout: [
        "طراحی سایت اختصاصی",
        "سیستم مدیریت محتوای اختصاصی (CMS)",
        "سئو و بهینه‌سازی سایت",
        "برنامه نویسی وب",
        "تجربه کاربری (UX)",
        "دیجیتال مارکتینگ"
      ],
      member: [
        {
          "@type": "OrganizationRole",
          roleName: "تیم طراحی",
          member: {
            "@type": "Person",
            name: "تیم طراحی وبوفن",
            jobTitle: "طراح رابط کاربری و تجربه کاربری"
          }
        },
        {
          "@type": "OrganizationRole",
          roleName: "تیم برنامه‌نویسی",
          member: {
            "@type": "Person",
            name: "تیم توسعه وبوفن",
            jobTitle: "برنامه‌نویس و توسعه‌دهنده"
          }
        },
        {
          "@type": "OrganizationRole",
          roleName: "تیم سئو و دیجیتال مارکتینگ",
          member: {
            "@type": "Person",
            name: "تیم سئو وبوفن",
            jobTitle: "متخصص سئو و بازاریابی دیجیتال"
          }
        }
      ]
    },
    mainEntity: {
      "@type": "Organization",
      name: "وبوفن",
      description: "وبوفن یک تیم متخصص در طراحی سایت، توسعه سیستم‌های اختصاصی و ارائه راهکارهای دیجیتال است. هدف ما ایجاد وب‌سایت‌هایی است که علاوه بر ظاهر حرفه‌ای، از نظر سرعت، امنیت، بهینه‌سازی و تجربه کاربری در بهترین سطح ممکن باشند.",
      foundingDate: "2023",
      areaServed: "ایران",
      knowsAbout: [
        "طراحی سایت",
        "دیجیتال مارکتینگ",
        "سئو",
        "برنامه نویسی وب",
        "تجربه کاربری",
      ],
      service: [
        {
          "@type": "Service",
          name: "طراحی سایت اختصاصی",
          description: "طراحی و توسعه وبسایت‌های اختصاصی با کدنویسی استاندارد",
        },
        {
          "@type": "Service",
          name: "سئو و بهینه‌سازی",
          description: "بهینه‌سازی سایت برای موتورهای جستجو",
        },
        {
          "@type": "Service",
          name: "دیجیتال مارکتینگ",
          description: "ارائه راهکارهای بازاریابی دیجیتال",
        },
      ],
    }
  };
}

// Generate Breadcrumb Schema
function generateBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "صفحه اصلی",
        item: "https://webofen.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "درباره ما",
        item: "https://webofen.com/about-us"
      }
    ]
  };
}

export default function AboutUs() {
  const [open, setOpen] = useState(false);

  const items = [
    {
      src: "/web-design/web-orangecheckAsset 7.png",
      title: "بیشترین رضایت مشتریان",
      text: "ما به کیفیت متعهدیم. پروژه‌ها تا زمان کسب رضایت کامل شما ادامه پیدا می‌کند و در تمام مراحل، گزارش‌های دقیق و شفاف ارائه می‌دهیم.",
    },
    {
      src: "/web-design/web-orangecheckAsset 7.png",
      title: "نیروهای مجرب و متخصص",
      text: "تیم وبوفن ترکیبی از طراحان، برنامه‌نویسان و متخصصان سئو است که هرکدام سال‌ها تجربه عملی در پروژه‌های مختلف دارند.",
    },
    {
      src: "/web-design/web-orangecheckAsset 7.png",
      title: "ارائه کد نویسی",
      text: " تمام پروژه‌های ما با کدنویسی استاندارد، قابل توسعه و بدون وابستگی به قالب‌های آماده تحویل داده می‌شود تا بتوانید در آینده هر امکاناتی را به سایت خود اضافه کنید.",
    },
    {
      src: "/web-design/web-orangecheckAsset 7.png",
      title: "پشتیبانی خدمات",
      text: " بعد از تحویل سایت تنها نیستید. ما پشتیبانی کامل، رفع مشکلات احتمالی، به‌روزرسانی‌ها و مشاوره‌های تخصصی را در تمام طول همکاری ارائه می‌دهیم.",
    },
  ];

  // Generate all schemas
  const aboutPageSchema = generateAboutPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();
  const allSchemas = [aboutPageSchema, breadcrumbSchema];

  return (
    <>
      <SEO
        title="درباره ما | تیم متخصص وبوفن در طراحی سایت و دیجیتال مارکتینگ"
        description="وبوفن یک تیم متخصص در طراحی سایت، توسعه سیستم‌های اختصاصی و ارائه راهکارهای دیجیتال. با سال‌ها تجربه در طراحی وبسایت‌های حرفه‌ای و سئو."
        keywords="درباره وبوفن, تیم طراحی سایت, متخصص سئو, دیجیتال مارکتینگ, طراحی وبسایت, درباره ما, تیم وبوفن"
        canonical="https://webofen.com/about-us"
        ogType="website"
        ogImage="https://webofen.com/images/og-about.jpg"
        structuredData={allSchemas} // ✅ Pass schemas here, not separate script tag
        section="درباره ما"
        tags={["درباره وبوفن", "تیم طراحی سایت", "تخصص طراحی وب", "خدمات سئو", "تیم ایرانی"]}
      />

      {/* REMOVED THE SEPARATE SCRIPT TAG - SEO component handles it */}

      <main>
        {/* Breadcrumb Navigation */}
        <div className="max-w-[1250px] m-auto px-4 py-3">
          <nav className="text-sm text-gray-600" aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <a href="/" className="hover:text-[#29b0cb] transition-colors">
                  صفحه اصلی
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-[#0364af] font-medium" aria-current="page">
                درباره ما
              </li>
            </ol>
          </nav>
        </div>

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
                      وبوفن یک تیم متخصص در طراحی سایت، توسعه سیستم‌های اختصاصی
                      و ارائه راهکارهای دیجیتال است. هدف ما ایجاد وب‌سایت‌هایی
                      است که علاوه بر ظاهر حرفه‌ای، از نظر سرعت، امنیت،
                      بهینه‌سازی و تجربه کاربری در بهترین سطح ممکن باشند.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="bg-[#29b0cb] cursor-pointer mt-6 py-2 px-2 sm:px-4 rounded-md w-full sm:w-40 text-white text-sm sm:text-md"
                >
                  دریافت مشاوره
                </button>

                <ConsultationModal
                  isOpen={open}
                  onClose={() => setOpen(false)}
                />
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
          <div className="md:max-w-[1250px] w-full m-auto md:py-20 px-4">
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

        <section className="md:block hidden">
          <ClientsCarousel />
        </section>

        {/* Responsibility Section */}
        <section className="pb-4 w-full">
          <div className="max-w-[1250px] m-auto flex flex-col md:flex-row justify-center md:py-20 px-4 gap-10">
            {/* Left content */}
            <div className="relative w-full md:w-[60%] rounded-lg overflow-visible mt-2">
              <div className="relative">
                <div className="md:my-2 mt-10 mb-4">
                  <p className="text-[#0364af] text-lg ">وبوفن</p>
                  <h2 className="text-[#6fd6e5] text-xl  mt-2">
                    مسئولیت اجتمایی
                  </h2>
                </div>

                <div className="relative w-full md:w-5/6">
                  <div>
                    <p className="text-gray-600 leading-8">
                      وبوفن تنها به رشد دیجیتال کسب‌وکارها فکر نمی‌کند. ما خود
                      را نسبت به جامعه و محیطی که در آن زندگی می‌کنیم مسئول
                      می‌دانیم. بخشی از فعالیت‌های ما در زمینه کمک‌های
                      انسان‌دوستانه، حمایت از کودکان و مشارکت در برنامه‌های
                      خیریه انجام می‌شود. ما باور داریم که تاثیرگذاری واقعی فقط
                      در موفقیت شغلی نیست؛ بلکه در بهبود زندگی دیگران معنا پیدا
                      می‌کند.
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
    </>
  );
}