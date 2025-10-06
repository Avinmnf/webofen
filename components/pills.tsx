import React from "react";
import { useState } from "react";
import { useRef } from "react";
import Link from "next/link";
import HoverVideo from "@/components/videos/hovervideos";
export default function Pills() {
  const [activeDiv, setActiveDiv] = useState<string | null>("first");
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
  const data = [
    {
      src: "/guidance/backlink.mp4",
      title: "قرص بک لینک سازی",
      desc: "سئو خارجی سایت",
      type: "offpage",
      link: "/products/backlink",
    },
    {
      src: "/guidance/optimization.mp4",
      title: "قرص  بهینه سازی",
      desc: "سئو داخلی سایت",
      type: "onpage",
      link: "/products/optimization",
    },
    {
      src: "/guidance/screamingfrog.mp4",
      title: "قرص اسکریمینگ فراگ",
      desc: "سئو داخلی سایت",
      type: "onpage",
      link: "/products/screaming-frog",
    },
    {
      src: "/guidance/rankdomain.mp4",
      title: "قرص افزایش رنک دامنه",
      desc: "سئو خارجی سایت",
      type: "offpage",
      link: "/products/rank-domain",
    },
    {
      src: "/guidance/security.mp4",
      title: "قرص  امنیت وبسایت",
      desc: "سئو داخلی سایت",
      type: "onpage",
      link: "/products/security",
    },
    {
      src: "/guidance/reportage.mp4",
      title: "قرص خرید  ریپورتاژ",
      desc: "سئو خارجی سایت",
      type: "offpage",
      link: "/products/reportage",
    },
    {
      src: "/guidance/keywordcluster.mp4",
      title: "قرص  کیورد کلاسترینگ",
      desc: "سئو داخلی سایت",
      type: "onpage",
      link: "/products/keyword-cluster",
    },
    {
      src: "/guidance/spamscore.mp4",
      title: "قرص  کاهش اسپم اسکور",
      desc: "سئو خارجی سایت",
      type: "offpage",
      link: "/products/spam-score",
    },
    {
      src: "/guidance/internallink.mp4",
      title: "قرص  لینکسازی داخلی",
      desc: "سئو داخلی سایت",
      type: "onpage",
      link: "/products/internal-linking",
    },
    {
      src: "/guidance/content.mp4",
      title: "قرص  تولید محتوا",
      desc: "سئو داخلی سایت",
      type: "onpage",
      link: "/products/content",
    },
  ];
  return (
    <section className="mt-10 flex flex-col gap-2">
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
        <div className="relative md:ml-2 flex gap-4 bg-gray-300 rounded-4xl h-12 md:w-3/4 md:mt-0 mt-2">
          <div
            className="absolute top-0 left-0 h-full bg-[#1d546b] rounded-full transition-all duration-300"
            style={{
              width: `${100 / 3}%`,
              transform:
                activeDiv === "first"
                  ? "translateX(200%)"
                  : activeDiv === "second"
                  ? "translateX(100%)"
                  : "translateX(0%)",
            }}
          ></div>
          {/* Buttons */}
          <button
            onClick={() => handleClick("first")}
            className="flex-1 z-10 text-sm md:text-md py-1 rounded-full h-12 text-white cursor-pointer"
          >
            تمامی قرص ها
          </button>
          <button
            onClick={() => handleClick("second")}
            className="flex-1 z-10 text-sm md:text-md py-1 rounded-full h-12 text-white cursor-pointer"
          >
            قرص های سئو داخلی
          </button>
          <button
            onClick={() => handleClick("third")}
            className="flex-1 z-10 text-sm md:text-md py-1 rounded-full h-12 text-white cursor-pointer"
          >
            قرص های سئو خارجی
          </button>
        </div>
      </div>

      {/* Conditionally render only the active div */}
      {activeDiv === "first" && (
        <div className="mt-4">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-10 text-gray-600">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="relative w-full aspect-[16/8] bg-[#00172f] rounded-4xl overflow-hidden flex items-start"
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector("video");
                  video?.play();
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector("video");
                  if (!video) return;
                  video.pause();
                  video.currentTime = 0;
                }}
              >
                <HoverVideo
                  src={item.src}
                  className="h-full absolute left-0 w-auto object-cover"
                />

                <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
                  <h4 className="text-white font-bold text-xl">{item.title}</h4>
                  <span className="text-white text-sm w-2/3">{item.desc}</span>
                  <Link
                    className="mt-4
                            flex justify-between items-center 
                            bg-white rounded-full py-1 w-[100px]
                            transform transition duration-300 ease-in-out
                            hover:-translate-x-1 hover:shadow-lg cursor-pointer
                          "
                    href={item.link}
                  >
                    <span className="mr-2 text-sm">مشاهده</span>
                    <svg
                      className="w-5 h-5 p-1 ml-1 rounded-full bg-[#f63e2f] transition duration-300 ease-in-out hover:bg-[#ff5a3c]"
                      fill="#ffffff"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 330 330"
                      stroke="#ffffff"
                    >
                      <path d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001 l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996 C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeDiv === "second" && (
        <div className="mt-4">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-10 text-gray-600">
            {data.map(
              (item, idx) =>
                item.type === "onpage" && (
                  <div
                    key={idx}
                    className="relative w-full aspect-[16/8] bg-[#001933] rounded-4xl overflow-hidden flex items-start"
                    onMouseEnter={(e) => {
                      const video = e.currentTarget.querySelector("video");
                      video?.play();
                    }}
                    onMouseLeave={(e) => {
                      const video = e.currentTarget.querySelector("video");
                      if (!video) return;
                      video.pause();
                      video.currentTime = 0;
                    }}
                  >
                    <HoverVideo
                      src={item.src}
                      className="h-full absolute left-0 w-auto object-cover"
                    />

                    <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
                      <h4 className="text-white font-bold text-xl">
                        {item.title}
                      </h4>
                      <span className="text-white text-sm w-2/3">
                        {item.desc}
                      </span>
                      <Link
                        className="mt-4
                       flex justify-between items-center 
                       bg-white rounded-full py-1 w-[100px]
                       transform transition duration-300 ease-in-out
                       hover:-translate-x-1 hover:shadow-lg cursor-pointer
                     "
                        href={"#"}
                      >
                        <span className="mr-2 text-sm">مشاهده</span>
                        <svg
                          className="w-5 h-5 p-1 ml-1 rounded-full bg-[#f63e2f] transition duration-300 ease-in-out hover:bg-[#ff5a3c]"
                          fill="#ffffff"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 330 330"
                          stroke="#ffffff"
                        >
                          <path d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001 l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996 C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}
      {activeDiv === "third" && (
        <div className="mt-4">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-10 text-gray-600">
            {data.map(
              (item, idx) =>
                item.type === "offpage" && (
                  <div
                    key={idx}
                    className="relative w-full aspect-[16/8] bg-[#001933] rounded-4xl overflow-hidden flex items-start"
                    onMouseEnter={(e) => {
                      const video = e.currentTarget.querySelector("video");
                      video?.play();
                    }}
                    onMouseLeave={(e) => {
                      const video = e.currentTarget.querySelector("video");
                      if (!video) return;
                      video.pause();
                      video.currentTime = 0;
                    }}
                  >
                    <HoverVideo
                      src={item.src}
                      className="h-full absolute left-0 w-auto object-cover"
                    />

                    <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
                      <h4 className="text-white font-bold text-xl">
                        {item.title}
                      </h4>
                      <span className="text-white text-sm w-2/3">
                        {item.desc}
                      </span>
                      <Link
                        className="mt-4
                   flex justify-between items-center 
                   bg-white rounded-full py-1 w-[100px]
                   transform transition duration-300 ease-in-out
                   hover:-translate-x-1 hover:shadow-lg cursor-pointer
                 "
                        href={"#"}
                      >
                        <span className="mr-2 text-sm">مشاهده</span>
                        <svg
                          className="w-5 h-5 p-1 ml-1 rounded-full bg-[#f63e2f] transition duration-300 ease-in-out hover:bg-[#ff5a3c]"
                          fill="#ffffff"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 330 330"
                          stroke="#ffffff"
                        >
                          <path d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001 l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996 C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </section>
  );
}
