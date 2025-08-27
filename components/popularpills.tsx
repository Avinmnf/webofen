"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Slide = {
  id: number;
  title: string;
  image: string;
};

const slides: Slide[] = [
  { id: 1, title: "Slide One", image: "/homepage/wantedpillsAsset 9.png" },
  { id: 2, title: "Slide Two", image: "/homepage/wantedpillsAsset 10.png" },
  { id: 4, title: "Slide Three", image: "/homepage/wantedpillsAsset 11.png" },
  { id: 5, title: "Slide Three", image: "/homepage/wantedpillsAsset 11.png" },
  { id: 6, title: "Slide Three", image: "/homepage/wantedpillsAsset 11.png" },
];

export default function Popularpills() {
  return (
    <div className=""> {/* Outer padding (X and Y axis) */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="p-2">
            <div className="w-full h-64 sm:h-56 rounded-xl overflow-hidden ">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
