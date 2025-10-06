"use client";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import GuidanceForm from "@/components/GuidanceForm";
import HoverVideo from "@/components/videos/hovervideos";
import Pills from "@/components/pills";
import { useProducts } from "@/hooks/useproduct";

export default function ProductList() {
  const [page, setPage] = useState(1);
    const [activeDiv, setActiveDiv] = useState<string | null>("first");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [limit] = useState(10);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const NEXT_PUBLIC_CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;
  const { products, total, loading } = useProducts({
    page,
    limit,
    category,
    sort,
    order,
  });
  // Refs for each section
  const firstRef = useRef<HTMLDivElement | null>(null);
  const secondRef = useRef<HTMLDivElement | null>(null);
  const thirdRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (divName: string) => {
    setActiveDiv(divName);

    // Scroll to the selected section
    let ref: React.RefObject<HTMLDivElement | null> | null = null;
    if (divName === "first") ref = firstRef;
    if (divName === "second") ref = secondRef;
    if (divName === "third") ref = thirdRef;

    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const faqs = [
    {
      id: 1,
      question: "چطور می ‌توانم در سایت ثبت‌ نام کنم؟",
      answer:
        "برای ثبت‌ نام کافی است روی دکمه ثبت‌ نام کلیک کنید و اطلاعات خواسته شده را وارد نمایید.",
    },
    {
      id: 2,
      question: "آیا خدمات شما رایگان است؟",
      answer:
        "بله، بخشی از خدمات ما کاملاً رایگان ارائه می‌ شود و برای خدمات ویژه می‌ توانید پلن ‌های ما را مشاهده کنید.",
    },
    {
      id: 3,
      question: "چطور می‌ توانم با پشتیبانی تماس بگیرم؟",
      answer:
        "می‌ توانید از طریق بخش تماس با ما، ایمیل یا شماره تلفن پشتیبانی با ما در ارتباط باشید.",
    },
    {
      id: 4,
      question: "چطور می ‌توانم با پشتیبانی تماس بگیرم؟",
      answer:
        "می‌ توانید از طریق بخش تماس با ما، ایمیل یا شماره تلفن پشتیبانی با ما در ارتباط باشید.",
    },
    {
      id: 5,
      question: "چطور می‌ توانم با پشتیبانی تماس بگیرم؟",
      answer:
        "می‌ توانید از طریق بخش تماس با ما، ایمیل یا شماره تلفن پشتیبانی با ما در ارتباط باشید.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <main>
      <div className="max-w-[1250px] m-auto p-4">
        <div className="relative w-full aspect-[3/1] md:aspect-[12/2] mt-10 md:rounded-lg overflow-hidden flex items-start">
          <Image
            src="/guidance/pharmacy-banner-main.webp"
            alt="Main slide"
            fill
            className="object-contain md:block hidden"
            priority
          />
          <Image
            src="/guidance/pharmacy-banner.webp"
            alt="Main slide"
            fill
            className="object-contain md:hidden block rounded-3xl"
            priority
          />
        </div>
        <section className="mt-14 max-w-[1250px]">
          <div className="flex flex-col lg:flex-row gap-8 justify-center mx-auto items-center">
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
                    داروخانه وبوفن
                  </p>
                  <div className="flex flex-wrap items-center text-base md:text-lg">
                    <p className="text-gray-800 font-semibold">
                      انتخاب مسیر درمان
                    </p>
                    <p className="text-[#1d546b] pr-2 font-semibold">وب سایت</p>
                  </div>
                </div>
              </div>

              {/* Paragraph */}
              <p className="pt-6 text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
                در داروخانه وبوفن، هر «قرص» یک درمان تخصصی برای مشکل خاصی از
                سئوی سایت شماست. ما پیچیدگی‌های سئو را کنار زده‌ایم و آن را به
                شکل بسته‌های خدماتی شفاف، ساده و نتیجه‌بخش «قرص» درآورده‌ایم.
                شما تنها با چند کلیک و بر اساس نیاز واقعی سایتتان، داروی مناسب
                را انتخاب و خریداری کنید.
              </p>
              <p className="pt-6 flex text-[#1d546b] text-lg md:text-lg font-semibold">
                <svg
                  fill="#1d546b"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke-width="0.5"
                  width="30px"
                  height="30px"
                  viewBox="0 0 923.041 923.041"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <path d="M53.033,453.524c13.329,0,26.667-5.046,36.897-15.154l42.209-41.706c0.196,16.096,2.591,51.106,17.453,92.885 c17.89,50.292,58.05,120.956,147.771,171.995c47.815,27.2,81.139,69.314,99.041,125.176c11.772,36.73,13.031,68.296,13.107,78.33 c-0.003,1.83,0.01,3.661,0.01,5.491c0,28.995,23.505,52.5,52.5,52.5s52.499-23.504,52.5-52.499c0-1.832,0.01-3.663,0.01-5.495 c0.076-10.031,1.335-41.597,13.107-78.328c17.902-55.86,51.226-97.975,99.041-125.176 c89.721-51.039,129.881-121.703,147.771-171.995c14.922-41.945,17.276-77.072,17.455-93.08l40.763,41.253 c20.379,20.625,53.618,20.825,74.243,0.445c20.625-20.379,20.825-53.62,0.445-74.245l-129.912-131.48 c-9.786-9.905-23.105-15.516-37.03-15.599c-0.104-0.001-0.21-0.001-0.313-0.001c-13.812,0-27.07,5.442-36.899,15.155 L569.928,363.68c-20.625,20.379-20.825,53.62-0.445,74.245c10.271,10.394,23.804,15.6,37.347,15.6 c13.329,0,26.667-5.046,36.897-15.154l43.175-42.659c-0.14,8.029-1.547,32.798-12.812,62.555 c-17.774,46.945-51.193,84.632-99.327,112.013c-22.067,12.554-42.195,27.429-60.24,44.401V178.628l41.747,42.251 c20.38,20.625,53.62,20.825,74.244,0.445c20.625-20.379,20.825-53.62,0.444-74.245L501.045,15.6 c-9.786-9.905-23.106-15.516-37.03-15.599C463.909,0,463.805,0,463.7,0c-13.811,0-27.069,5.442-36.898,15.155L293.529,146.837 c-20.625,20.379-20.825,53.62-0.444,74.245c10.271,10.394,23.804,15.6,37.347,15.6c13.329,0,26.667-5.046,36.896-15.155 l42.192-41.689V614.68c-18.045-16.973-38.173-31.848-60.24-44.401c-48.134-27.382-81.553-65.067-99.327-112.013 c-11.375-30.043-12.7-54.999-12.816-62.778l41.731,42.235c20.38,20.625,53.62,20.825,74.244,0.445 c20.625-20.379,20.825-53.62,0.445-74.245l-129.912-131.48c-9.786-9.905-23.106-15.516-37.03-15.599 c-0.105-0.001-0.21-0.001-0.314-0.001c-13.811,0-27.07,5.442-36.899,15.155L16.13,363.68c-20.625,20.379-20.825,53.62-0.445,74.245 C25.957,448.318,39.49,453.524,53.033,453.524z"></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
                کدام روش درمان را انتخاب کنیم؟
              </p>
              <div className="pt-3 flex text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M4.91988 12.257C4.2856 12.257 3.65131 12.5199 3.19988 13.0342C2.79417 13.4913 2.59417 14.0799 2.63417 14.6913C2.67417 15.3027 2.94846 15.857 3.4056 16.2627L7.51417 19.8684C7.93131 20.2342 8.46846 20.4399 9.02274 20.4399C9.0856 20.4399 9.14846 20.4399 9.21131 20.4342C9.82846 20.3827 10.4056 20.0799 10.7942 19.5999L20.857 7.27986C21.657 6.30272 21.5085 4.85701 20.5313 4.05701C20.057 3.67415 19.4627 3.49129 18.857 3.55415C18.2513 3.61701 17.7027 3.90844 17.3142 4.38272L8.74846 14.8627L6.42274 12.8227C5.99417 12.4456 5.45131 12.257 4.91988 12.257Z"
                      fill="url(#paint0_linear)"
                    ></path>{" "}
                    <path
                      d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z"
                      fill="url(#paint1_linear)"
                    ></path>{" "}
                    <path
                      opacity="0.75"
                      d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z"
                      fill="url(#paint2_radial)"
                    ></path>{" "}
                    <path
                      opacity="0.5"
                      d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z"
                      fill="url(#paint3_radial)"
                    ></path>{" "}
                    <defs>
                      {" "}
                      <linearGradient
                        id="paint0_linear"
                        x1="15.825"
                        y1="-13.9667"
                        x2="9.82533"
                        y2="23.9171"
                        gradientUnits="userSpaceOnUse"
                      >
                        {" "}
                        <stop stop-color="#00CC00"></stop>{" "}
                        <stop offset="0.1878" stop-color="#06C102"></stop>{" "}
                        <stop offset="0.5185" stop-color="#17A306"></stop>{" "}
                        <stop offset="0.9507" stop-color="#33740C"></stop>{" "}
                        <stop offset="1" stop-color="#366E0D"></stop>{" "}
                      </linearGradient>{" "}
                      <linearGradient
                        id="paint1_linear"
                        x1="15.2501"
                        y1="0.625426"
                        x2="7.43443"
                        y2="23.6215"
                        gradientUnits="userSpaceOnUse"
                      >
                        {" "}
                        <stop offset="0.2544" stop-color="#90D856"></stop>{" "}
                        <stop offset="0.736" stop-color="#00CC00"></stop>{" "}
                        <stop offset="0.7716" stop-color="#0BCD07"></stop>{" "}
                        <stop offset="0.8342" stop-color="#29CF18"></stop>{" "}
                        <stop offset="0.9166" stop-color="#59D335"></stop>{" "}
                        <stop offset="1" stop-color="#90D856"></stop>{" "}
                      </linearGradient>{" "}
                      <radialGradient
                        id="paint2_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(15.452 8.95803) rotate(116.129) scale(8.35776 4.28316)"
                      >
                        {" "}
                        <stop
                          stop-color="#FBE07A"
                          stop-opacity="0.75"
                        ></stop>{" "}
                        <stop
                          offset="0.0803394"
                          stop-color="#FBE387"
                          stop-opacity="0.6897"
                        ></stop>{" "}
                        <stop
                          offset="0.5173"
                          stop-color="#FDF2C7"
                          stop-opacity="0.362"
                        ></stop>{" "}
                        <stop
                          offset="0.8357"
                          stop-color="#FFFBF0"
                          stop-opacity="0.1233"
                        ></stop>{" "}
                        <stop
                          offset="1"
                          stop-color="white"
                          stop-opacity="0"
                        ></stop>{" "}
                      </radialGradient>{" "}
                      <radialGradient
                        id="paint3_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(11.6442 17.0245) rotate(155.316) scale(9.80163 4.14906)"
                      >
                        {" "}
                        <stop
                          stop-color="#440063"
                          stop-opacity="0.25"
                        ></stop>{" "}
                        <stop
                          offset="1"
                          stop-color="#420061"
                          stop-opacity="0"
                        ></stop>{" "}
                      </radialGradient>{" "}
                    </defs>{" "}
                  </g>
                </svg>
                <p>
                  <strong>مشاوره تخصصی: </strong>
                  متخصصان سئوی وبوفن مانند «داروسازان حرفه‌ای» آماده‌اند تا پس
                  از چکاپ رایگان وبسایت شما، بهترین ترکیب دارویی (پکیج قرص‌ها)
                  را برای درمان و رشد سریعِ سایتتان تجویز کنند.
                </p>
              </div>
              <div className="pt-3 flex text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M4.91988 12.257C4.2856 12.257 3.65131 12.5199 3.19988 13.0342C2.79417 13.4913 2.59417 14.0799 2.63417 14.6913C2.67417 15.3027 2.94846 15.857 3.4056 16.2627L7.51417 19.8684C7.93131 20.2342 8.46846 20.4399 9.02274 20.4399C9.0856 20.4399 9.14846 20.4399 9.21131 20.4342C9.82846 20.3827 10.4056 20.0799 10.7942 19.5999L20.857 7.27986C21.657 6.30272 21.5085 4.85701 20.5313 4.05701C20.057 3.67415 19.4627 3.49129 18.857 3.55415C18.2513 3.61701 17.7027 3.90844 17.3142 4.38272L8.74846 14.8627L6.42274 12.8227C5.99417 12.4456 5.45131 12.257 4.91988 12.257Z"
                      fill="url(#paint0_linear)"
                    ></path>{" "}
                    <path
                      d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z"
                      fill="url(#paint1_linear)"
                    ></path>{" "}
                    <path
                      opacity="0.75"
                      d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z"
                      fill="url(#paint2_radial)"
                    ></path>{" "}
                    <path
                      opacity="0.5"
                      d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z"
                      fill="url(#paint3_radial)"
                    ></path>{" "}
                    <defs>
                      {" "}
                      <linearGradient
                        id="paint0_linear"
                        x1="15.825"
                        y1="-13.9667"
                        x2="9.82533"
                        y2="23.9171"
                        gradientUnits="userSpaceOnUse"
                      >
                        {" "}
                        <stop stop-color="#00CC00"></stop>{" "}
                        <stop offset="0.1878" stop-color="#06C102"></stop>{" "}
                        <stop offset="0.5185" stop-color="#17A306"></stop>{" "}
                        <stop offset="0.9507" stop-color="#33740C"></stop>{" "}
                        <stop offset="1" stop-color="#366E0D"></stop>{" "}
                      </linearGradient>{" "}
                      <linearGradient
                        id="paint1_linear"
                        x1="15.2501"
                        y1="0.625426"
                        x2="7.43443"
                        y2="23.6215"
                        gradientUnits="userSpaceOnUse"
                      >
                        {" "}
                        <stop offset="0.2544" stop-color="#90D856"></stop>{" "}
                        <stop offset="0.736" stop-color="#00CC00"></stop>{" "}
                        <stop offset="0.7716" stop-color="#0BCD07"></stop>{" "}
                        <stop offset="0.8342" stop-color="#29CF18"></stop>{" "}
                        <stop offset="0.9166" stop-color="#59D335"></stop>{" "}
                        <stop offset="1" stop-color="#90D856"></stop>{" "}
                      </linearGradient>{" "}
                      <radialGradient
                        id="paint2_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(15.452 8.95803) rotate(116.129) scale(8.35776 4.28316)"
                      >
                        {" "}
                        <stop
                          stop-color="#FBE07A"
                          stop-opacity="0.75"
                        ></stop>{" "}
                        <stop
                          offset="0.0803394"
                          stop-color="#FBE387"
                          stop-opacity="0.6897"
                        ></stop>{" "}
                        <stop
                          offset="0.5173"
                          stop-color="#FDF2C7"
                          stop-opacity="0.362"
                        ></stop>{" "}
                        <stop
                          offset="0.8357"
                          stop-color="#FFFBF0"
                          stop-opacity="0.1233"
                        ></stop>{" "}
                        <stop
                          offset="1"
                          stop-color="white"
                          stop-opacity="0"
                        ></stop>{" "}
                      </radialGradient>{" "}
                      <radialGradient
                        id="paint3_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(11.6442 17.0245) rotate(155.316) scale(9.80163 4.14906)"
                      >
                        {" "}
                        <stop
                          stop-color="#440063"
                          stop-opacity="0.25"
                        ></stop>{" "}
                        <stop
                          offset="1"
                          stop-color="#420061"
                          stop-opacity="0"
                        ></stop>{" "}
                      </radialGradient>{" "}
                    </defs>{" "}
                  </g>
                </svg>
                <p>
                  <strong>سامانه آنالیز وبسایت: </strong>
                  با استفاده از ابزار آنالیز هوشمند وبوفن، در کمتر از چند دقیقه
                  یک گزارش کامل از وبسایت و مهم‌ترین مشکلات سئوی آن دریافت کنید.
                  این سامانه به شما به طور خودکار قرص‌های مورد نیاز برای درمان
                  را پیشنهاد می‌دهد.
                </p>
              </div>
              <div className="pt-3 flex text-sm md:text-sm text-gray-600 leading-relaxed text-justify">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M4.91988 12.257C4.2856 12.257 3.65131 12.5199 3.19988 13.0342C2.79417 13.4913 2.59417 14.0799 2.63417 14.6913C2.67417 15.3027 2.94846 15.857 3.4056 16.2627L7.51417 19.8684C7.93131 20.2342 8.46846 20.4399 9.02274 20.4399C9.0856 20.4399 9.14846 20.4399 9.21131 20.4342C9.82846 20.3827 10.4056 20.0799 10.7942 19.5999L20.857 7.27986C21.657 6.30272 21.5085 4.85701 20.5313 4.05701C20.057 3.67415 19.4627 3.49129 18.857 3.55415C18.2513 3.61701 17.7027 3.90844 17.3142 4.38272L8.74846 14.8627L6.42274 12.8227C5.99417 12.4456 5.45131 12.257 4.91988 12.257Z"
                      fill="url(#paint0_linear)"
                    ></path>{" "}
                    <path
                      d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z"
                      fill="url(#paint1_linear)"
                    ></path>{" "}
                    <path
                      opacity="0.75"
                      d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z"
                      fill="url(#paint2_radial)"
                    ></path>{" "}
                    <path
                      opacity="0.5"
                      d="M9.02279 20.0284C8.56565 20.0284 8.12565 19.8627 7.78279 19.5598L3.67422 15.9541C2.89708 15.2684 2.81708 14.0798 3.50279 13.3027C4.18851 12.5255 5.37708 12.4455 6.15422 13.1313L8.79994 15.4513L17.6285 4.63983C18.2856 3.83412 19.4685 3.71983 20.2742 4.37126C21.0799 5.0284 21.1942 6.21126 20.5428 7.01697L10.4742 19.337C10.1542 19.7313 9.67993 19.977 9.17708 20.0227C9.12565 20.0227 9.07422 20.0284 9.02279 20.0284Z"
                      fill="url(#paint3_radial)"
                    ></path>{" "}
                    <defs>
                      {" "}
                      <linearGradient
                        id="paint0_linear"
                        x1="15.825"
                        y1="-13.9667"
                        x2="9.82533"
                        y2="23.9171"
                        gradientUnits="userSpaceOnUse"
                      >
                        {" "}
                        <stop stop-color="#00CC00"></stop>{" "}
                        <stop offset="0.1878" stop-color="#06C102"></stop>{" "}
                        <stop offset="0.5185" stop-color="#17A306"></stop>{" "}
                        <stop offset="0.9507" stop-color="#33740C"></stop>{" "}
                        <stop offset="1" stop-color="#366E0D"></stop>{" "}
                      </linearGradient>{" "}
                      <linearGradient
                        id="paint1_linear"
                        x1="15.2501"
                        y1="0.625426"
                        x2="7.43443"
                        y2="23.6215"
                        gradientUnits="userSpaceOnUse"
                      >
                        {" "}
                        <stop offset="0.2544" stop-color="#90D856"></stop>{" "}
                        <stop offset="0.736" stop-color="#00CC00"></stop>{" "}
                        <stop offset="0.7716" stop-color="#0BCD07"></stop>{" "}
                        <stop offset="0.8342" stop-color="#29CF18"></stop>{" "}
                        <stop offset="0.9166" stop-color="#59D335"></stop>{" "}
                        <stop offset="1" stop-color="#90D856"></stop>{" "}
                      </linearGradient>{" "}
                      <radialGradient
                        id="paint2_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(15.452 8.95803) rotate(116.129) scale(8.35776 4.28316)"
                      >
                        {" "}
                        <stop
                          stop-color="#FBE07A"
                          stop-opacity="0.75"
                        ></stop>{" "}
                        <stop
                          offset="0.0803394"
                          stop-color="#FBE387"
                          stop-opacity="0.6897"
                        ></stop>{" "}
                        <stop
                          offset="0.5173"
                          stop-color="#FDF2C7"
                          stop-opacity="0.362"
                        ></stop>{" "}
                        <stop
                          offset="0.8357"
                          stop-color="#FFFBF0"
                          stop-opacity="0.1233"
                        ></stop>{" "}
                        <stop
                          offset="1"
                          stop-color="white"
                          stop-opacity="0"
                        ></stop>{" "}
                      </radialGradient>{" "}
                      <radialGradient
                        id="paint3_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(11.6442 17.0245) rotate(155.316) scale(9.80163 4.14906)"
                      >
                        {" "}
                        <stop
                          stop-color="#440063"
                          stop-opacity="0.25"
                        ></stop>{" "}
                        <stop
                          offset="1"
                          stop-color="#420061"
                          stop-opacity="0"
                        ></stop>{" "}
                      </radialGradient>{" "}
                    </defs>{" "}
                  </g>
                </svg>
                <p>
                  <strong>خود درمانی: </strong>
                  در صورت داشتن اطلاعات کافی در زمینه سئو می توانید از داروخانه
                  مطابق با مشکلات وبسایت قرص مورد نظر خود را خریداری فرمایید.
                  (توجه داشته باشید استفاده بیش از حد قرص ها دارای عوارض جانبی
                  است.)
                </p>
              </div>

            </div>
          </div>
        </section>
        <Pills />

        <section>
          {/*FAQ*/}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center bg-[#f5f4f2]  rounded-4xl justify-between mt-14">
            {/* FAQ Section */}
            <div className="w-full lg:w-3/5 p-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white mt-2 rounded-md p-4 text-gray-600"
                >
                  <div className="border-b border-white/30">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex justify-between items-center text-right cursor-pointer"
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
        <GuidanceForm/>
          </div>
        </section>
      </div>
    </main>
  );
}
