// layout/footer.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="w-full  text-gray-800 pt-10 text-center  bg-[#f7f8fc]">
<div className="max-w-[1250px] m-auto rounded-t-2xl flex flex-col-reverse lg:flex-row pt-10 items-stretch gap-6">
        {/* Left Column */}
        <div className="md:w-2/12 flex flex-col items-center md:items-start justify-between">
          <Link href="/" className="mb-15 md:mt-15 md:my-10">
            <Image
              width={210}
              height={150}
              src="/homepage/logo.png"
              alt="logo"
              priority
            />
          </Link>
          <div className="bg-[#6fd6e5] w-full rounded-t-4xl h-50  pt-10 text-white text-center shadow-[0_-30px_0_0px_#1d546b]">
            <p className="border-b border-gray-200 text-base pb-5">
              7 روز هفته ، 24 ساعت پاسخگوی شما هستیم
            </p>
            <p className="border-b border-gray-200 text-lg py-2">021-88515914</p>
          </div>
        </div>
        {/* Right Column */}
        <div className="lg:w-10/12 flex flex-col gap-6  md:p-0 p-4">
          <div className="flex flex-col lg:flex-row justify-between border-b border-gray-100 pb-6  gap-6 lg:gap-0">
            {/* Text */}
            <div className="lg:w-10/12 md:pl-4 flex flex-col  justify-center  md:p-0 p-4">
              <p className="text-sm text-gray-600 md:text-start text-center line-clamp-6">
              وبوفن (Webofen) یک پلتفرم تحلیلی و هوشمند است که با هدف بهبود عملکرد، سئو و تجربه کاربری وب‌سایت‌ها طراحی شده است. ما در وبوفن تلاش می‌کنیم تا با استفاده از ابزارهای دقیق تحلیل داده، بررسی فنی و گزارش‌های قابل‌فهم، به صاحبان وب‌سایت‌ها کمک کنیم تا نقاط ضعف و قوت وب خود را شناسایی و برطرف کنند.
              </p>
            </div>

            {/* Image */}
            <div className="lg:w-4/12 h-45 bg-white rounded-2xl flex items-center justify-center">
              <Link href="/" className="my-5 lg:my-10">
                <Image
                  width={250}
                  height={100}
                  src="/guidance/enamdAsset 4.png"
                  alt="logo"
                  priority
                />
              </Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 pb-4 gap-4 md:gap-0">
            <div className="flex  md:flex-row gap-2 w-full md:w-4/12">
              <div className="bg-white p-2 rounded-xl md:ml-3 h-15 flex-shrink-0">
                <svg
                  className="w-10 h-10"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 51.29 61.66"
                >
                  <g>
                    <path
                      fill="#e2e2e2"
                      d="M25.64,0C11.49.02.02,11.49,0,25.64c0,6.6,5.11,16.94,15.2,30.71,4.21,5.77,12.3,7.03,18.07,2.82,1.08-.79,2.03-1.74,2.82-2.82,10.08-13.78,15.2-24.11,15.2-30.71C51.27,11.49,39.8.02,25.64,0ZM25.64,35.86c-5.68,0-10.28-4.6-10.28-10.28s4.6-10.28,10.28-10.28,10.28,4.6,10.28,10.28-4.6,10.28-10.28,10.28Z"
                    />
                  </g>
                </svg>
              </div>
              <div>
                <div className="bg-[#1d546b] rounded-xl w-fit px-2">
                  <span className="text-[11px] text-white">دفتر مرکزی</span>
                </div>
                <p className="text-[12px] text-gray-600">
                  تهران - سهروردی شمالی - کوچه مهاجر - پلاک 30
                </p>
              </div>
            </div>

            <div className="w-full md:w-3/12 text-start">
              <div className="flex  md:flex-row gap-2">
                <div className="bg-white p-2 rounded-xl md:ml-3 flex-shrink-0">
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                  >
                    <path
                      fill="#e2e2e2"
                      d="M440.917,67.925H71.083C31.827,67.925,0,99.752,0,139.008v233.984c0,39.256,31.827,71.083,71.083,71.083
       h369.834c39.255,0,71.083-31.827,71.083-71.083V139.008C512,99.752,480.172,67.925,440.917,67.925z
       M178.166,321.72l-99.54,84.92c-7.021,5.992-17.576,5.159-23.567-1.869c-5.992-7.021-5.159-17.576,1.87-23.567l99.54-84.92
       c7.02-5.992,17.574-5.159,23.566,1.87C186.027,305.174,185.194,315.729,178.166,321.72z
       M256,289.436c-13.314-0.033-26.22-4.457-36.31-13.183l0.008,0.008l-0.032-0.024
       c0.008,0.008,0.017,0.008,0.024,0.016L66.962,143.694c-6.98-6.058-7.723-16.612-1.674-23.583
       c6.057-6.98,16.612-7.723,23.582-1.674l152.771,132.592c3.265,2.906,8.645,5.004,14.359,4.971
       c5.706,0.017,10.995-2.024,14.44-5.028l0.074-0.065l152.615-132.469c6.971-6.049,17.526-5.306,23.583,1.674
       c6.048,6.97,5.306,17.525-1.674,23.583l-152.77,132.599C282.211,284.929,269.322,289.419,256,289.436z
       M456.948,404.771c-5.992,7.028-16.547,7.861-23.566,1.869l-99.54-84.92c-7.028-5.992-7.861-16.546-1.869-23.566
       c5.991-7.029,16.546-7.861,23.566-1.87l99.54,84.92C462.107,387.195,462.94,397.75,456.948,404.771z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="bg-[#1d546b] rounded-xl w-fit px-2">
                    <span className="text-[11px] text-white">
                      ایمیل پشتیبانی
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">info@webofen.com </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-4/12 flex justify-center md:justify-end gap-11 items-center flex-wrap ">
              <svg
                className="w-10 h-10 bg-white rounded-xl p-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 34.01 34.01"
              >
                <g>
                  <g>
                    <g>
                      <path
                        fill="#e2e2e2"
                        d="M29.37,0H4.64C2.08,0,0,2.08,0,4.64v24.73c0,2.56,2.08,4.64,4.64,4.64h24.73c2.56,0,4.64-2.08,4.64-4.64V4.64c0-2.56-2.08-4.64-4.64-4.64ZM11.59,26.91c0,.4-.32.72-.71.72,0,0,0,0,0,0h-3.05c-.4,0-.72-.32-.72-.71,0,0,0,0,0,0v-12.81c0-.4.32-.72.72-.72h3.05c.4,0,.72.32.72.72v12.81ZM9.35,12.17c-1.6,0-2.9-1.3-2.9-2.9s1.3-2.9,2.9-2.9,2.9,1.3,2.9,2.9-1.3,2.9-2.9,2.9ZM27.56,26.96c0,.36-.29.66-.66.66,0,0,0,0,0,0h-3.28c-.36,0-.66-.29-.66-.66,0,0,0,0,0,0v-6c0-.9.26-3.93-2.34-3.93-2.02,0-2.43,2.07-2.51,3v6.93c0,.36-.29.66-.65.66h-3.17c-.36,0-.66-.29-.66-.66,0,0,0,0,0,0v-12.92c0-.36.29-.66.66-.66,0,0,0,0,0,0h3.17c.36,0,.66.3.66.66v1.12c.75-1.13,1.86-1.99,4.23-1.99,5.25,0,5.22,4.9,5.22,7.6v6.19Z"
                      />
                    </g>
                  </g>
                </g>
              </svg>
              <svg
                className="w-10 h-10 bg-white rounded-xl p-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 34 34"
              >
                <g>
                  <path
                    fill="#e2e2e2"
                    d="M30.33,0H3.67C1.64,0,0,1.64,0,3.67v26.65c0,2.03,1.64,3.67,3.67,3.67h26.65c2.03,0,3.67-1.64,3.67-3.67V3.67C34,1.64,32.36,0,30.33,0h0ZM21.69,28.83l-6.32-9.2-7.91,9.2h-2.04l9.05-10.52L5.41,5.15h6.9l5.98,8.71,7.49-8.71h2.04l-8.63,10.03h0l9.38,13.65h-6.9Z"
                  />
                </g>
              </svg>
              <svg
                className="w-10 h-10 bg-white rounded-xl p-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 34 34"
              >
                <g>
                  <path
                    fill="#e2e2e2"
                    d="M24.8,0h-15.59C4.13,0,0,4.13,0,9.2v15.59c0,5.07,4.13,9.2,9.2,9.2h15.59c5.07,0,9.2-4.13,9.2-9.2v-15.59c0-5.07-4.13-9.2-9.2-9.2ZM32.01,24.8c0,3.98-3.23,7.21-7.21,7.21h-15.59c-3.98,0-7.21-3.23-7.21-7.21v-15.59c0-3.98,3.23-7.21,7.21-7.21h15.59c3.98,0,7.21,3.23,7.21,7.21v15.59Z"
                  />
                  <path
                    fill="#e2e2e2"
                    d="M17,7.7c-5.13,0-9.3,4.17-9.3,9.3s4.17,9.3,9.3,9.3,9.3-4.17,9.3-9.3-4.17-9.3-9.3-9.3ZM17,24.3c-4.03,0-7.3-3.28-7.3-7.3s3.28-7.3,7.3-7.3,7.3,3.28,7.3,7.3-3.28,7.3-7.3,7.3Z"
                  />
                  <path
                    fill="#e2e2e2"
                    d="M26.52,4.4c-1.51,0-2.75,1.23-2.75,2.75s1.23,2.75,2.75,2.75,2.75-1.23,2.75-2.75-1.23-2.75-2.75-2.75ZM26.52,7.9c-.42,0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75Z"
                  />
                </g>
              </svg>
              <svg
                className="w-10 h-10 bg-white rounded-xl p-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 33.97 34"
              >
                <g>
                  <path
                    fill="#e2e2e2"
                    d="M28.95,4.94C25.75,1.76,21.5,0,16.98,0c-4.51,0-8.77,1.75-11.98,4.93C1.78,8.12,0,12.35,0,16.84h0c0,2.72.71,5.46,2.07,7.97L.05,34l9.3-2.11c2.35,1.19,4.98,1.81,7.63,1.81h0c4.51,0,8.77-1.75,11.98-4.93,3.22-3.19,5-7.42,5-11.91,0-4.46-1.78-8.69-5.02-11.92ZM16.98,31.04h0c-2.38,0-4.74-.6-6.82-1.73l-.44-.24-6.18,1.41,1.34-6.1-.26-.45c-1.29-2.22-1.97-4.67-1.97-7.09,0-7.82,6.43-14.19,14.33-14.19,3.81,0,7.4,1.48,10.09,4.16,2.73,2.72,4.24,6.29,4.24,10.04,0,7.82-6.43,14.19-14.33,14.19Z"
                  />
                  <path
                    fill="#e2e2e2"
                    d="M12.23,9.7h-.74c-.26,0-.68.1-1.04.48-.36.39-1.36,1.32-1.36,3.23s1.39,3.75,1.59,4c.19.26,2.69,4.29,6.64,5.84,3.28,1.29,3.95,1.03,4.66.97.71-.06,2.3-.94,2.62-1.84s.32-1.68.23-1.84c-.1-.16-.36-.26-.74-.45-.39-.19-2.29-1.15-2.65-1.28-.36-.13-.62-.19-.87.19-.26.39-1.02,1.28-1.25,1.54-.23.26-.45.29-.84.1-.39-.19-1.63-.61-3.11-1.93-1.16-1.03-1.96-2.34-2.18-2.72-.23-.39-.02-.6.17-.79.17-.17.41-.41.6-.64.19-.23.25-.39.38-.65.13-.26.06-.48-.03-.68-.1-.19-.84-2.11-1.19-2.87h0c-.29-.64-.6-.67-.87-.68Z"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 justify-between mt-2 pb-10 gap-4">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border border-transparent hover:border-[#1d546b] box-border transition-colors duration-200">
                <span className="w-3 h-3 rounded-full border border-[#1d546b]"></span>
                <Link href={"/"}>
                <span className="text-gray-800 text-sm">خانه</span>
                </Link>
              </div>

              <div className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border border-transparent hover:border-[#1d546b] box-border transition-colors duration-200">
                <span className="w-3 h-3 rounded-full border border-[#1d546b]"></span>
                <span className="text-gray-800 text-sm">خدمات درمانی</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border border-transparent hover:border-[#1d546b] box-border transition-colors duration-200">
                <span className="w-3 h-3 rounded-full border border-[#1d546b]"></span>
                <span className="text-gray-800 text-sm">درباره ما</span>
              </div>

              <div className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border border-transparent hover:border-[#1d546b] box-border transition-colors duration-200">
                <span className="w-3 h-3 rounded-full border border-[#1d546b]"></span>
                <span className="text-gray-800 text-sm">تیم ما</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border border-transparent hover:border-[#1d546b] box-border transition-colors duration-200">
                <span className="w-3 h-3 rounded-full border border-[#1d546b]"></span>
                <Link href={"/articles"}>
                <span className="text-gray-800 text-sm">مقالات</span>
                </Link>
              </div>

              <div className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border border-transparent hover:border-[#1d546b] box-border transition-colors duration-200">
                <span className="w-3 h-3 rounded-full border border-[#1d546b]"></span>
                <span className="text-gray-800 text-sm">تماس با ما</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border border-transparent hover:border-[#1d546b] box-border transition-colors duration-200">
                <span className="w-3 h-3 rounded-full border border-[#1d546b]"></span>
                <Link href={"/products"}>
                <span className="text-gray-800 text-sm">داروخانه</span>
                </Link>
              </div>

              <div className="inline-flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border border-transparent hover:border-[#1d546b] box-border transition-colors duration-200">
                <span className="w-3 h-3 rounded-full border border-[#1d546b]"></span>
                <span className="text-gray-800 text-sm">بیمه وب وفن</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
