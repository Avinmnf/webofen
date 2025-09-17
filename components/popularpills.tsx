"use client";

import Link from "next/link";
import HoverVideo from "./videos/hovervideos";

export default function Popularpills() {
  return (
    <div className="py-6">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 text-gray-600">
        {[
          {
            src: "/guidance/Hailuo_Video_A_futuristic_glowing_pill_with_420392168333352962_2.mp4",
            title: "قرص بک لینک سازی",
            desc: "سئو خارجی سایت",
            link: "https://example.com/video-2"
          },
          {
            src: "/guidance/Hailuo_Video_A_futuristic_glowing_pill_with_420392168333352962_1.mp4",
            title: "قرص  بهینه سازی",
            desc: "سئو داخلی سایت",
            link: "https://example.com/video-1"
          },
          {
            src: "/guidance/Hailuo_Video_Create_a_smooth_looping_animat_422500566735044610_1.mp4",
            title: "قرص اسکریمینگ فراگ",
            desc: "سئو داخلی سایت",
            link: "https://example.com/video-3"
          }
        ].map((item, idx) => (
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
              <Link className="mt-4
                            flex justify-between items-center 
                            bg-white rounded-full py-1 w-[100px]
                            transform transition duration-300 ease-in-out
                            hover:-translate-x-1 hover:shadow-lg cursor-pointer
                          " href={"#"}>
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
  );
}
