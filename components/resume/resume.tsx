import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

export default function Resume() {
  return (
    <div className="w-full mx-auto">
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="mySwiper h-80"
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {[
          "/web-design/web-resume1Asset 8.png",
          "/web-design/web-resume2Asset 9.png",
          "/web-design/web-resume3Asset 10.png",
          "/web-design/web-resume1Asset 8.png",
          "/web-design/web-resume2Asset 9.png",
          "/web-design/web-resume3Asset 10.png",
        ].map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative mx-auto aspect-[12/8] rounded-lg overflow-hidden">
              <Image
                src={src}
                alt={`نمونه کار طراحی سایت ${i + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
