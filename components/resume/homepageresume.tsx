import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";

// Import Swiper styles

export default function HomepageResume() {
  return (
    <div className="w-full mx-auto">
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper h-80"
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {[
          "/web-design/home-resume1Asset 14.png",
          "/web-design/home-resume1Asset 15.png",
          "/web-design/home-resume1Asset 16.png",
          "/web-design/home-resume1Asset 14.png",
          "/web-design/home-resume1Asset 15.png",
          "/web-design/home-resume1Asset 16.png",
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
