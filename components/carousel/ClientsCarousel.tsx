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
        <div className="absolute left-0 top-0 h-full w-20 z-20 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-20 z-20 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none"></div>

        {/* Scrolling rows */}
        <div className="absolute bottom-5 left-0 w-full flex flex-col gap-6 pb-4">

          {/* Row 1 */}
          <div className="marquee-row">
            <div className="track track-left">
              {logos.map((logo, i) => (
                <div key={`r1a-${i}`} className="logo-item">
                  <Image src={logo} width={120} height={60} className="object-contain" alt="" />
                </div>
              ))}
            </div>
            <div className="track track-left second">
              {logos.map((logo, i) => (
                <div key={`r1b-${i}`} className="logo-item">
                  <Image src={logo} width={120} height={60} className="object-contain" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="marquee-row">
            <div className="track track-right">
              {logos.map((logo, i) => (
                <div key={`r2a-${i}`} className="logo-item">
                  <Image src={logo} width={120} height={60} className="object-contain" alt="" />
                </div>
              ))}
            </div>
            <div className="track track-right second">
              {logos.map((logo, i) => (
                <div key={`r2b-${i}`} className="logo-item">
                  <Image src={logo} width={120} height={60} className="object-contain gap-2" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 */}
          <div className="marquee-row">
            <div className="track track-left">
              {logos.map((logo, i) => (
                <div key={`r3a-${i}`} className="logo-item">
                  <Image src={logo} width={120} height={60} className="object-contain" alt="" />
                </div>
              ))}
            </div>
            <div className="track track-left second">
              {logos.map((logo, i) => (
                <div key={`r3b-${i}`} className="logo-item">
                  <Image src={logo} width={120} height={60} className="object-contain" alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FIXED CSS */}
      <style jsx>{`
        .marquee-row {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
        }

        .track {
          display: flex;
          position: absolute;
          top: 0;
          height: 100%;
          align-items: center;
          gap: 4rem;
          white-space: nowrap;
          width: max-content; /* مهم‌ترین خط */
        }

        .logo-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 60px;
        }

        /* Animations */
        .track-left { animation: scrollLeft 30s linear infinite; }
        .track-left.second { left:105%; }

        .track-right { animation: scrollRight 30s linear infinite; }
         .track-right.second {
          left: calc(-125% - 4rem);
        }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }

        @media (max-width: 768px) {
          .track { gap: 2rem; }
          .logo-item { width: 100px; height: 50px; }
        }
      `}</style>
    </section>
  );
}
