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
          className="object-cover"
          priority
        />

        {/* Title */}
        <div className="absolute inset-0 flex items-start justify-center pt-10 text-white text-2xl font-bold z-10 pointer-events-none">
          مشتریان <span className="text-[#29b0cb] mr-1"> وبوفن </span>
        </div>


        {/* Horizontal fades - cleaner and more subtle */}
        <div className="absolute inset-y-0 -left-10 w-100 z-10 pointer-events-none bg-gradient-to-r from-white via-white/40 to-transparent opacity-90" />
        <div className="absolute inset-y-0 -right-10 w-100 z-10 pointer-events-none bg-gradient-to-l from-white via-white/40 to-transparent opacity-90" />

        {/* Scrolling rows container */}
        <div className="absolute bottom-5 left-0 w-full flex flex-col gap-6 pb-4">
          {/* Row 1 */}
          <div className="marquee-row">
            <div className="track track-left">
              {logos.map((logo, i) => (
                <div key={`r1a-${i}`} className="logo-item">
                  <Image
                    src={logo}
                    width={120}
                    height={60}
                    className="object-contain"
                    alt=""
                  />
                </div>
              ))}
            </div>
            <div className="track track-left second">
              {logos.map((logo, i) => (
                <div key={`r1b-${i}`} className="logo-item">
                  <Image
                    src={logo}
                    width={120}
                    height={60}
                    className="object-contain"
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="marquee-row">
            <div className="track track-right">
              {logos.map((logo, i) => (
                <div key={`r2a-${i}`} className="logo-item">
                  <Image
                    src={logo}
                    width={120}
                    height={60}
                    className="object-contain"
                    alt=""
                  />
                </div>
              ))}
            </div>
            <div className="track track-right second">
              {logos.map((logo, i) => (
                <div key={`r2b-${i}`} className="logo-item">
                  <Image
                    src={logo}
                    width={120}
                    height={60}
                    className="object-contain"
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 */}
          <div className="marquee-row">
            <div className="track track-left">
              {logos.map((logo, i) => (
                <div key={`r3a-${i}`} className="logo-item">
                  <Image
                    src={logo}
                    width={120}
                    height={60}
                    className="object-contain"
                    alt=""
                  />
                </div>
              ))}
            </div>
            <div className="track track-left second">
              {logos.map((logo, i) => (
                <div key={`r3b-${i}`} className="logo-item">
                  <Image
                    src={logo}
                    width={120}
                    height={60}
                    className="object-contain"
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .marquee-row {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
          /* Clean mask with smoother transitions */
          mask-image: linear-gradient(
            90deg,
            transparent 0%,
            black 80px,
            black calc(100% - 80px),
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0%,
            black 80px,
            black calc(100% - 80px),
            transparent 100%
          );
        }

        .track {
          display: flex;
          position: absolute;
          top: 0;
          height: 100%;
          align-items: center;
          gap: 4rem;
          white-space: nowrap;
          width: max-content;
        }

        .logo-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 60px;
          filter: grayscale(100%) brightness(1.1);
          opacity: 0.85;
          transition: filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
        }

        .logo-item:hover {
          filter: grayscale(0%) brightness(1);
          opacity: 1;
          transform: scale(1.05);
        }

        .track-left {
          animation: scrollLeft 30s linear infinite;
        }
        .track-left.second {
          left: 105%;
        }

        .track-right {
          animation: scrollRight 30s linear infinite;
        }
        .track-right.second {
          left: calc(-125% - 4rem);
        }

        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes scrollRight {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .marquee-row:hover .track {
          animation-play-state: paused;
        }

        @media (max-width: 1024px) {
          .marquee-row {
            mask-image: linear-gradient(
              90deg,
              transparent 0%,
              black 60px,
              black calc(100% - 60px),
              transparent 100%
            );
            -webkit-mask-image: linear-gradient(
              90deg,
              transparent 0%,
              black 60px,
              black calc(100% - 60px),
              transparent 100%
            );
          }
        }

        @media (max-width: 768px) {
          .marquee-row {
            height: 70px;
            mask-image: linear-gradient(
              90deg,
              transparent 0%,
              black 40px,
              black calc(100% - 40px),
              transparent 100%
            );
            -webkit-mask-image: linear-gradient(
              90deg,
              transparent 0%,
              black 40px,
              black calc(100% - 40px),
              transparent 100%
            );
          }
          
          .track {
            gap: 3rem;
          }
          
          .logo-item {
            width: 100px;
            height: 50px;
          }
        }

        @media (max-width: 480px) {
          .marquee-row {
            height: 60px;
            mask-image: linear-gradient(
              90deg,
              transparent 0%,
              black 30px,
              black calc(100% - 30px),
              transparent 100%
            );
            -webkit-mask-image: linear-gradient(
              90deg,
              transparent 0%,
              black 30px,
              black calc(100% - 30px),
              transparent 100%
            );
          }
          
          .track {
            gap: 2.5rem;
          }
          
          .logo-item {
            width: 85px;
            height: 42px;
          }
        }
      `}</style>
    </section>
  );
}