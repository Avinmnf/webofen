
import { useState } from 'react';
import Image from 'next/image';

export default function Reservetime() {

  return (
          <div className="relative w-full aspect-[3/4] sm:aspect-[15/3] overflow-hidden flex items-start">
            {/* Desktop Image */}
            <Image
              src="/homepage/timereserve.png"
              alt="Desktop slide"
              fill
              className="object-cover hidden sm:block"
            />
            {/* Mobile Image */}
            <Image
              src="/homepage/timeresmobile.png"
              alt="Mobile slide"
              fill
              className="object-cover block sm:hidden"
            />
            <div className="absolute right-[5%] bottom-[5%] flex flex-col sm:flex-row gap-2 z-20 w-[90%] md:w-7/12 px-4 md:hidden">
              <div className="text-white flex items-center bg-[#1d546b] rounded-2xl p-2 py-8 md:p-10 md:w-1/2 sm:w-auto text-center text-sm sm:text-base">
                <svg
                  className="md:w-40 md:h-40 w-24 h-24 md:p-0 pr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 106.53 102.09"
                >
                  <path
                    fill="#f7f8fc"
                    d="M86.55,0H19.97C8.96,0,0,8.96,0,19.97v57.7c0,11.01,8.96,19.97,19.97,19.97h31.07c1.23,0,2.22-.99,2.22-2.22s-.99-2.22-2.22-2.22h-31.07c-8.57,0-15.54-6.97-15.54-15.54v-42.17h97.65v19.97c0,1.23.99,2.22,2.22,2.22s2.22-.99,2.22-2.22V19.97c0-11.01-8.96-19.97-19.97-19.97ZM4.44,31.07v-11.1c0-8.57,6.97-15.54,15.54-15.54h66.58c8.57,0,15.54,6.97,15.54,15.54v11.1H4.44ZM22.19,17.75c0,2.45-1.99,4.44-4.44,4.44s-4.44-1.99-4.44-4.44,1.99-4.44,4.44-4.44,4.44,1.99,4.44,4.44ZM35.51,17.75c0,2.45-1.99,4.44-4.44,4.44s-4.44-1.99-4.44-4.44,1.99-4.44,4.44-4.44,4.44,1.99,4.44,4.44ZM48.82,17.75c0,2.45-1.99,4.44-4.44,4.44s-4.44-1.99-4.44-4.44,1.99-4.44,4.44-4.44,4.44,1.99,4.44,4.44ZM92.63,85.06c3.13-3.83,5.02-8.72,5.02-14.04,0-12.24-9.96-22.19-22.19-22.19s-22.19,9.96-22.19,22.19,9.96,22.19,22.19,22.19c5.32,0,10.21-1.88,14.04-5.02l13.24,13.24c.43.43,1,.65,1.57.65s1.14-.22,1.57-.65c.87-.87.87-2.27,0-3.14l-13.24-13.24h0ZM75.46,88.77c-9.79,0-17.75-7.96-17.75-17.75s7.96-17.75,17.75-17.75,17.75,7.96,17.75,17.75-7.96,17.75-17.75,17.75Z"
                  />
                </svg>
                <div className="text-start pr-5">
                  <p className="pb-1 text-base">خدمات درمانی سیو</p>
                  <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
                </div>
              </div>

              <div className="text-white flex items-center border border-white rounded-2xl p-2 py-8 md:p-10 md:w-1/2 sm:w-auto text-center text-sm sm:text-base">
                <svg
                  className="md:w-40 md:h-40 w-24 h-24 md:p-0 pr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 107.48 103"
                >
                  <path
                    fill="#ffff"
                    d="M87.33,0H20.15C9.04,0,0,9.04,0,20.15v58.22c0,11.11,9.04,20.15,20.15,20.15h8.96c1.24,0,2.24-1,2.24-2.24s-1-2.24-2.24-2.24h-8.96c-8.64,0-15.67-7.03-15.67-15.67v-42.54h98.52v42.54c0,8.64-7.03,15.67-15.67,15.67h-8.96c-1.24,0-2.24,1-2.24,2.24s1,2.24,2.24,2.24h8.96c11.11,0,20.15-9.04,20.15-20.15V20.15c0-11.11-9.04-20.15-20.15-20.15ZM4.48,31.35v-11.2c0-8.64,7.03-15.67,15.67-15.67h67.17c8.64,0,15.67,7.03,15.67,15.67v11.2H4.48ZM22.39,17.91c0,2.47-2.01,4.48-4.48,4.48s-4.48-2.01-4.48-4.48,2.01-4.48,4.48-4.48,4.48,2.01,4.48,4.48ZM35.83,17.91c0,2.47-2.01,4.48-4.48,4.48s-4.48-2.01-4.48-4.48,2.01-4.48,4.48-4.48,4.48,2.01,4.48,4.48ZM49.26,17.91c0,2.47-2.01,4.48-4.48,4.48s-4.48-2.01-4.48-4.48,2.01-4.48,4.48-4.48,4.48,2.01,4.48,4.48ZM80.61,64.93c0,8.48-3.89,16.28-10.66,21.4-1.76,1.34-2.78,3.3-2.78,5.4v9.02c0,1.24-1,2.24-2.24,2.24s-2.24-1-2.24-2.24v-9.02c0-3.51,1.66-6.78,4.55-8.97,5.65-4.27,8.88-10.77,8.88-17.83,0-5.61-2.09-10.97-5.88-15.11-.78-.85-1.72-.58-1.99-.47-.33.13-1.08.54-1.08,1.59v6.62c0,7.17-5.3,13.33-12.06,14-3.8.4-7.58-.86-10.39-3.4-2.81-2.54-4.42-6.18-4.42-9.96v-7.26c0-1.06-.76-1.47-1.08-1.59-.27-.1-1.2-.38-1.99.47-3.79,4.14-5.88,9.5-5.88,15.11,0,7.06,3.24,13.56,8.88,17.83,2.89,2.19,4.55,5.46,4.55,8.97v9.02c0,1.24-1,2.24-2.24,2.24s-2.24-1-2.24-2.24v-9.02c0-2.1-1.01-4.06-2.78-5.4-6.77-5.13-10.66-12.93-10.66-21.4,0-6.73,2.51-13.17,7.06-18.13,1.77-1.93,4.48-2.57,6.91-1.62,2.39.93,3.94,3.19,3.94,5.77v7.26c0,2.53,1.07,4.94,2.95,6.64,1.9,1.72,4.37,2.53,6.94,2.27,4.5-.46,8.03-4.65,8.03-9.55v-6.62c0-2.57,1.55-4.84,3.94-5.77,2.43-.95,5.14-.31,6.91,1.62,4.55,4.96,7.06,11.4,7.06,18.13Z"
                  />
                </svg>
                <div className="text-start pr-5">
                  <p className="pb-1 text-base">خدمات درمانی طراحی سایت</p>
                  <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 items-start z-10 p-4 pt-10 rounded-xl md:block hidden">
              <div className="mt-10">
                <p className="text-lg md:text-3xl text-white mb-4">
                  قبل از ثبت نوبت می‌توانید از ما
                  <span className="text-[#1d546b]"> مشاوره رایگان </span>
                  دریافت کنید :
                </p>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-10">
              <input
                type="text"
                placeholder="نام و نام خانوادگی"
                className="bg-[#f7f8fc] text-gray-700 rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#1d546b] focus:ring-2 focus:ring-[#1d546b] transition-all duration-200"
              />
              <input
                type="text"
                placeholder="تلفن همراه"
                className="bg-[#f7f8fc] text-gray-700 rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#1d546b] focus:ring-2 focus:ring-[#1d546b] transition-all duration-200"
              />
                <div className="w-full lg:w-auto">
                  <button className="w-full lg:w-32 h-10 bg-[#1d546b] text-white rounded-xl mt-2 lg:mt-0 md:block hidden">
                    ثبت درخواست
                  </button>
                </div>
              </div>
            </div>
          </div>
  );
}
