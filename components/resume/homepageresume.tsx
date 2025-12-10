"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

interface Project {
  image: string;
  title: string;
  time: string;
  backlink: string;
  rank: string;
  content: string;
  domain: string;
  client: string;
  description: string;
}

const projects: Project[] = [
  {
    image: "/resume/seo/seoresume1.png",
    title: "وب سایت شرکتی",
    time: "8 ماه",
    backlink: "120+",
    rank: "2+",
    content: "150+",
    domain: "5",
    client: "مشتری 1",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
  {
    image: "/resume/seo/seoresume2.png",
    title: "فروشگاه آنلاین",
    time: "5 ماه",
    backlink: "140+",
    rank: "4+",
    content: "230+",
    domain: "2",
    client: "مشتری 2",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
  {
    image: "/resume/seo/seoresume3.png",
    title: "اپلیکیشن خدماتی",
    time: "3 ماه",
    backlink: "210+",
    rank: "3+",
    content: "90+",
    domain: "3",
    client: "مشتری 3",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
  {
    image: "/resume/seo/seoresume4.png",
    title: "وب سایت شخصی",
    time: "8 ماه",
    backlink: "70+",
    rank: "1+",
    content: "65+",
    domain: "2",
    client: "مشتری 4",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
  {
    image: "/resume/seo/seoresume5.png",
    title: "وب اپلیکیشن",
    time: "1 سال",
    backlink: "190+",
    rank: "5+",
    content: "170+",
    domain: "3",
    client: "مشتری 5",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
];

export default function HomepageResume() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="w-full mx-auto">
      <Swiper
        slidesPerView={3}
        spaceBetween={60}
        centeredSlides={true}
        grabCursor={true}
        initialSlide={1} // Add this line - starts from second slide
        effect="coverflow"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 70,
          modifier: 2,
          slideShadows: false,
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper h-96 pb-16 collaboration-swiper"
        breakpoints={{
          320: { slidesPerView: 1 },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
            coverflowEffect: {
              stretch: -20,
              depth: 40,
              modifier: 1.2,
            },
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
            coverflowEffect: {
              stretch: -30,
              depth: 50,
              modifier: 1.5,
            },
          },
        }}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
      >
        {projects.map((project, i) => (
          <SwiperSlide className="items-center mt-10" key={i}>
            <div
              className={`
                relative bg-[#29b0cb] rounded-2xl overflow-hidden p-4 flex flex-col items-center
                transform transition-all duration-700 ease-out
                ${activeSlide === i ? "rotate-0" : "rotate-1"}
                hover:rotate-0
                ${
                  activeSlide === i
                    ? "animate-float-slow scale-102"
                    : "scale-95"
                }
              `}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <div>
                    <span className="block text-base">{project.title}</span>
                  </div>
                </div>
                <div className="bg-[#1d546b] py-2 px-4 rounded-lg text-white text-sm">
                  <span className="pl-5">مدت قرارداد</span>
                  <span>{project.time}</span>
                </div>
              </div>

              <div className="relative w-full aspect-[12/4] rounded-lg overflow-hidden mb-4">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="grid grid-cols-4 gap-1 items-center justify-between w-full">
                <div className=" text-xs text-center py-2 bg-[#1d546b] rounded-xl">
                  <span>بک لینک</span>
                  <div className="w-full h-[1px] bg-gray-300 my-1"></div>
                  <span>{project.backlink}</span>
                </div>
                <div className=" text-xs text-center py-2 bg-[#1d546b] rounded-xl">
                  <span>رنک</span>
                  <div className="w-full h-[1px] bg-gray-300 my-1"></div>
                  <span>{project.rank}</span>
                </div>
                <div className=" text-xs text-center py-2 bg-[#1d546b] rounded-xl">
                  <span>تولید محتوا</span>
                  <div className="w-full h-[1px] bg-gray-300 my-1"></div>
                  <span>{project.content}</span>
                </div>
                <div className=" text-xs text-center py-2 bg-[#1d546b] rounded-xl">
                  <span>رنک دامنه</span>
                  <div className="w-full h-[1px] bg-gray-300 my-1"></div>
                  <span>{project.domain}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }

        .rotate-0 {
          transform: rotate(0deg);
        }

        .rotate-1 {
          transform: rotate(0.5deg);
        }
        .collaboration-swiper .swiper-pagination {
          bottom: 0 !important;
          margin-bottom: 1.5rem;
        }

        .collaboration-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 0.7;
          transition: all 0.4s ease-out;
          margin: 0 4px !important;
        }

        .collaboration-swiper .swiper-pagination-bullet-active {
          width: 20px;
          height: 7px;
          border-radius: 5px;
          background: #1d546b !important;
          opacity: 1;
          transform: scale(1.2);
        }

        @media (max-width: 640px) {
          .collaboration-swiper .swiper-pagination-bullet {
            width: 5px;
            height: 4px;
          }

          .collaboration-swiper .swiper-pagination-bullet-active {
            width: 10px;
            height: 8px;
          }
        }
      `}</style>
    </div>
  );
}
