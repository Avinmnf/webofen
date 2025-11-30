import React, { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Autoplay,
  Pagination,
  Mousewheel,
} from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface Collaboration {
  id: number;
  domain: string;
  logo: string;
  name: string;
  description: string;
  process: string[];
  screenshots: string[];
}

export default function CollaborationShowcase() {
  const [selectedProject, setSelectedProject] = useState<Collaboration | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const collaborations: Collaboration[] = [
    {
      id: 1,
      logo: "/web-design/web-resume1Asset 8.png",
      name: "ﺻﻨﺪوق ﺗﻮﺳﻌﻪ ﻓﻨﺎوریﻫﺎی ﻧﻮﯾﻦ",
      domain: "htdf",
      description: "طراحی سایت و سامانه برای خدمات مالی و رفاهی",
      process: [
        "تحلیل نیازمندی‌ها و برنامه‌ریزی استراتژی",
        "طراحی UX/UI و نمونه‌سازی اولیه",
        "توسعه فرانت‌اند ریسپانسیو",
        "یکپارچه‌سازی بک‌اند و API",
        "تست کیفیت و راه‌اندازی",
      ],
      screenshots: ["/resume/htdf/htdf.png"],
    },
    {
      id: 2,
      logo: "/web-design/web-resume2Asset 9.png",
      name: "پایاپای",
      domain: "payapay",
      description: "ساخت کانسپت و طراحی سایت ",
      process: [
        "تحلیل هویت برند و تحقیقات بازار",
        "طراحی موبایل فرست",
        "توسعه فروشگاه اینترنتی",
        "یکپارچه‌سازی درگاه پرداخت",
        "بهینه‌سازی موتورهای جستجو",
      ],
      screenshots: ["/resume/payapay/payapay.png"],
    },
    {
      id: 3,
      logo: "/web-design/web-resume3Asset 10.png",
      name: "زنجان",
      domain: "zanjan",
      description:
        "سایت برای ارائه خدمات مالی و اعتباری",
      process: [
        "تحلیل رقبا و بازار",
        "نمونه‌سازی تعاملی",
        "توسعه سیستم مدیریت محتوا",
        "راه‌اندازی پنل مشتریان",
        "بهینه‌سازی عملکرد",
      ],
      screenshots: ["/resume/zanjan/zanjan.png"],
    },
    {
      id: 4,
      logo: "/web-design/web-resume1Asset 8.png",
      name: "حسابداری استورم  ",
      domain: "storm",
      description:
        "پلتفرم حسابداری ابری",
      process: [
        "تحقیقات کاربر و پرسوناسازی",
        "وایرفریمینگ و طراحی بصری",
        "یکپارچه‌سازی واقعیت افزوده",
        "موتور پیشنهاد هوشمند",
        "تست چند پلتفرمی",
      ],
      screenshots: ["/resume/storm/Storm.jpg"],
    },
  ];

  // Helper functions for screenshot titles and descriptions in Farsi
  const getScreenshotTitle = (projectName: string, index: number) => {
    const titles: { [key: string]: string[] } = {
      "وال کیف": ["داشبورد مدیریت", "پیگیری مسیرها", "آنالیز عملکرد"],
      "گرین لایف": ["صفحه محصولات", "سبد خرید", "وبلاگ آموزشی"],
      "اینوویت لبز": ["نمونه کارها", "خدمات تخصصی", "تماس با ما"],
      "اوربن استایل": ["کاتالوگ محصول", "پروفایل کاربر", "پرداخت امن"],
    };

    return titles[projectName]?.[index] || `صفحه ${index + 1}`;
  };

  // Process descriptions for each project
  const getProcessDescription = (projectName: string) => {
    const descriptions: { [key: string]: string } = {
      واکلیف:
        "فرآیند توسعه پلتفرم مدیریت حمل و نقل هوشمند از مرحله ایده‌پردازی تا راه‌اندازی",
      "گرین لایف":
        "مراحل طراحی و توسعه فروشگاه اینترنتی محصولات ارگانیک با تمرکز بر UX",
      "اینوویت لبز":
        "فرآیند ساخت وبسایت شرکتی با امکانات پیشرفته نمایش نمونه کارها",
      "اوربن استایل": "مراحل ایجاد پلتفرم فروش مد و فشن با تکنولوژی‌های مدرن",
    };

    return descriptions[projectName] || "فرآیند طراحی و توسعه وبسایت";
  };

  const openModal = useCallback((project: Collaboration) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
    setTimeout(() => setSelectedProject(null), 400);
  }, []);

  const openImageModal = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false);
    setTimeout(() => setSelectedImage(null), 400);
  }, []);

  return (
    <div className="w-full bg-white px-4">
      {/* Header with smooth entrance animation */}
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        <p className="text-[#29b0cb] text-xl sm:text-2xl">
          {" "}
          <span className="text-[#253e5f]">نمونه کار </span>طراحی سایت
        </p>
        <p className="text-gray-700 text-xs sm:text-sm mt-1 sm:mt-2">
          بخشی از نمونه های طراحی سایت توسط تیم ما
        </p>
      </div>

      {/* Logo Showcase */}
      <div className="max-w-7xl mx-auto h-96">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 0,
            stretch: -60,
            depth: 120,
            modifier: 1.8,
            slideShadows: false,
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
          }}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          modules={[EffectCoverflow, Autoplay, Pagination]}
          className="collaboration-swiper pb-12 h-96"
          speed={800}
          breakpoints={{
            320: {
              coverflowEffect: {
                stretch: -20,
                depth: 60,
                modifier: 1.2,
              },
            },
            768: {
              coverflowEffect: {
                stretch: -40,
                depth: 90,
                modifier: 1.5,
              },
            },
            1024: {
              coverflowEffect: {
                stretch: -60,
                depth: 120,
                modifier: 1.8,
              },
            },
          }}
        >
          {collaborations.map((project, index) => (
            <SwiperSlide
              key={project.id}
              className="max-w-xs md:max-w-sm lg:max-w-md transition-all duration-700 ease-out"
            >
              <div
                className={`
                  relative h-85 rounded-2xl cursor-pointer group overflow-visible
                  transform transition-all duration-700 ease-out
                  ${activeSlide === index ? "rotate-0" : "rotate-1"}
                  hover:rotate-0
                `}
                onClick={() => openModal(project)}
              >
                {/* Main scaling container that includes both image and overlay */}
                <div
                  className={`
                  absolute inset-0 transition-all duration-700 ease-out overflow-visible
                  ${activeSlide === index ? "scale-102" : "scale-95"}
                  group-hover:scale-107
                `}
                >
                  {/* Static Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />

                  {/* Logo Container with Floating Animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-170 h-150 animate-float-slow">
                      <Image
                        src={project.logo}
                        alt={`${project.name} logo`}
                        fill
                        className="object-contain transition-all duration-700 ease-out group-hover:brightness-110"
                        priority
                      />
                    </div>
                  </div>

                  {/* Hover Overlay - Now scales with the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-blue-200/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-600 ease-out bottom-5 flex items-end">
                    <div className="p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-600 ease-out opacity-0 group-hover:opacity-100 space-y-3 w-full">
                      <h3 className="text-gray-700 font-semibold text-lg mb-2">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 font-semibold text-sm leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-gray-600 text-xs font-medium">
                          مشاهده جزئیات
                        </span>
                        <div className="w-6 h-6 bg-[#29b0cb] rounded-full flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110">
                          <svg
                            className="w-3 h-3 text-whitw transition-transform duration-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Enhanced Modal with Clean Minimal Design */}
      {selectedProject && (
        <div
          className={`
      fixed inset-0 z-50 transition-all duration-500 ease-out
      ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
    `}
        >
          {/* Minimal Backdrop */}
          <div
            className={`
        absolute inset-0 bg-black/40 transition-all duration-500
        ${isModalOpen ? "backdrop-opacity-100" : "backdrop-opacity-0"}
      `}
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div
            className={`
        absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        w-11/12 md:w-10/12 max-w-6xl h-[65vh] max-h-[800px]
        bg-white rounded-2xl shadow-xl transition-all duration-500 ease-out
        flex flex-col overflow-hidden
        ${isModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
      `}
          >
            {/* Minimal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-4 ">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <Image
                    src={selectedProject.logo}
                    alt={`${selectedProject.name} logo`}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {selectedProject.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {selectedProject.description}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex gap-8">
                {/* Process Section - Minimal Design */}
                <div className="space-y-6 w-1/3">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      فرآیند کار
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 text-left">
                      {getProcessDescription(selectedProject.name)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedProject.process.map(
                      (step: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 group cursor-default"
                        >
                          {/* Minimal Number Indicator */}
                          <div
                            className={`
                      flex-shrink-0 w-6 h-6 bg-gray-900 text-white 
                      rounded-full flex items-center justify-center text-xs 
                      font-medium transition-all duration-300
                      ${isModalOpen ? "opacity-100" : "opacity-0 scale-0"}
                      group-hover:bg-gray-700
                    `}
                            style={{
                              transitionDelay: `${100 + index * 150}ms`,
                            }}
                          >
                            {index + 1}
                          </div>

                          {/* Step Text */}
                          <div
                            className={`
                      flex-1 pt-1
                      ${
                        isModalOpen
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-4"
                      }
                      transition-all duration-500
                    `}
                            style={{
                              transitionDelay: `${200 + index * 150}ms`,
                            }}
                          >
                            <p className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                              {step}
                            </p>

                            {/* Minimal Separator */}
                            {index < selectedProject.process.length - 1 && (
                              <div
                                className={`
                          h-px bg-gray-200 mt-3
                          ${isModalOpen ? "opacity-100" : "opacity-0"}
                          transition-opacity duration-500
                        `}
                                style={{
                                  transitionDelay: `${300 + index * 150}ms`,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Screenshots Section */}
                <div className="space-y-6 w-2/3">
                  <div className="relative bg-gray-200 rounded-2xl p-4 border border-gray-200">
                    {/* Browser Frame */}
                    <div className="bg-gray-800 rounded-t-xl p-3 flex items-center space-x-2 rtl:space-x-reverse flex-shrink-0 mb-0">
                      <div className="flex space-x-1 rtl:space-x-reverse">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="flex-1 text-end bg-gray-700 rounded px-3 py-1">
                        <span className="text-gray-300 text-xs">
                          https://
                          {selectedProject.domain
                            .toLowerCase()
                            .replace(/\s/g, "")}
                          .com
                        </span>
                      </div>
                    </div>

                    {/* Scrollable Image Container */}
                    <div className="relative bg-white rounded-b-xl overflow-hidden border border-gray-200 border-t-0">
                      <div
                        className={`
    relative w-full h-80 cursor-zoom-in bg-gray-100 overflow-y-auto scrollable-image-container
    transform transition-all duration-500 ease-out
    ${isModalOpen ? "animate-fadeInUp" : "opacity-0"}
    group
        `}
                        style={{
                          animationDelay: "400ms",
                          animationFillMode: "both",
                        }}
                      >
                        {/* Single Scrollable Image */}
                        <div
                          className="relative w-full min-h-full"
                          onClick={() =>
                            openImageModal(selectedProject.screenshots[0])
                          }
                        >
                          <Image
                            src={selectedProject.screenshots[0]}
                            alt={`${selectedProject.name} screenshot`}
                            width={800}
                            height={600}
                            className="w-full h-auto object-contain"
                            style={{ minHeight: "100%" }}
                          />
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end pointer-events-none">
                          <div className="p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 w-full">
                            <div className="flex items-center justify-between">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Custom Scrollbar */}
                      <div className="absolute right-1 top-12 bottom-4 w-2 bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div
                          className="w-2 bg-gray-400 rounded-full transition-all duration-300"
                          style={{ height: "40%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className={`
          fixed inset-0 z-[60] transition-all duration-500 ease-out
          ${isImageModalOpen ? "opacity-100" : "opacity-0"}
        `}
        >
          {/* Backdrop */}
          <div
            className={`
              absolute inset-0 bg-black/90 backdrop-blur-md transition-all duration-500 ease-out
              ${
                isImageModalOpen ? "backdrop-opacity-100" : "backdrop-opacity-0"
              }
            `}
            onClick={closeImageModal}
          />

          {/* Image Container */}
          {/* Image Container */}
          <div
            className={`
    absolute inset-4 md:ins-20 flex items-center justify-center transform transition-all duration-500 ease-out
    ${isImageModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
  `}
          >
            <div className="relative w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center">
              <div className="relative w-full h-full overflow-auto custom-scrollbar">
                <Image
                  src={selectedImage}
                  alt="Zoomed screenshot"
                  width={1200}
                  height={800}
                  className="w-auto h-auto max-w-none transition-transform duration-300 ease-out"
                  style={{
                    minWidth: "100%",
                    minHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 left-4 w-12 h-12 bg-gray-400/30 hover:bg-gray-400 rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 backdrop-blur-sm z-10"
              >
                <svg
                  className="w-6 h-6 text-white transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Navigation Arrows (if you want to add multiple image navigation) */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 z-10">
                <span className="text-white text-sm font-medium">
                  برای بستن کلیک کنید یا ESC را بزنید
                </span>
              </div>
            </div>
          </div>

          {/* Keyboard Support */}
          <div
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeImageModal();
            }}
            className="outline-none"
          />
        </div>
      )}

      {/* Custom CSS for Smooth Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .swiper-pagination-bullet {
          transition: all 0.4s ease-out;
        }

        .swiper-pagination-bullet-active {
          transform: scale(1.3);
        }

        .swiper-slide {
          transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(180deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) rotate(-10deg);
          }
          70% {
            transform: scale(0.9) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes widthGrow {
          from {
            opacity: 0;
            width: 0%;
          }
          to {
            opacity: 1;
            width: 100%;
          }
        }

        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-widthGrow {
          animation: widthGrow 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        /* Smooth scrolling for modal */
        .modal-open {
          overflow: hidden;
        }
        .screenshot-swiper-main {
          padding-bottom: 50px;
        }

        .screenshot-swiper-main .swiper-pagination-bullet {
          background: #cbd5e0;
          opacity: 0.6;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }

        .screenshot-swiper-main .swiper-pagination-bullet-active {
          background: #29b0cb;
          opacity: 1;
          width: 24px;
          border-radius: 6px;
        }
        /* Add to your existing style tag */
        .screenshot-swiper-main {
          height: 400px;
        }

        .screenshot-swiper-main .swiper-wrapper {
          transition-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #29b0cb;
        }

        /* Vertical pagination styles */
        .screenshot-swiper-main .swiper-pagination {
          right: 10px;
          left: auto;
          top: 50%;
          transform: translateY(-50%);
          width: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .screenshot-swiper-main .swiper-pagination-bullet {
          background: #cbd5e0;
          opacity: 0.6;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
          margin: 4px 0 !important;
        }

        .screenshot-swiper-main .swiper-pagination-bullet-active {
          background: #29b0cb;
          opacity: 1;
          height: 24px;
          border-radius: 6px;
        }

        /* Fixed Browser Frame with Scrolling Content */
        .screenshot-content-swiper {
          height: 320px;
        }

        .screenshot-content-swiper .swiper-wrapper {
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .screenshot-content-swiper .swiper-slide {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Simulated Browser Scrollbar */
        .browser-scrollbar {
          position: absolute;
          right: 2px;
          top: 40px;
          bottom: 4px;
          width: 6px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .browser-scrollbar-thumb {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
          animation: scrollThumb 2s ease-in-out infinite;
        }

        @keyframes scrollThumb {
          0%,
          100% {
            height: 40%;
            transform: translateY(0%);
          }
          50% {
            height: 30%;
            transform: translateY(60%);
          }
        }

        .group:hover .browser-scrollbar {
          opacity: 1;
        }

        /* Enhanced pagination for content swiper */
        .screenshot-content-swiper .swiper-pagination {
          right: 15px;
          left: auto;
          top: 50%;
          transform: translateY(-50%);
          width: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .screenshot-content-swiper .swiper-pagination-bullet {
          background: rgba(203, 213, 224, 0.6);
          opacity: 0.6;
          width: 6px;
          height: 6px;
          transition: all 0.3s ease;
          margin: 3px 0 !important;
        }

        .screenshot-content-swiper .swiper-pagination-bullet-active {
          background: #29b0cb;
          opacity: 1;
          height: 20px;
          border-radius: 4px;
        }

        /* Scrollable image container */
        .scrollable-image-container {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f1f1f1;
        }

        .scrollable-image-container::-webkit-scrollbar {
          width: 6px;
        }

        .scrollable-image-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .scrollable-image-container::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }

        .scrollable-image-container::-webkit-scrollbar-thumb:hover {
          background: #29b0cb;
        }
      `}</style>
    </div>
  );
}
