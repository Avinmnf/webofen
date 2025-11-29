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

  return (
    <section className="max-w-[1250px] mx-auto my-8 relative">
      <div className="relative mx-auto aspect-[17/6] overflow-hidden rounded-lg">
        {/* Background */}
        <Image
          src="/about-us/our-costumers.png"
          alt=""
          fill
          className="object-contain"
          priority
        />

        {/* Title */}
        <div className="absolute inset-0 flex items-start justify-center pt-10 text-white text-2xl font-bold z-10 pointer-events-none">
          مشتریان <span className="text-[#29b0cb] mr-1"> وبوفن </span>
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-32 z-20 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-32 z-20 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none"></div>

        {/* Three rows */}
        <div className="absolute bottom-5 left-0 w-full flex flex-col gap-3 pb-4">
          {/* Row 1 - LEFT */}
          <div className="marquee-row">
            <div className="track track-left">
              {logos.map((logo, i) => (
                <Image
                  key={`r1a-${i}`}
                  src={logo}
                  width={120}
                  height={60}
                  className="mx-6"
                  alt=""
                />
              ))}
            </div>
            <div className="track track-left second">
              {logos.map((logo, i) => (
                <Image
                  key={`r1b-${i}`}
                  src={logo}
                  width={120}
                  height={60}
                  className="mx-6"
                  alt=""
                />
              ))}
            </div>
          </div>

          {/* Row 2 - RIGHT */}
          <div className="marquee-row">
            <div className="track track-right">
              {logos.map((logo, i) => (
                <Image
                  key={`r2a-${i}`}
                  src={logo}
                  width={120}
                  height={60}
                  className="mx-6"
                  alt=""
                />
              ))}
            </div>
            <div className="track track-right second">
              {logos.map((logo, i) => (
                <Image
                  key={`r2b-${i}`}
                  src={logo}
                  width={120}
                  height={60}
                  className="mx-6"
                  alt=""
                />
              ))}
            </div>
          </div>

          {/* Row 3 - LEFT */}
          <div className="marquee-row">
            <div className="track track-left">
              {logos.map((logo, i) => (
                <Image
                  key={`r3a-${i}`}
                  src={logo}
                  width={120}
                  height={60}
                  className="mx-6"
                  alt=""
                />
              ))}
            </div>
            <div className="track track-left second">
              {logos.map((logo, i) => (
                <Image
                  key={`r3b-${i}`}
                  src={logo}
                  width={120}
                  height={60}
                  className="mx-6"
                  alt=""
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
  .marquee-row {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 80px;
  }

  .track {
    display: flex;
    position: absolute;
    top: 0;
    height: 80px;
    white-space: nowrap;
  }

  /* LEFT scroll */
  .track-left {
    animation: scrollLeft 25s linear infinite;
  }

  .track-left.second {
    left: 100%; 
  }

  /* RIGHT scroll */
  .track-right {
    animation: scrollRight 25s linear infinite;
  }

  .track-right.second {
    left: -100%; x
  }

  @keyframes scrollLeft {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }

  @keyframes scrollRight {
    0% { transform: translateX(0); }
    100% { transform: translateX(100%); }
  }
`}</style>
    </section>
  );
}
