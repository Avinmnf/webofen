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
    <div className="w-full flex justify-center py-10">
      <div className="w-full md:h-[320px] h-[340px] flex items-center justify-center">
        <Swiper
          direction="vertical"
          slidesPerView={3}
          spaceBetween={16}
          centeredSlides={true}
          slideToClickedSlide={true}
          loop={false}
          effect="coverflow"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Pagination]}
          className="h-full w-[90%] md:w-[70%]"
        >
          {items.map((text, index) => (
            <SwiperSlide
              key={index}
              className="!h-[100px] px-2 flex items-center justify-center transition-all duration-300 ease-in-out"
            >
              <div className="bg-white rounded-xl p-4 shadow-md w-full h-full flex flex-col justify-between overflow-hidden">
                <div className="flex items-center gap-1">
                  <div className="w-9 h-9 rounded-md bg-[#6FD6E5] flex-shrink-0" />
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">رامبد خجسته پور</p>
                    <p className="text-xs text-gray-500">مدیر ثبت دلتا</p>
                  </div>
                </div>
                <p className="text-xs text-gray-700 text-right leading-snug">
                  متن ساختگی لورم ایپسوم برای نمایش تستی نظرات در این اسلاید.
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
