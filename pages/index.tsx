import Image from "next/image";
import { motion } from "framer-motion";
import Popularpills from "@/components/popularpills";
import Pathsection from "@/components/pathsection";
import Commentsabtus from "@/components/commentsabtus";
import Reservetime from "@/components/reservetime";

export default function Home() {
  return (
    <main className=" m-auto">
      <section className="bg-[#f7f8fc] pb-4 w-full rounded-2xl">
        <div className="max-w-[1250px] m-auto flex justify-center">
          <div className="block md:flex lg:flex-row w-full h-auto gap-1 md:gap-4">
            {/* Main Image */}
            <div className="relative w-[90%] mx-auto md:w-[62%] aspect-[16/9] rounded-lg overflow-hidden">
              <Image
                src="/homepage/slider.webp"
                alt="Main slide"
                fill
                className="object-contain"
                priority
              />
              <button
                className="absolute w-[25.3%] md:w-[27%] text-[2.8vw] md:text-[1.2vw] right-0 md:rounded-[1.2rem] rounded-lg"
                style={{
                  bottom: "0",
                  height: "16%",
                  backgroundColor: "#6FD6E5",
                  color: "#fff",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                خدمات درمانی
              </button>
            </div>
            {/* Side Image - Desktop Version */}
            <div className="relative w-full hidden md:flex lg:w-[38%] aspect-auto rounded-lg">
              <Image
                src="/homepage/sideslide.webp"
                alt="Side slide"
                fill
                className="object-contain"
                priority
              />
              <div className="absolute p-6 rounded-r-3xl rounded-tl-3xl" style={{
                left: "0",
                bottom: "0",
                width: "18.5%",
                backgroundColor: "#1d546b",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 71.21 71.21"
                  className="w-[40px] m-auto"
                >
                  <path
                    fill="#fff"
                    d="M62.31,56.48v-17.91c0-14.73-11.98-26.7-26.7-26.7s-26.7,11.98-26.7,26.7v17.91C3.88,57.21,0,61.54,0,66.76
    c0,2.45,2,4.45,4.45,4.45h62.31c2.45,0,4.45-2,4.45-4.45c0-5.22-3.88-9.56-8.9-10.28ZM11.87,38.57
    c0-13.09,10.65-23.74,23.74-23.74s23.74,10.65,23.74,23.74v17.8H11.87v-17.8ZM66.76,68.25H4.45c-.82,0-1.48-.67-1.48-1.48
    c0-4.09,3.33-7.42,7.42-7.42h50.44c4.09,0,7.42,3.33,7.42,7.42C68.24,67.58,67.57,68.25,66.76,68.25ZM50.6,6.75l2.97-5.93
    c.37-.73,1.26-1.03,1.99-.66c.73.37,1.03,1.26.66,1.99l-2.97,5.93c-.26.52-.79.82-1.33.82c-.22,0-.45-.05-.66-.16
    c-.73-.37-1.03-1.26-.66-1.99h0ZM62.75,17.37c-.58-.58-.58-1.52,0-2.1l5.93-5.93c.58-.58,1.52-.58,2.1,0s.58,1.52,0,2.1
    l-5.93,5.93c-.29.29-.67.43-1.05.43s-.76-.15-1.05-.43h0ZM14.99,2.15c-.36-.73-.07-1.62.66-1.99s1.62-.07,1.99.66l2.97,5.93
    c.36.73.07,1.62-.66,1.99c-.21.11-.44.16-.66.16c-.54,0-1.07-.3-1.33-.82l-2.97-5.93h0ZM.43,11.44c-.58-.58-.58-1.52,0-2.1
    s1.52-.58,2.1,0l5.93,5.93c.58.58.58,1.52,0,2.1c-.29.29-.67.43-1.05.43s-.76-.15-1.05-.43L.43,11.44ZM35.61,28.19
    c0,.82-.66,1.48-1.48,1.48c-4.09,0-7.42,3.33-7.42,7.42c0,.82-.66,1.48-1.48,1.48s-1.48-.66-1.48-1.48
    c0-5.73,4.66-10.39,10.39-10.39c.82,0,1.48.66,1.48,1.48Z"
                  />
                </svg>
              </div>
            </div>
            {/* Side Image - Mobile Version */}
            <div className="relative flex w-[90%] mx-auto aspect-[3/1] mt-2 rounded-lg md:hidden">
              <Image
                src="/homepage/sideslidemobile.png"
                alt="Side slide mobile"
                fill
                className="object-contain"
                priority
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 71.21 71.21"
                className="absolute md:rounded-r-3xl md:rounded-tl-3xl rounded-r-xl rounded-tl-xl"
                style={{
                  left: "0%",
                  bottom: "2%",
                  width: "11%",
                  height: "auto",
                  backgroundColor: "#1d546b",
                  padding: "1.9%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <path
                  fill="#fff"
                  d="M62.31,56.48v-17.91c0-14.73-11.98-26.7-26.7-26.7s-26.7,11.98-26.7,26.7v17.91C3.88,57.21,0,61.54,0,66.76
    c0,2.45,2,4.45,4.45,4.45h62.31c2.45,0,4.45-2,4.45-4.45c0-5.22-3.88-9.56-8.9-10.28ZM11.87,38.57
    c0-13.09,10.65-23.74,23.74-23.74s23.74,10.65,23.74,23.74v17.8H11.87v-17.8ZM66.76,68.25H4.45c-.82,0-1.48-.67-1.48-1.48
    c0-4.09,3.33-7.42,7.42-7.42h50.44c4.09,0,7.42,3.33,7.42,7.42C68.24,67.58,67.57,68.25,66.76,68.25ZM50.6,6.75l2.97-5.93
    c.37-.73,1.26-1.03,1.99-.66c.73.37,1.03,1.26.66,1.99l-2.97,5.93c-.26.52-.79.82-1.33.82c-.22,0-.45-.05-.66-.16
    c-.73-.37-1.03-1.26-.66-1.99h0ZM62.75,17.37c-.58-.58-.58-1.52,0-2.1l5.93-5.93c.58-.58,1.52-.58,2.1,0s.58,1.52,0,2.1
    l-5.93,5.93c-.29.29-.67.43-1.05.43s-.76-.15-1.05-.43h0ZM14.99,2.15c-.36-.73-.07-1.62.66-1.99s1.62-.07,1.99.66l2.97,5.93
    c.36.73.07,1.62-.66,1.99c-.21.11-.44.16-.66.16c-.54,0-1.07-.3-1.33-.82l-2.97-5.93h0ZM.43,11.44c-.58-.58-.58-1.52,0-2.1
    s1.52-.58,2.1,0l5.93,5.93c.58.58.58,1.52,0,2.1c-.29.29-.67.43-1.05.43s-.76-.15-1.05-.43L.43,11.44ZM35.61,28.19
    c0,.82-.66,1.48-1.48,1.48c-4.09,0-7.42,3.33-7.42,7.42c0,.82-.66,1.48-1.48,1.48s-1.48-.66-1.48-1.48
    c0-5.73,4.66-10.39,10.39-10.39c.82,0,1.48.66,1.48,1.48Z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full p-4 mt-4 text-black font-bold">
          <div className="max-w-[1250px] m-auto flex justify-center">
            <div className="w-full flex flex-col gap-4 lg:flex-row lg:items-center justify-between rounded-2xl bg-white p-4">
              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <input
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  className="bg-[#f7f8fc] rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="تلفن همراه"
                  className="bg-[#f7f8fc] rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="نام دامنه"
                  className="bg-[#f7f8fc] rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="خدمت مورد نظر"
                  className="bg-[#f7f8fc] rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
                />
              </div>

              {/* Submit Button */}
              <div className="w-full lg:w-auto">
                <button className="w-full lg:w-32 h-10 bg-[#6FD6E5] text-white rounded-lg mt-2 lg:mt-0 font-light transition-all duration-200 hover:bg-[#5ac7d7]">
                  درخواست نوبت
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1250px] m-auto mt-10 md:mt-20 px-4">
        <div className="flex flex-col lg:flex-row gap-8 justify-center mx-auto items-centerY">
          {/* Left Image */}
          <div className="w-full lg:w-5/12">
            <div className="relative aspect-[16/12] md:aspect-[1]">
              <Image
                src="/homepage/peopleAsset 7.png"
                alt="Main slide"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Text Content */}
          <div className="w-full lg:w-7/12">
            {/* Title + Icon */}
            <div className="flex items-start">
              <svg
                className="w-6 md:w-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 54.59 52.11"
                fill="#1d546b"
                stroke="#1d546b"
                strokeMiterlimit={10}
              >
                <g>
                  <path d="M43.46,24.24h2.77v2.31c0,.26.21.46.46.46s.46-.21.46-.46v-2.31h2.77c2.29,0,4.16-1.87,4.16-4.16v-7.86c0-4.08-3.32-7.39-7.39-7.39s-7.39,3.32-7.39,7.39v7.86c0,2.29,1.87,4.16,4.16,4.16ZM40.23,12.23c0-3.57,2.9-6.47,6.47-6.47s6.47,2.9,6.47,6.47v7.86c0,1.78-1.45,3.23-3.23,3.23h-6.47c-1.78,0-3.23-1.45-3.23-3.23v-7.86ZM46.23,20.08v-2.77c0-.26.21-.46.46-.46s.46.21.46.46v2.77c0,.26-.21.46-.46.46s-.46-.21-.46-.46Z" />
                  <path d="M45.59,23.77v10.96c0,8.38-6.82,15.2-15.2,15.2s-15.2-6.82-15.2-15.2v-2.21c7.28-.56,13.03-6.65,13.03-14.07V5.43c0-2.99-2.43-5.43-5.43-5.43h-5.43v2.17h5.43c1.8,0,3.26,1.46,3.26,3.26v13.03c0,6.59-5.36,11.94-11.94,11.94S2.17,25.04,2.17,18.45V5.43c0-1.8,1.46-3.26,3.26-3.26h5.43V0h-5.43C2.43,0,0,2.44,0,5.43v13.03c0,7.42,5.75,13.52,13.03,14.07v2.21c0,9.58,7.79,17.37,17.37,17.37s17.37-7.79,17.37-17.37v-10.96" />
                </g>
              </svg>
              <div className="mr-4">
                <p className="text-[#1d546b] text-lg md:text-lg font-semibold">
                  اولین کلینیک تخصصی سئو
                </p>
                <div className="flex flex-wrap items-center text-sm md:text-lg">
                  <p className="text-gray-800 text-sm">
                    فروشگاه تخصصی بسته های درمانی برای وبسایت شما
                  </p>
                </div>
              </div>
            </div>

            {/* Paragraph */}
            <p className="pt-6 text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
              <strong>می‌خواهید وبسایت شما در صفحه اول گوگل دیده شود؟</strong> با تحلیل تخصصی و برطرف کردن موانع سئوی سایتتان، مسیر موفقیت شما در جستجوها را هموار می‌کنیم.
            </p>
            <p className="pt-6 text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
              وبوفن، اولین کلینیک تخصصی سئو است که با نسخه هوشمندانه، بیماری‌های وبسایتتان را درمان می‌کند. ما با ارائه "بسته‌های درمانی ماژولار" (مانند قرص بک‌لینک، قرص بهینه‌سازی و قرص بهینه سازی)، پیچیده‌ترین مفاهیم سئو را به ساده‌ترین و مؤثرترین راهکارها تبدیل کرده‌ایم. با تحلیل رایگان وبسایت توسط متخصصان ما، قرص های مناسب برای رشد کسب‌وکار خود را دریافت کنید.
            </p>
            <p className="pt-6 flex text-[#1d546b] text-lg md:text-lg font-semibold">
              <svg width="40px" height="40px" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#1d546b"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="8"></g><g id="SVGRepo_iconCarrier"> <path d="M142 125.853C155.049 97.8883 180.62 82.7645 200.381 78.4757C227.189 72.6575 249.859 84.0511 257.624 112.528C260.302 122.352 259.217 138.128 253.081 148.517C247.426 158.092 239.904 165.942 227.555 176.481C225.251 178.447 217.389 185.018 216.649 185.643C199.849 199.818 191.567 209.152 186.81 220.972C182.053 232.792 182.305 269.489 216.649 266.35" stroke="#1d546b" stroke-opacity="0.9" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M198.744 315.68C198.744 317.274 198.744 319.614 198.744 322.7" stroke="#1d546b" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>  چرا وبوفن را انتخاب کنیم؟
            </p>
            <div className="grid md:flex w-full">
              <div className="w-full md:w-1/2">
                <p className="pt-3 flex text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.91988 12.257C4.2856 12.257 3.65131 12.5199 3.19988 13.0342C2.79417 13.4913 2.59417 14.0799 2.63417 14.6913C2.67417 15.3027 2.94846 15.857 3.4056 16.2627L7.51417 19.8684C7.93131 20.2342 8.46846 20.4399 9.02274 20.4399C9.0856 20.4399 9.14846 20.4399 9.21131 20.4342C9.82846 20.3827 10.4056 20.0799 10.7942 19.5999L20.857 7.27986C21.657 6.30272 21.5085 4.85701 20.5313 4.05701C20.057 3.67415 19.4627 3.49129 18.857 3.55415C18.2513 3.61701 17.7027 3.90844 17.3142 4.38272L8.74846 14.8627L6.42274 12.8227C5.99417 12.4456 5.45131 12.257 4.91988 12.257Z" fill="url(#paint0_linear)"></path> <path d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint1_linear)"></path> <path opacity="0.75" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint2_radial)"></path> <path opacity="0.5" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint3_radial)"></path> <defs> <linearGradient id="paint0_linear" x1="15.825" y1="-13.9667" x2="9.82533" y2="23.9171" gradientUnits="userSpaceOnUse"> <stop stop-color="#00CC00"></stop> <stop offset="0.1878" stop-color="#06C102"></stop> <stop offset="0.5185" stop-color="#17A306"></stop> <stop offset="0.9507" stop-color="#33740C"></stop> <stop offset="1" stop-color="#366E0D"></stop> </linearGradient> <linearGradient id="paint1_linear" x1="15.2501" y1="0.625426" x2="7.43443" y2="23.6215" gradientUnits="userSpaceOnUse"> <stop offset="0.2544" stop-color="#90D856"></stop> <stop offset="0.736" stop-color="#00CC00"></stop> <stop offset="0.7716" stop-color="#0BCD07"></stop> <stop offset="0.8342" stop-color="#29CF18"></stop> <stop offset="0.9166" stop-color="#59D335"></stop> <stop offset="1" stop-color="#90D856"></stop> </linearGradient> <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.452 8.95803) rotate(116.129) scale(8.35776 4.28316)"> <stop stop-color="#FBE07A" stop-opacity="0.75"></stop> <stop offset="0.0803394" stop-color="#FBE387" stop-opacity="0.6897"></stop> <stop offset="0.5173" stop-color="#FDF2C7" stop-opacity="0.362"></stop> <stop offset="0.8357" stop-color="#FFFBF0" stop-opacity="0.1233"></stop> <stop offset="1" stop-color="white" stop-opacity="0"></stop> </radialGradient> <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.6442 17.0245) rotate(155.316) scale(9.80163 4.14906)"> <stop stop-color="#440063" stop-opacity="0.25"></stop> <stop offset="1" stop-color="#420061" stop-opacity="0"></stop> </radialGradient> </defs> </g></svg> مطابق با مشکلات دقیق وبسایتتان هزینه خواهید کرد.
                </p>
                <p className="pt-3 flex text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.91988 12.257C4.2856 12.257 3.65131 12.5199 3.19988 13.0342C2.79417 13.4913 2.59417 14.0799 2.63417 14.6913C2.67417 15.3027 2.94846 15.857 3.4056 16.2627L7.51417 19.8684C7.93131 20.2342 8.46846 20.4399 9.02274 20.4399C9.0856 20.4399 9.14846 20.4399 9.21131 20.4342C9.82846 20.3827 10.4056 20.0799 10.7942 19.5999L20.857 7.27986C21.657 6.30272 21.5085 4.85701 20.5313 4.05701C20.057 3.67415 19.4627 3.49129 18.857 3.55415C18.2513 3.61701 17.7027 3.90844 17.3142 4.38272L8.74846 14.8627L6.42274 12.8227C5.99417 12.4456 5.45131 12.257 4.91988 12.257Z" fill="url(#paint0_linear)"></path> <path d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint1_linear)"></path> <path opacity="0.75" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint2_radial)"></path> <path opacity="0.5" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint3_radial)"></path> <defs> <linearGradient id="paint0_linear" x1="15.825" y1="-13.9667" x2="9.82533" y2="23.9171" gradientUnits="userSpaceOnUse"> <stop stop-color="#00CC00"></stop> <stop offset="0.1878" stop-color="#06C102"></stop> <stop offset="0.5185" stop-color="#17A306"></stop> <stop offset="0.9507" stop-color="#33740C"></stop> <stop offset="1" stop-color="#366E0D"></stop> </linearGradient> <linearGradient id="paint1_linear" x1="15.2501" y1="0.625426" x2="7.43443" y2="23.6215" gradientUnits="userSpaceOnUse"> <stop offset="0.2544" stop-color="#90D856"></stop> <stop offset="0.736" stop-color="#00CC00"></stop> <stop offset="0.7716" stop-color="#0BCD07"></stop> <stop offset="0.8342" stop-color="#29CF18"></stop> <stop offset="0.9166" stop-color="#59D335"></stop> <stop offset="1" stop-color="#90D856"></stop> </linearGradient> <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.452 8.95803) rotate(116.129) scale(8.35776 4.28316)"> <stop stop-color="#FBE07A" stop-opacity="0.75"></stop> <stop offset="0.0803394" stop-color="#FBE387" stop-opacity="0.6897"></stop> <stop offset="0.5173" stop-color="#FDF2C7" stop-opacity="0.362"></stop> <stop offset="0.8357" stop-color="#FFFBF0" stop-opacity="0.1233"></stop> <stop offset="1" stop-color="white" stop-opacity="0"></stop> </radialGradient> <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.6442 17.0245) rotate(155.316) scale(9.80163 4.14906)"> <stop stop-color="#440063" stop-opacity="0.25"></stop> <stop offset="1" stop-color="#420061" stop-opacity="0"></stop> </radialGradient> </defs> </g></svg> مدیریت فرآیند سئو تحت اختیار شماست.
                </p>
                <p className="pt-3 flex text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.91988 12.257C4.2856 12.257 3.65131 12.5199 3.19988 13.0342C2.79417 13.4913 2.59417 14.0799 2.63417 14.6913C2.67417 15.3027 2.94846 15.857 3.4056 16.2627L7.51417 19.8684C7.93131 20.2342 8.46846 20.4399 9.02274 20.4399C9.0856 20.4399 9.14846 20.4399 9.21131 20.4342C9.82846 20.3827 10.4056 20.0799 10.7942 19.5999L20.857 7.27986C21.657 6.30272 21.5085 4.85701 20.5313 4.05701C20.057 3.67415 19.4627 3.49129 18.857 3.55415C18.2513 3.61701 17.7027 3.90844 17.3142 4.38272L8.74846 14.8627L6.42274 12.8227C5.99417 12.4456 5.45131 12.257 4.91988 12.257Z" fill="url(#paint0_linear)"></path> <path d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint1_linear)"></path> <path opacity="0.75" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint2_radial)"></path> <path opacity="0.5" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint3_radial)"></path> <defs> <linearGradient id="paint0_linear" x1="15.825" y1="-13.9667" x2="9.82533" y2="23.9171" gradientUnits="userSpaceOnUse"> <stop stop-color="#00CC00"></stop> <stop offset="0.1878" stop-color="#06C102"></stop> <stop offset="0.5185" stop-color="#17A306"></stop> <stop offset="0.9507" stop-color="#33740C"></stop> <stop offset="1" stop-color="#366E0D"></stop> </linearGradient> <linearGradient id="paint1_linear" x1="15.2501" y1="0.625426" x2="7.43443" y2="23.6215" gradientUnits="userSpaceOnUse"> <stop offset="0.2544" stop-color="#90D856"></stop> <stop offset="0.736" stop-color="#00CC00"></stop> <stop offset="0.7716" stop-color="#0BCD07"></stop> <stop offset="0.8342" stop-color="#29CF18"></stop> <stop offset="0.9166" stop-color="#59D335"></stop> <stop offset="1" stop-color="#90D856"></stop> </linearGradient> <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.452 8.95803) rotate(116.129) scale(8.35776 4.28316)"> <stop stop-color="#FBE07A" stop-opacity="0.75"></stop> <stop offset="0.0803394" stop-color="#FBE387" stop-opacity="0.6897"></stop> <stop offset="0.5173" stop-color="#FDF2C7" stop-opacity="0.362"></stop> <stop offset="0.8357" stop-color="#FFFBF0" stop-opacity="0.1233"></stop> <stop offset="1" stop-color="white" stop-opacity="0"></stop> </radialGradient> <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.6442 17.0245) rotate(155.316) scale(9.80163 4.14906)"> <stop stop-color="#440063" stop-opacity="0.25"></stop> <stop offset="1" stop-color="#420061" stop-opacity="0"></stop> </radialGradient> </defs> </g></svg> گزارشات لحظه ای از هر اقدام را در اختیار دارید.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <p className="pt-3 flex text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.91988 12.257C4.2856 12.257 3.65131 12.5199 3.19988 13.0342C2.79417 13.4913 2.59417 14.0799 2.63417 14.6913C2.67417 15.3027 2.94846 15.857 3.4056 16.2627L7.51417 19.8684C7.93131 20.2342 8.46846 20.4399 9.02274 20.4399C9.0856 20.4399 9.14846 20.4399 9.21131 20.4342C9.82846 20.3827 10.4056 20.0799 10.7942 19.5999L20.857 7.27986C21.657 6.30272 21.5085 4.85701 20.5313 4.05701C20.057 3.67415 19.4627 3.49129 18.857 3.55415C18.2513 3.61701 17.7027 3.90844 17.3142 4.38272L8.74846 14.8627L6.42274 12.8227C5.99417 12.4456 5.45131 12.257 4.91988 12.257Z" fill="url(#paint0_linear)"></path> <path d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint1_linear)"></path> <path opacity="0.75" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint2_radial)"></path> <path opacity="0.5" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint3_radial)"></path> <defs> <linearGradient id="paint0_linear" x1="15.825" y1="-13.9667" x2="9.82533" y2="23.9171" gradientUnits="userSpaceOnUse"> <stop stop-color="#00CC00"></stop> <stop offset="0.1878" stop-color="#06C102"></stop> <stop offset="0.5185" stop-color="#17A306"></stop> <stop offset="0.9507" stop-color="#33740C"></stop> <stop offset="1" stop-color="#366E0D"></stop> </linearGradient> <linearGradient id="paint1_linear" x1="15.2501" y1="0.625426" x2="7.43443" y2="23.6215" gradientUnits="userSpaceOnUse"> <stop offset="0.2544" stop-color="#90D856"></stop> <stop offset="0.736" stop-color="#00CC00"></stop> <stop offset="0.7716" stop-color="#0BCD07"></stop> <stop offset="0.8342" stop-color="#29CF18"></stop> <stop offset="0.9166" stop-color="#59D335"></stop> <stop offset="1" stop-color="#90D856"></stop> </linearGradient> <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.452 8.95803) rotate(116.129) scale(8.35776 4.28316)"> <stop stop-color="#FBE07A" stop-opacity="0.75"></stop> <stop offset="0.0803394" stop-color="#FBE387" stop-opacity="0.6897"></stop> <stop offset="0.5173" stop-color="#FDF2C7" stop-opacity="0.362"></stop> <stop offset="0.8357" stop-color="#FFFBF0" stop-opacity="0.1233"></stop> <stop offset="1" stop-color="white" stop-opacity="0"></stop> </radialGradient> <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.6442 17.0245) rotate(155.316) scale(9.80163 4.14906)"> <stop stop-color="#440063" stop-opacity="0.25"></stop> <stop offset="1" stop-color="#420061" stop-opacity="0"></stop> </radialGradient> </defs> </g></svg> امکان مدیریت و زمان بندی فرآیند ها وجود دارد.
                </p>
                <p className="pt-3 flex text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.91988 12.257C4.2856 12.257 3.65131 12.5199 3.19988 13.0342C2.79417 13.4913 2.59417 14.0799 2.63417 14.6913C2.67417 15.3027 2.94846 15.857 3.4056 16.2627L7.51417 19.8684C7.93131 20.2342 8.46846 20.4399 9.02274 20.4399C9.0856 20.4399 9.14846 20.4399 9.21131 20.4342C9.82846 20.3827 10.4056 20.0799 10.7942 19.5999L20.857 7.27986C21.657 6.30272 21.5085 4.85701 20.5313 4.05701C20.057 3.67415 19.4627 3.49129 18.857 3.55415C18.2513 3.61701 17.7027 3.90844 17.3142 4.38272L8.74846 14.8627L6.42274 12.8227C5.99417 12.4456 5.45131 12.257 4.91988 12.257Z" fill="url(#paint0_linear)"></path> <path d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint1_linear)"></path> <path opacity="0.75" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint2_radial)"></path> <path opacity="0.5" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint3_radial)"></path> <defs> <linearGradient id="paint0_linear" x1="15.825" y1="-13.9667" x2="9.82533" y2="23.9171" gradientUnits="userSpaceOnUse"> <stop stop-color="#00CC00"></stop> <stop offset="0.1878" stop-color="#06C102"></stop> <stop offset="0.5185" stop-color="#17A306"></stop> <stop offset="0.9507" stop-color="#33740C"></stop> <stop offset="1" stop-color="#366E0D"></stop> </linearGradient> <linearGradient id="paint1_linear" x1="15.2501" y1="0.625426" x2="7.43443" y2="23.6215" gradientUnits="userSpaceOnUse"> <stop offset="0.2544" stop-color="#90D856"></stop> <stop offset="0.736" stop-color="#00CC00"></stop> <stop offset="0.7716" stop-color="#0BCD07"></stop> <stop offset="0.8342" stop-color="#29CF18"></stop> <stop offset="0.9166" stop-color="#59D335"></stop> <stop offset="1" stop-color="#90D856"></stop> </linearGradient> <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.452 8.95803) rotate(116.129) scale(8.35776 4.28316)"> <stop stop-color="#FBE07A" stop-opacity="0.75"></stop> <stop offset="0.0803394" stop-color="#FBE387" stop-opacity="0.6897"></stop> <stop offset="0.5173" stop-color="#FDF2C7" stop-opacity="0.362"></stop> <stop offset="0.8357" stop-color="#FFFBF0" stop-opacity="0.1233"></stop> <stop offset="1" stop-color="white" stop-opacity="0"></stop> </radialGradient> <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.6442 17.0245) rotate(155.316) scale(9.80163 4.14906)"> <stop stop-color="#440063" stop-opacity="0.25"></stop> <stop offset="1" stop-color="#420061" stop-opacity="0"></stop> </radialGradient> </defs> </g></svg> از پشتیبانی تخصصی خدمات سئو بهره مند خواهید شد.
                </p>
                <p className="pt-3 flex text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.91988 12.257C4.2856 12.257 3.65131 12.5199 3.19988 13.0342C2.79417 13.4913 2.59417 14.0799 2.63417 14.6913C2.67417 15.3027 2.94846 15.857 3.4056 16.2627L7.51417 19.8684C7.93131 20.2342 8.46846 20.4399 9.02274 20.4399C9.0856 20.4399 9.14846 20.4399 9.21131 20.4342C9.82846 20.3827 10.4056 20.0799 10.7942 19.5999L20.857 7.27986C21.657 6.30272 21.5085 4.85701 20.5313 4.05701C20.057 3.67415 19.4627 3.49129 18.857 3.55415C18.2513 3.61701 17.7027 3.90844 17.3142 4.38272L8.74846 14.8627L6.42274 12.8227C5.99417 12.4456 5.45131 12.257 4.91988 12.257Z" fill="url(#paint0_linear)"></path> <path d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint1_linear)"></path> <path opacity="0.75" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint2_radial)"></path> <path opacity="0.5" d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z" fill="url(#paint3_radial)"></path> <defs> <linearGradient id="paint0_linear" x1="15.825" y1="-13.9667" x2="9.82533" y2="23.9171" gradientUnits="userSpaceOnUse"> <stop stop-color="#00CC00"></stop> <stop offset="0.1878" stop-color="#06C102"></stop> <stop offset="0.5185" stop-color="#17A306"></stop> <stop offset="0.9507" stop-color="#33740C"></stop> <stop offset="1" stop-color="#366E0D"></stop> </linearGradient> <linearGradient id="paint1_linear" x1="15.2501" y1="0.625426" x2="7.43443" y2="23.6215" gradientUnits="userSpaceOnUse"> <stop offset="0.2544" stop-color="#90D856"></stop> <stop offset="0.736" stop-color="#00CC00"></stop> <stop offset="0.7716" stop-color="#0BCD07"></stop> <stop offset="0.8342" stop-color="#29CF18"></stop> <stop offset="0.9166" stop-color="#59D335"></stop> <stop offset="1" stop-color="#90D856"></stop> </linearGradient> <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.452 8.95803) rotate(116.129) scale(8.35776 4.28316)"> <stop stop-color="#FBE07A" stop-opacity="0.75"></stop> <stop offset="0.0803394" stop-color="#FBE387" stop-opacity="0.6897"></stop> <stop offset="0.5173" stop-color="#FDF2C7" stop-opacity="0.362"></stop> <stop offset="0.8357" stop-color="#FFFBF0" stop-opacity="0.1233"></stop> <stop offset="1" stop-color="white" stop-opacity="0"></stop> </radialGradient> <radialGradient id="paint3_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.6442 17.0245) rotate(155.316) scale(9.80163 4.14906)"> <stop stop-color="#440063" stop-opacity="0.25"></stop> <stop offset="1" stop-color="#420061" stop-opacity="0"></stop> </radialGradient> </defs> </g></svg> از دلایل کسب نتیجه مطلوب آگاه خواهید شد.
                </p>
              </div>
            </div>
            {/* Footer */}
            <div className="hidden flex-row md:flex-row items-center justify-between mt-8 gap-4 md:gap-0">
              {/* Person Info */}
              <div className="flex items-center">
                <div className="w-1 h-12 bg-[#1d546b] rounded-lg"></div>
                <div className="mr-4">
                  <p className="text-gray-800 text-sm md:text-base">
                    دکتر مجتبی خداخواه
                  </p>
                  <p className="text-[#6FD6E5] text-xs md:text-sm">
                    متخصص سئو سایت
                  </p>
                </div>
              </div>

              {/* Button */}
              <div className=" md:w-auto">
                <button className="w-32 h-10 bg-[#6FD6E5] text-white rounded-lg">
                  بیشتر بدانید...
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mt-8 md:mt-20" style={{ background: "linear-gradient(180deg,rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 25%, rgba(247, 248, 252, 1) 25%, rgba(247, 248, 252, 1) 100%);" }}>
        {/* Image container (no background color) */}
        <div className="max-w-[1250px] m-auto relative p-4 md:p-0">
          <div className="grid md:flex w-full md:h-[344] mb-0 md:mb-10 rounded-3xl bg-[#29b0cb] md:bg-white md:bg-[url(/homepage/bg1.webp)]">
            <div id="first" className="order-2 md:order-1 w-full md:w-2/3">
              <div className="w-full">
                <div className="flex mr-4 h-26 mb-1 items-center">
                  <div className="ml-3">
                    <svg
                      className="w-8"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 54.59 52.11"
                      fill="#1d546b"
                      stroke="#1d546b"
                      strokeMiterlimit={10}
                    >
                      <g>
                        <path d="M43.46,24.24h2.77v2.31c0,.26.21.46.46.46s.46-.21.46-.46v-2.31h2.77c2.29,0,4.16-1.87,4.16-4.16v-7.86c0-4.08-3.32-7.39-7.39-7.39s-7.39,3.32-7.39,7.39v7.86c0,2.29,1.87,4.16,4.16,4.16ZM40.23,12.23c0-3.57,2.9-6.47,6.47-6.47s6.47,2.9,6.47,6.47v7.86c0,1.78-1.45,3.23-3.23,3.23h-6.47c-1.78,0-3.23-1.45-3.23-3.23v-7.86ZM46.23,20.08v-2.77c0-.26.21-.46.46-.46s.46.21.46.46v2.77c0,.26-.21.46-.46.46s-.46-.21-.46-.46Z" />
                        <path d="M45.59,23.77v10.96c0,8.38-6.82,15.2-15.2,15.2s-15.2-6.82-15.2-15.2v-2.21c7.28-.56,13.03-6.65,13.03-14.07V5.43c0-2.99-2.43-5.43-5.43-5.43h-5.43v2.17h5.43c1.8,0,3.26,1.46,3.26,3.26v13.03c0,6.59-5.36,11.94-11.94,11.94S2.17,25.04,2.17,18.45V5.43c0-1.8,1.46-3.26,3.26-3.26h5.43V0h-5.43C2.43,0,0,2.44,0,5.43v13.03c0,7.42,5.75,13.52,13.03,14.07v2.21c0,9.58,7.79,17.37,17.37,17.37s17.37-7.79,17.37-17.37v-10.96" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1d546b] text-xl font-semibold">
                      حوزه تخصصی و درمان
                    </p>
                    <div className="flex flex-wrap items-center mt-1">
                      <p className="text-gray-800 text-2xl font-semibold">
                        خدمات تخصصی کلینیک
                      </p>
                      <p className="text-[#6FD6E5] text-2xl pr-2 font-semibold">
                        وبوفن
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block md:flex w-full h-100 md:h-58 items-center">
                <div className="w-full px-6 py-2 md:p-6 md:w-1/2">
                  <div className="w-full border border-white hover:bg-[#1d546b] hover:border-[#1d546b] flex items-center text-white rounded-4xl p-4 h-full sm:w-auto text-center text-sm sm:text-base">
                    <svg
                      className="w-35 h-35 p-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 106.53 102.09"
                    >
                      <path
                        fill="#f7f8fc"
                        d="M86.55,0H19.97C8.96,0,0,8.96,0,19.97v57.7c0,11.01,8.96,19.97,19.97,19.97h31.07c1.23,0,2.22-.99,2.22-2.22s-.99-2.22-2.22-2.22h-31.07c-8.57,0-15.54-6.97-15.54-15.54v-42.17h97.65v19.97c0,1.23.99,2.22,2.22,2.22s2.22-.99,2.22-2.22V19.97c0-11.01-8.96-19.97-19.97-19.97ZM4.44,31.07v-11.1c0-8.57,6.97-15.54,15.54-15.54h66.58c8.57,0,15.54,6.97,15.54,15.54v11.1H4.44ZM22.19,17.75c0,2.45-1.99,4.44-4.44,4.44s-4.44-1.99-4.44-4.44,1.99-4.44,4.44-4.44,4.44,1.99,4.44,4.44ZM35.51,17.75c0,2.45-1.99,4.44-4.44,4.44s-4.44-1.99-4.44-4.44,1.99-4.44,4.44-4.44,4.44,1.99,4.44,4.44ZM48.82,17.75c0,2.45-1.99,4.44-4.44,4.44s-4.44-1.99-4.44-4.44,1.99-4.44,4.44-4.44,4.44,1.99,4.44,4.44ZM92.63,85.06c3.13-3.83,5.02-8.72,5.02-14.04,0-12.24-9.96-22.19-22.19-22.19s-22.19,9.96-22.19,22.19,9.96,22.19,22.19,22.19c5.32,0,10.21-1.88,14.04-5.02l13.24,13.24c.43.43,1,.65,1.57.65s1.14-.22,1.57-.65c.87-.87.87-2.27,0-3.14l-13.24-13.24h0ZM75.46,88.77c-9.79,0-17.75-7.96-17.75-17.75s7.96-17.75,17.75-17.75,17.75,7.96,17.75,17.75-7.96,17.75-17.75,17.75Z"
                      />
                    </svg>
                    <div className="text-start pr-5">
                      <h2 className="pb-1 text-xl">خدمات سئو</h2>
                      <p className="text-sm">
                        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full px-6 py-2 md:p-6 md:w-1/2">
                  <div className="w-full text-white flex items-center border border-white hover:bg-[#1d546b] hover:border-[#1d546b] rounded-4xl p-4 sm:w-auto text-center text-sm sm:text-base">
                    <svg
                      className="w-38 h-38 p-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 107.48 103"
                    >
                      <path
                        fill="#ffff"
                        d="M87.33,0H20.15C9.04,0,0,9.04,0,20.15v58.22c0,11.11,9.04,20.15,20.15,20.15h8.96c1.24,0,2.24-1,2.24-2.24s-1-2.24-2.24-2.24h-8.96c-8.64,0-15.67-7.03-15.67-15.67v-42.54h98.52v42.54c0,8.64-7.03,15.67-15.67,15.67h-8.96c-1.24,0-2.24,1-2.24,2.24s1,2.24,2.24,2.24h8.96c11.11,0,20.15-9.04,20.15-20.15V20.15c0-11.11-9.04-20.15-20.15-20.15ZM4.48,31.35v-11.2c0-8.64,7.03-15.67,15.67-15.67h67.17c8.64,0,15.67,7.03,15.67,15.67v11.2H4.48ZM22.39,17.91c0,2.47-2.01,4.48-4.48,4.48s-4.48-2.01-4.48-4.48,2.01-4.48,4.48-4.48,4.48,2.01,4.48,4.48ZM35.83,17.91c0,2.47-2.01,4.48-4.48,4.48s-4.48-2.01-4.48-4.48,2.01-4.48,4.48-4.48,4.48,2.01,4.48,4.48ZM49.26,17.91c0,2.47-2.01,4.48-4.48,4.48s-4.48-2.01-4.48-4.48,2.01-4.48,4.48-4.48,4.48,2.01,4.48,4.48ZM80.61,64.93c0,8.48-3.89,16.28-10.66,21.4-1.76,1.34-2.78,3.3-2.78,5.4v9.02c0,1.24-1,2.24-2.24,2.24s-2.24-1-2.24-2.24v-9.02c0-3.51,1.66-6.78,4.55-8.97,5.65-4.27,8.88-10.77,8.88-17.83,0-5.61-2.09-10.97-5.88-15.11-.78-.85-1.72-.58-1.99-.47-.33.13-1.08.54-1.08,1.59v6.62c0,7.17-5.3,13.33-12.06,14-3.8.4-7.58-.86-10.39-3.4-2.81-2.54-4.42-6.18-4.42-9.96v-7.26c0-1.06-.76-1.47-1.08-1.59-.27-.1-1.2-.38-1.99.47-3.79,4.14-5.88,9.5-5.88,15.11,0,7.06,3.24,13.56,8.88,17.83,2.89,2.19,4.55,5.46,4.55,8.97v9.02c0,1.24-1,2.24-2.24,2.24s-2.24-1-2.24-2.24v-9.02c0-2.1-1.01-4.06-2.78-5.4-6.77-5.13-10.66-12.93-10.66-21.4,0-6.73,2.51-13.17,7.06-18.13,1.77-1.93,4.48-2.57,6.91-1.62,2.39.93,3.94,3.19,3.94,5.77v7.26c0,2.53,1.07,4.94,2.95,6.64,1.9,1.72,4.37,2.53,6.94,2.27,4.5-.46,8.03-4.65,8.03-9.55v-6.62c0-2.57,1.55-4.84,3.94-5.77,2.43-.95,5.14-.31,6.91,1.62,4.55,4.96,7.06,11.4,7.06,18.13Z"
                      />
                    </svg>
                    <div className="text-start pr-5">
                      <h2 className="pb-1 text-xl">خدمات طراحی سایت</h2>
                      <p className="text-sm">
                        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="Second" className="order-1 md:order-2 w-full pt-2 md:w-1/3">
              <div className="relative w-full md:w-2/4 mx-auto h-[220px] md:h-[100%]  rounded-lg">
                <Image
                  src="/homepage/hero2.webp"
                  alt="Main slide"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Background section starts from mid-image */}
        <div className="w-full  relative ">
          <div className="max-w-[1250px] p-8 md:p-0 mx-auto">
            
              <div className="flex items-center justify-center md:justify-start">
                <h3 className="text-gray-800 font-semibold">
                  قرص های پر بازدید کیلینیک
                </h3>
                <h3 className="text-[#6FD6E5] pr-2">وبوفن</h3>
              </div>
              <Popularpills />
            </div>
          
        </div>
      </section>

      <section className="max-w-[1250px] m-auto ">
        <Pathsection />
        <div className="w-full">
          <div className="relative py-10 md:py-20">
            <div className="relative w-full aspect-[13/5] md:aspect-[13/2] rounded-lg overflow-hidden flex items-start">
              <Image
                src="/homepage/ourteam.png"
                alt="Main slide"
                fill
                className="object-cover"
              />

              {/* Overlay Content */}
              <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10 p-3 md:p-4 rounded-xl max-w-full md:max-w-[70%]">
                <div className="mr-2 md:mr-4 w-full md:w-64">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                    <p className="text-white text-lg md:text-xl whitespace-nowrap">
                      تیم ما
                    </p>
                    <button className="bg-[#6FD6E5] hover:bg-[#1d546b] py-2 px-4 md:px-6 rounded-4xl text-white hover:scale-105 transition-all cursor-pointer text-sm md:text-base">
                      مشاهده اعضا
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-[70%] mt-3 md:mt-4 text-sm md:text-base text-white">
                  <p>
                    لورم ایپسوم متن ساختگی با تولید سادگی که لازم است، و برای شرایط فعلی
                    تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود فراوان جامعه و
                    متخصصان را می‌طلبد، تا با نرم‌افزارها شناخت بیشتری را برای طراحان
                    رایانه‌ای علی مورد نیاز قرار گیرد.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fc] w-full">
        <div className="max-w-[1250] m-auto px-8 md:px-0 flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Left Section: Centered Text */}
          <div className="w-full md:w-[40%] flex justify-center items-center text-center md:text-right mt-30">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                مشتریان ، درباره <span className="text-[#3db4c6]">وبوفن</span> چه
                می‌گویند ؟
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
                استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله
                در ستون و سطرآنچنان که لازم است...
              </p>
            </div>
          </div>

          {/* Right Section: Swiper */}
          <div className="md:w-[60%] w-full">
            <Commentsabtus />
          </div>
        </div>
      </section>
      <section className="max-w-[1250px] m-auto">
        <div className=" relative py-10">
          <Reservetime />
        </div>
      </section>
    </main>
  );
}
