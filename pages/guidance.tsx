"use client";
import Image from "next/image";
import React from "react";
import { useState } from "react";
export default function guidance() {
  const [activeDiv, setActiveDiv] = useState<string | null>("first");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleClick = (divName: string) => {
    // If the clicked div is already active, close it; otherwise open it
    setActiveDiv((prev) => (prev === divName ? null : divName));
  };

  const faqs = [
    {
      id: 1,
      question: "چطور می‌توانم در سایت ثبت‌نام کنم؟",
      answer:
        "برای ثبت‌نام کافی است روی دکمه ثبت‌نام کلیک کنید و اطلاعات خواسته شده را وارد نمایید.",
    },
    {
      id: 2,
      question: "آیا خدمات شما رایگان است؟",
      answer:
        "بله، بخشی از خدمات ما کاملاً رایگان ارائه می‌شود و برای خدمات ویژه می‌توانید پلن‌های ما را مشاهده کنید.",
    },
    {
      id: 3,
      question: "چطور می‌توانم با پشتیبانی تماس بگیرم؟",
      answer:
        "می‌توانید از طریق بخش تماس با ما، ایمیل یا شماره تلفن پشتیبانی با ما در ارتباط باشید.",
    },
    {
      id: 4,
      question: "چطور می‌توانم با پشتیبانی تماس بگیرم؟",
      answer:
        "می‌توانید از طریق بخش تماس با ما، ایمیل یا شماره تلفن پشتیبانی با ما در ارتباط باشید.",
    },
    {
      id: 5,
      question: "چطور می‌توانم با پشتیبانی تماس بگیرم؟",
      answer:
        "می‌توانید از طریق بخش تماس با ما، ایمیل یا شماره تلفن پشتیبانی با ما در ارتباط باشید.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <main>
      <div className="max-w-[1440px] w-11/12 m-auto pt-12">
        <div className="w-full bg-gray-500 rounded-2xl h-64"></div>

        <section className="mt-10 px-4">
          <div className="flex flex-col lg:flex-row gap-8 justify-center mx-auto items-center w-11/12">
            {/* Left Image */}
            <div className="w-full lg:w-5/12">
              <div className="relative w-full aspect-[16/14] rounded-lg overflow-hidden flex items-start">
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
                  <p className="text-[#1d546b] text-base md:text-lg font-semibold">
                    درباره ما
                  </p>
                  <div className="flex flex-wrap items-center text-base md:text-lg">
                    <p className="text-gray-800 font-semibold">
                      مرکز تخصصی درمان
                    </p>
                    <p className="text-[#1d546b] pr-2 font-semibold">وب سایت</p>
                  </div>
                </div>
              </div>

              {/* Paragraph */}
              <p className="pt-6 text-sm md:text-base text-gray-600 leading-relaxed">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
                استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله
                در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد
                نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد،
                کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان
                جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را
                برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در
                زبان فارسی ایجاد قرار گیرد.
              </p>

              {/* Footer */}
              <div className="flex flex-row md:flex-row items-center justify-between mt-8 gap-4 md:gap-0">
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
        <section className="mt-10 flex flex-col gap-4">
          <div className="md:flex items-center border-3 border-gray-200 bg-gray-100 rounded-2xl md:rounded-full p-2">
            <div className="flex items-center ml-4 md:w-1/4">
              <div className="bg-[#6fd6e5] w-16 h-16 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 p-2"
                  id="Layer_2"
                  data-name="Layer 2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 54.54 54.54"
                >
                  <g id="Layer_1-2" data-name="Layer 1">
                    <path
                      fill="#1d546b"
                      d="M23.86,52.27h-13.64c-4.39,0-7.95-3.57-7.95-7.95v-15.91c0-4.39,3.57-7.95,7.95-7.95,1.88,0,3.41-1.53,3.41-3.41v-5.68h13.56l.06,5.72c.02,1.86,1.55,3.37,3.43,3.37,3.63,0,6.8,2.45,7.7,5.97.16.61.79.97,1.38.82.61-.16.97-.78.82-1.38-1.16-4.52-5.24-7.67-9.93-7.67-.62,0-1.13-.5-1.14-1.12l-.06-5.8c2.63-.5,4.62-2.8,4.62-5.57,0-3.13-2.55-5.68-5.68-5.68h-15.91c-3.13,0-5.68,2.55-5.68,5.68,0,2.74,1.95,5.04,4.55,5.57v5.8c0,.63-.51,1.14-1.14,1.14-5.64,0-10.23,4.59-10.23,10.22v15.91c0,5.64,4.59,10.23,10.23,10.23h13.64c.63,0,1.14-.51,1.14-1.14s-.51-1.14-1.14-1.14ZM9.09,5.68c0-1.88,1.53-3.41,3.41-3.41h15.91c1.88,0,3.41,1.53,3.41,3.41s-1.53,3.41-3.41,3.41h-15.91c-1.88,0-3.41-1.53-3.41-3.41ZM29.55,36.36c0,.63-.51,1.14-1.14,1.14h-6.82v6.82c0,.63-.51,1.14-1.14,1.14s-1.14-.51-1.14-1.14v-6.82h-6.82c-.63,0-1.14-.51-1.14-1.14s.51-1.14,1.14-1.14h6.82v-6.82c0-.63.51-1.14,1.14-1.14s1.14.51,1.14,1.14v6.82h6.82c.63,0,1.14.51,1.14,1.14ZM52.36,31.72c-2.9-2.9-7.63-2.9-10.54,0l-10.1,10.1c-2.9,2.9-2.9,7.63,0,10.54,1.45,1.45,3.36,2.18,5.27,2.18s3.82-.72,5.27-2.18l10.1-10.1c2.9-2.9,2.9-7.63,0-10.54h0ZM40.66,50.75c-2.02,2.02-5.3,2.02-7.32,0-2.01-1.93-2.01-5.4,0-7.32l4.39-4.39,7.32,7.32-4.39,4.39ZM50.76,40.65l-4.11,4.11-7.32-7.32,4.11-4.11c2.02-2.02,5.3-2.02,7.32,0,2.01,1.93,2.01,5.4,0,7.32Z"
                    />
                  </g>
                </svg>
              </div>
              <div className="text-gray-700 text-md mr-4">
                <span className="block font-semibold">قرص های وبوفن</span>
                <span className="block">برای بهترین عملکرد سئو</span>
              </div>
            </div>
            <div className="md:ml-2 flex gap-4 bg-gray-300 rounded-4xl h-12 md:w-3/4 md:mt-0 mt-2">
              <button
                onClick={() => handleClick("first")}
                className={`md:px-6 text-sm md:text-md py-1 rounded-full h-12 w-1/3 ${
                  activeDiv === "first"
                    ? "bg-[#1d546b] text-white"
                    : " text-black"
                }`}
              >
                تمامی قرص ها
              </button>
              <button
                onClick={() => handleClick("second")}
                className={`md:px-6 text-sm md:text-md py-1 rounded-full h-12 w-1/3 ${
                  activeDiv === "second"
                    ? "bg-[#1d546b] text-white"
                    : " text-black"
                }`}
              >
                قرص های سئو داخلی
              </button>
              <button
                onClick={() => handleClick("third")}
                className={`md:px-6 text-sm md:text-md py-1 rounded-full h-12 w-1/3 ${
                  activeDiv === "third"
                    ? "bg-[#1d546b] text-white"
                    : " text-black"
                }`}
              >
                قرص های سئو خارجی
              </button>
            </div>
          </div>

          {/* Conditionally render only the active div */}
          {activeDiv === "first" && (
            <div className="mt-4 md:px-20">
              <div className="grid md:grid-cols-3 grid-cols-1 gap-10 text-gray-600">
                <div className="relative w-full aspect-[16/8] rounded-lg overflow-hidden flex items-start">
                  <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
                    <span className="text-white font-bold text-2xl">
                      قرص امنیت سایت
                    </span>
                    <span className="text-white  text-md w-2/3">
                      ایمن سازی سایت
                    </span>
                    <button className="flex justify-between items-center bg-white rounded-full py-1  w-3/5">
                      <span className="text-sm mr-2">مشاهده</span>
                      <svg
                        className="w-5 h-5 p-1 ml-1 rounded-full bg-[#f63e2f]"
                        fill="#ffffff"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 330 330"
                        stroke="#ffffff"
                      >
                        <path
                          d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
       l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
       C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"
                        />
                      </svg>
                    </button>
                  </div>
                  <Image
                    src="/guidance/fisrtpillAsset.png"
                    alt="Main slide"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative w-full aspect-[16/8] rounded-lg overflow-hidden flex items-start">
                  <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
                    <span className="text-white font-bold text-2xl">
                      قرص امنیت سایت
                    </span>
                    <span className="text-white  text-md w-2/3">
                      ایمن سازی سایت
                    </span>
                    <button className="flex justify-between items-center bg-white rounded-full py-1  w-3/5">
                      <span className="text-sm mr-2">مشاهده</span>
                      <svg
                        className="w-5 h-5 p-1 ml-1 rounded-full bg-[#f63e2f]"
                        fill="#ffffff"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 330 330"
                        stroke="#ffffff"
                      >
                        <path
                          d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
       l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
       C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"
                        />
                      </svg>
                    </button>
                  </div>
                  <Image
                    src="/guidance/secondpillAsset 6.png"
                    alt="Main slide"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative w-full aspect-[16/8] rounded-lg overflow-hidden flex items-start">
                  <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
                    <span className="text-white font-bold text-2xl">
                      قرص امنیت سایت
                    </span>
                    <span className="text-white  text-md w-2/3">
                      ایمن سازی سایت
                    </span>
                    <button className="flex justify-between items-center bg-white rounded-full py-1  w-3/5">
                      <span className="text-sm mr-2">مشاهده</span>
                      <svg
                        className="w-5 h-5 p-1 ml-1 rounded-full bg-[#f63e2f]"
                        fill="#ffffff"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 330 330"
                        stroke="#ffffff"
                      >
                        <path
                          d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
       l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
       C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"
                        />
                      </svg>
                    </button>
                  </div>
                  <Image
                    src="/guidance/thirdpillAsset 7.png"
                    alt="Main slide"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative w-full aspect-[16/8] rounded-lg overflow-hidden flex items-start">
                  <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
                    <span className="text-white font-bold text-2xl">
                      قرص امنیت سایت
                    </span>
                    <span className="text-white  text-md w-2/3">
                      ایمن سازی سایت
                    </span>
                    <button className="flex justify-between items-center bg-white rounded-full py-1  w-3/5">
                      <span className="text-sm mr-2">مشاهده</span>
                      <svg
                        className="w-5 h-5 p-1 ml-1 rounded-full bg-[#f63e2f]"
                        fill="#ffffff"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 330 330"
                        stroke="#ffffff"
                      >
                        <path
                          d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
       l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
       C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"
                        />
                      </svg>
                    </button>
                  </div>
                  <Image
                    src="/guidance/forthpillAsset 9.png"
                    alt="Main slide"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative w-full aspect-[16/8] rounded-lg overflow-hidden flex items-start">
                  <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
                    <span className="text-white font-bold text-2xl">
                      قرص امنیت سایت
                    </span>
                    <span className="text-white  text-md w-2/3">
                      ایمن سازی سایت
                    </span>
                    <button className="flex justify-between items-center bg-white rounded-full py-1  w-3/5">
                      <span className="text-sm mr-2">مشاهده</span>
                      <svg
                        className="w-5 h-5 p-1 ml-1 rounded-full bg-[#f63e2f]"
                        fill="#ffffff"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 330 330"
                        stroke="#ffffff"
                      >
                        <path
                          d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
       l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
       C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"
                        />
                      </svg>
                    </button>
                  </div>
                  <Image
                    src="/guidance/fifthpillAsset 10.png"
                    alt="Main slide"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative w-full aspect-[16/8] rounded-lg overflow-hidden flex items-start">
                  <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
                    <span className="text-white font-bold text-2xl">
                      قرص امنیت سایت
                    </span>
                    <span className="text-white  text-md w-2/3">
                      ایمن سازی سایت
                    </span>
                    <button className="flex justify-between items-center bg-white rounded-full py-1  w-3/5">
                      <span className="text-sm mr-2">مشاهده</span>
                      <svg
                        className="w-5 h-5 p-1 ml-1 rounded-full bg-[#f63e2f]"
                        fill="#ffffff"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 330 330"
                        stroke="#ffffff"
                      >
                        <path
                          d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
       l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
       C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"
                        />
                      </svg>
                    </button>
                  </div>
                  <Image
                    src="/guidance/sixthpillAsset 11.png"
                    alt="Main slide"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          )}
          {activeDiv === "second" && (
            <div className="mt-4 p-4 bg-gray-300 rounded">
              This is the second div.
            </div>
          )}
          {activeDiv === "third" && (
            <div className="mt-4 p-4 bg-gray-400 rounded">
              This is the third div.
            </div>
          )}
          {/*need banner*/}
          <div className="flex gap-6 items-center">
            <div className="bg-[#1d546b] w-1/2 h-64 rounded-4xl">1</div>
            <div className="bg-[#1d546b] w-1/2 h-64 rounded-4xl">2</div>
          </div>
          {/*FAQ*/}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center bg-[#f5f4f2] p-8 rounded-4xl justify-between mt-14">
            {/* FAQ Section */}
            <div className="w-full lg:w-3/5">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white mt-2 rounded-md p-4 text-gray-600"
                >
                  <div className="border-b border-white/30">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex justify-between items-center text-right"
                    >
                      <span className="font-medium">{faq.question}</span>
                    </button>
                    {activeIndex === index && (
                      <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Form Section */}
            <div className="bg-white w-full lg:w-[30%] rounded-lg">
              <div className="p-6">
                <div className="flex items-center text-xl">
                  <div className="w-2 h-10 bg-[#6fd6e5] rounded-2xl ml-2"></div>
                  <span className="text-gray-700 font-semibold">درخواست</span>
                  <span className="text-[#1d546b] mr-1 font-semibold">
                    مشاوره رایگان
                  </span>
                </div>

                <div className="text-center w-full mt-2">
                  <p className="text-gray-600">
                    پس از ارسال همکاران ما با شما تماس خواهند گرفت
                  </p>
                </div>

                <div className="text-center w-full mt-10">
                  <input
                    className="w-full border border-gray-200 py-2 rounded-md px-1 text-gray-500"
                    placeholder="نام"
                  />
                  <input
                    className="w-full border border-gray-200 mt-4 py-2 rounded-md px-1 text-gray-500"
                    placeholder="شماره تماس"
                  />
                  <textarea
                    className="w-full h-26 border border-gray-200 mt-4 px-1 py-2 rounded-md text-gray-500"
                    placeholder="پیام خود را بنویسید"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
