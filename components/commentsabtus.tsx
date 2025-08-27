'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

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
    <div className="w-full flex justify-center">
      <div className="w-full md:h-[400px] h-[400px] flex items-center justify-center relative">

        {/* Top Blur Overlay */}
        <div className="absolute top-0 left-0 w-full h-20 z-10 pointer-events-none bg-gradient-to-b from-[#f7f8fc] via-[#f7f8fc]/80 to-transparent" />

        {/* Bottom Blur Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-20 z-10 pointer-events-none bg-gradient-to-t from-[#f7f8fc] via-[#f7f8fc]/80 to-transparent" />

        <Swiper
          direction="vertical"
          slidesPerView={3}
          spaceBetween={15}
          centeredSlides={true}
          slideToClickedSlide={true}
          loop={true}
          speed={900}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            waitForTransition: true // Ensures smooth transition between slides
          }}
          effect="coverflow"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 50,
            modifier: 2,
            slideShadows: false,
          }}
          grabCursor={true}
          resistance={true}
          resistanceRatio={0.7}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="h-full z-0 m-0"
          style={{
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
          }}
        >
          {items.map((text, index) => (
            <SwiperSlide
              key={index}
              className="!h-[180px] px-2 flex items-center justify-center transition-all duration-300 ease-in-out"
            >
              <div className="bg-white rounded-xl p-4 shadow-md w-full h-full flex flex-col overflow-hidden">
                <div className="flex items-center gap-1">
                  <div className="w-9 h-9 rounded-md bg-[#6FD6E5] flex-shrink-0" />
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">رامبد خجسته پور</p>
                    <p className="text-xs text-gray-500">مدیر ثبت دلتا</p>
                  </div>
                </div>
                <p className="text-xs text-gray-700 text-right leading-snug mt-6">
                  متن ساختگی لورم ایپسوم برای نمایش تستی نظرات در این اسلاید.
                  متن ساختگی لورم ایپسوم برای نمایش تستی نظرات در این اسلاید.
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
