'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { EffectCoverflow, Pagination } from 'swiper/modules';

const items = [
  'Slide 1',
  'Slide 2',
  'Slide 3',
  'Slide 4',
  'Slide 5',
  'Slide 6',
];

export default function Commentsabtus() {
  return (
    <div className="w-full h-[400px]">
      <Swiper
        direction="vertical"
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        spaceBetween={40}
        loop={false}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2,
          slideShadows: false,
        }}
        modules={[EffectCoverflow, Pagination]}
        className="centered-swiper-vertical"
      >
        {items.map((text, index) => (
          <SwiperSlide key={index}>
            <div className="slide-content bg-blue-900 rounded-2xl">{text}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
