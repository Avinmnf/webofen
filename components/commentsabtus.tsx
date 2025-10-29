'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

const comments = [
  {
    name: 'رامبد خجسته پور',
    role: 'مدیر ثبت دلتا',
    comment: 'همکاری با این تیم بسیار حرفه‌ای و خوش‌اخلاق بود. پروژه دقیق و به موقع تحویل داده شد.',
  },
  {
    name: 'مینا رضایی',
    role: 'کارشناس بازاریابی',
    comment: 'خدمات ارائه شده فوق‌العاده بود و تیم همیشه پاسخگو و قابل اعتماد بودند.',
  },
  {
    name: 'سامان نظری',
    role: 'توسعه‌دهنده فرانت‌اند',
    comment: 'تجربه همکاری عالی بود. فرآیندها به خوبی سازماندهی شده و هماهنگی بسیار آسان بود.',
  },
  {
    name: 'الهام کریمی',
    role: 'مدیر پروژه',
    comment: 'پشتیبانی و خدمات مشتریان فوق‌العاده بود و همیشه در دسترس بودند.',
  },
  {
    name: 'امیرحسین قاسمی',
    role: 'طراح UI/UX',
    comment: 'کیفیت کار بسیار بالا بود و همه چیز طبق برنامه پیش رفت. واقعاً راضی هستم.',
  },
  {
    name: 'سارا محمدی',
    role: 'مدیر فروش',
    comment: 'فرآیند سفارش ساده و راحت بود و نتیجه نهایی بسیار حرفه‌ای بود.',
  },
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
            waitForTransition: true,
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
            transformStyle: 'preserve-3d',
          }}
        >
          {comments.map((item, index) => (
            <SwiperSlide
              key={index}
              className="!h-[180px] px-2 flex items-center justify-center transition-all duration-300 ease-in-out"
            >
              <div className="bg-white rounded-xl p-4 shadow-md w-full h-full flex flex-col overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6FD6E5] flex-shrink-0" />
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-700 text-right leading-snug mt-4">
                  {item.comment}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
