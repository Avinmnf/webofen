"use client";

import Image from "next/image";

export default function ClientsCarouselSection() {
  const logos = [
    "/about-us/test/logoipsum-378.png",
    "/about-us/test/logoipsum-391.png",
    "/about-us/test/logoipsum-375.png",
    "/about-us/test/logoipsum-408.png",
    "/about-us/test/logoipsum-414.png",
    "/about-us/test/logoipsum-391.png",
    "/about-us/test/logoipsum-408.png",
    "/about-us/test/logoipsum-414.png",
  ];

  // Duplicate exactly once for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="max-w-[1250px] mx-auto my-8 relative">
      <div className="relative mx-auto aspect-[20/6] overflow-hidden rounded-lg">

        {/* Background */}
        <Image
          src="/about-us/our-costumers.png"
          alt="کلینیک تخصصی سئو وبوفن - خدمات سئو و بهینه‌سازی سایت"
          fill
          className="object-contain"
          priority
        />

        {/* Title */}
        <div className="absolute inset-0 flex items-start justify-center pt-10 text-white text-2xl font-bold z-10 pointer-events-none">
          مشتریان <span className="text-[#29b0cb] mr-1"> وبوفن </span>
        </div>

        {/* Fade edges - Improved */}
        <div className="absolute left-0 top-0 h-full w-32 z-20 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-r from-white via-white/50 to-transparent"></div>
        </div>
        <div className="absolute right-0 top-0 h-full w-32 z-20 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-l from-white via-white/50 to-transparent"></div>
        </div>

        {/* Carousels Container */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          {/* MARQUEE 1 - RIGHT → LEFT */}
          <div className="flex animate-marquee whitespace-nowrap py-8">
            {duplicatedLogos.map((logo, index) => (
              <div key={`c1-${index}`} className="mx-6 flex-shrink-0">
                <Image
                  src={logo}
                  alt="client logo"
                  width={120}
                  height={60}
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>

          {/* MARQUEE 2 - RIGHT → LEFT (Delayed start) */}
          <div className="flex animate-marquee2 whitespace-nowrap py-8 absolute top-0 left-full">
            {duplicatedLogos.map((logo, index) => (
              <div key={`c2-${index}`} className="mx-6 flex-shrink-0">
                <Image
                  src={logo}
                  alt="client logo"
                  width={120}
                  height={60}
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        @keyframes marquee2 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
          will-change: transform;
        }

        .animate-marquee2 {
          animation: marquee2 20s linear infinite;
          animation-delay: -10s;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}