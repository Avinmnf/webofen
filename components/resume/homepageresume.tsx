"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

interface Project {
  image: string;
  title: string;
  client: string;
  description: string;
}

const projects: Project[] = [
  {
    image: "/homepage/resume-seoAsset 8.png",
    title: "وب سایت شرکتی",
    client: "مشتری 1",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
  {
    image: "/homepage/resume-seoAsset 8.png",
    title: "فروشگاه آنلاین",
    client: "مشتری 2",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
  {
    image: "/homepage/resume-seoAsset 8.png",
    title: "اپلیکیشن خدماتی",
    client: "مشتری 3",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
  {
    image: "/homepage/resume-seoAsset 8.png",
    title: "وب سایت شخصی",
    client: "مشتری 4",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
  {
    image: "/homepage/resume-seoAsset 8.png",
    title: "وب اپلیکیشن",
    client: "مشتری 5",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
  {
    image: "/homepage/resume-seoAsset 8.png",
    title: "پلتفرم آموزشی",
    client: "مشتری 6",
    description: "لورم ایپسوم متن ساختگی برای توضیح پروژه",
  },
];

export default function HomepageResume() {
  return (
    <div className="w-full mx-auto">
      <Swiper
        slidesPerView={3}
        spaceBetween={40}
        centeredSlides={true}
        grabCursor={true}
        effect="coverflow"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 50,
          modifier: 2,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper h-85"
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {projects.map((project, i) => (
          <SwiperSlide key={i}>
            <div className="bg-[#29b0cb] rounded-2xl overflow-hidden p-4 flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="bg-white rounded-lg h-10 w-10"></div>
                  <div>
                    <span className="block">www.sabtedelta</span>
                    <span>خدمات ثبتی</span>
                  </div>
                </div>
                <div className="bg-[#1d546b] py-2 px-4 rounded-lg text-white text-sm">
                  <span className="pl-5">مدت قرارداد</span>
                  <span>9 ماه</span>
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
                  <span>300+</span>
                </div>
                <div className=" text-xs text-center py-2 bg-[#1d546b] rounded-xl">
                  <span>رنک</span>
                  <div className="w-full h-[1px] bg-gray-300 my-1"></div>
                  <span>300+</span>
                </div>
                <div className=" text-xs text-center py-2 bg-[#1d546b] rounded-xl">
                  <span>تولید محتوا</span>
                  <div className="w-full h-[1px] bg-gray-300 my-1"></div>
                  <span>300+</span>
                </div>
                <div className=" text-xs text-center py-2 bg-[#1d546b] rounded-xl">
                  <span>رنک دامنه</span>
                  <div className="w-full h-[1px] bg-gray-300 my-1"></div>
                  <span>300+</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
