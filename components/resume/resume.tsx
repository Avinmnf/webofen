import React, { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface Collaboration {
  id: number;
  logo: string;
  name: string;
  description: string;
  process: string[];
  screenshots: string[];
}

export default function CollaborationShowcase() {
  const [selectedProject, setSelectedProject] = useState<Collaboration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const collaborations: Collaboration[] = [
    {
      id: 1,
      logo: "/web-design/web-resume1Asset 8.png",
      name: "جایزه مصطفی",
      description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ",
      process: [
        "Discovery & Strategy Planning",
        "UX/UI Design & Prototyping",
        "Frontend Development",
        "Backend Integration",
        "Quality Assurance & Launch"
      ],
      screenshots: [
        "/web-design/techcorp-home.png",
        "/web-design/techcorp-dashboard.png",
        "/web-design/techcorp-products.png",
        "/web-design/techcorp1-products.png",
        "/web-design/techcorp2-products.png",
      ]
    },
    {
      id: 2,
      logo: "/web-design/web-resume2Asset 9.png",
      name: "GreenLife Organics",
      description: "Sustainable e-commerce platform with focus on user experience and organic product showcase.",
      process: [
        "Brand Identity & Research",
        "Mobile-first Design",
        "E-commerce Development",
        "Payment Integration",
        "SEO Optimization"
      ],
      screenshots: [
        "/web-design/greenlife-home.png",
        "/web-design/greenlife-shop.png",
        "/web-design/greenlife-blog.png"
      ]
    },
    {
      id: 3,
      logo: "/web-design/web-resume3Asset 10.png",
      name: "InnovateLabs",
      description: "Corporate website with portfolio showcase and client portal for a tech innovation company.",
      process: [
        "Competitive Analysis",
        "Interactive Prototyping",
        "CMS Development",
        "Client Portal Setup",
        "Performance Optimization"
      ],
      screenshots: [
        "/web-design/innovatelabs-home.png",
        "/web-design/innovatelabs-works.png",
        "/web-design/innovatelabs-contact.png"
      ]
    },
    {
      id: 4,
      logo: "/web-design/web-resume1Asset 8.png",
      name: "UrbanStyle Fashion",
      description: "Fashion e-commerce platform with virtual try-on features and personalized recommendations.",
      process: [
        "User Research & Personas",
        "Wireframing & Visual Design",
        "AR Integration",
        "Personalization Engine",
        "Multi-platform Testing"
      ],
      screenshots: [
        "/web-design/urbanstyle-home.png",
        "/web-design/urbanstyle-product.png",
        "/web-design/urbanstyle-tryon.png"
      ]
    }
  ];

  const openModal = useCallback((project: Collaboration) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
    setTimeout(() => setSelectedProject(null), 400);
  }, []);

  const openImageModal = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false);
    setTimeout(() => setSelectedImage(null), 400);
  }, []);

  return (
    <div className="w-full bg-white px-4">
      {/* Header with smooth entrance animation */}
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        <p className="text-[#29b0cb] text-xl sm:text-2xl">
          {" "}
          <span className="text-[#253e5f]">نمونه کار </span>طراحی سایت
        </p>
        <p className="text-gray-700 text-xs sm:text-sm mt-1 sm:mt-2">
          بخشی از نمونه های طراحی سایت توسط تیم ما
        </p>
      </div>

      {/* Logo Showcase */}
      <div className="max-w-7xl mx-auto h-96">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 0,
            stretch: -60,
            depth: 120,
            modifier: 1.8,
            slideShadows: false,
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
          }}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          modules={[EffectCoverflow, Autoplay, Pagination]}
          className="collaboration-swiper pb-12 h-96"
          speed={800}
          breakpoints={{
            320: {
              coverflowEffect: {
                stretch: -20,
                depth: 60,
                modifier: 1.2
              }
            },
            768: {
              coverflowEffect: {
                stretch: -40,
                depth: 90,
                modifier: 1.5
              }
            },
            1024: {
              coverflowEffect: {
                stretch: -60,
                depth: 120,
                modifier: 1.8
              }
            }
          }}
        >
          {collaborations.map((project, index) => (
            <SwiperSlide 
              key={project.id} 
              className="max-w-xs md:max-w-sm lg:max-w-md transition-all duration-700 ease-out"
            >
              <div 
                className={`
                  relative h-85 rounded-2xl cursor-pointer group overflow-visible
                  transform transition-all duration-700 ease-out
                  ${activeSlide === index ? 'rotate-0' : 'rotate-1'}
                  hover:rotate-0
                `}
                onClick={() => openModal(project)}
              >
                {/* Main scaling container that includes both image and overlay */}
                <div className={`
                  absolute inset-0 transition-all duration-700 ease-out overflow-visible
                  ${activeSlide === index ? 'scale-102' : 'scale-95'}
                  group-hover:scale-107
                `}>
                  {/* Static Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                  
                  {/* Logo Container with Floating Animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-170 h-150 animate-float-slow">
                      <Image
                        src={project.logo}
                        alt={`${project.name} logo`}
                        fill
                        className="object-contain transition-all duration-700 ease-out group-hover:brightness-110"
                        priority
                      />
                    </div>
                  </div>

                  {/* Hover Overlay - Now scales with the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-600 ease-out bottom-4 flex items-end">
                    <div className="p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-600 ease-out opacity-0 group-hover:opacity-100 space-y-3 w-full">
                      <h3 className="text-gray-700 font-semibold text-lg mb-2">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-gray-400 text-xs font-medium">مشاهده جزئیات</span>
                        <div className="w-6 h-6 bg-[#29b0cb] rounded-full flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110">
                          <svg className="w-3 h-3 text-whitw transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Enhanced Modal with Smooth Animations */}
      {selectedProject && (
        <div className={`
          fixed inset-0 z-50 transition-all duration-500 ease-out
          ${isModalOpen ? 'opacity-100' : 'opacity-0'}
        `}>
          {/* Animated Backdrop */}
          <div 
            className={`
              absolute inset-0 bg-black/70 backdrop-blur-sm transition-all duration-500 ease-out
              ${isModalOpen ? 'backdrop-opacity-100' : 'backdrop-opacity-0'}
            `}
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className={`
            absolute inset-4 md:inset-30 bg-white rounded-3xl shadow-2xl transform transition-all duration-500 ease-out
            ${isModalOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}
            flex flex-col overflow-hidden
          `}>
            {/* Header with Slide-in Animation */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center space-x-6 rtl:space-x-reverse">
                <div className="w-30 h-15 bg-white rounded-2xl transform transition-all duration-500 ease-out hover:scale-105">
                  <Image
                    src={selectedProject.logo}
                    alt={`${selectedProject.name} logo`}
                    width={80}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-[#0364af] transform transition-all duration-500 delay-100">
                    {selectedProject.name}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed transform transition-all duration-500 delay-150">
                    {selectedProject.description}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 hover:rotate-90 active:scale-95"
              >
                <svg className="w-6 h-6 text-gray-600 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content with Staggered Animations */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Process Section - Coordinated Animation */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 pb-3 border-b border-gray-200 transform transition-all duration-500 delay-200">
                    فرآیند کار
                  </h3>
                  <div className="space-y-4">
                    {selectedProject.process.map((step: string, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-start space-x-4 rtl:space-x-reverse"
                      >
                        {/* Number with Bounce Animation */}
                        <div 
                          className={`
                            flex-shrink-0 w-10 h-10 bg-[#1d546b]
                            text-white rounded-full flex items-center justify-center text-sm 
                            font-medium shadow-lg
                            ${isModalOpen ? 
                              'animate-bounceIn' : 
                              'opacity-0 scale-0 rotate-180'
                            }
                            hover:scale-110 hover:shadow-xl transition-transform duration-300
                          `}
                          style={{ 
                            animationDelay: `${100 + index * 200}ms`,
                            animationFillMode: 'both'
                          }}
                        >
                          {index + 1}
                        </div>
                        
                        {/* Text with Slide-in Animation Starting at Same Time */}
                        <div 
                          className={`
                            flex-1 pt-2 pr-4
                            ${isModalOpen ? 
                              'animate-slideInRight' : 
                              'opacity-0 translate-x-8'
                            }
                          `}
                          style={{ 
                            animationDelay: `${300 + index * 200}ms`,
                            animationFillMode: 'both'
                          }}
                        >
                          <p 
                            className="text-gray-800 font-medium leading-relaxed transition-all duration-500 hover:text-[#253e5f] hover:translate-x-2 cursor-default"
                          >
                            {step}
                          </p>
                          {index < selectedProject.process.length - 1 && (
                            <div 
                              className={`
                                h-px bg-gradient-to-r from-transparent via-[#29b0cb] to-transparent 
                                mt-4
                                ${isModalOpen ? 
                                  'animate-widthGrow' : 
                                  'opacity-0 w-0'
                                }
                              `}
                              style={{ 
                                animationDelay: `${500 + index * 200}ms`,
                                animationFillMode: 'both'
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screenshots Section - Masonry Layout with Click to Zoom */}
                <div className="space-y-6">
                  <p className="text-xl font-bold text-gray-600 pb-3 border-b border-gray-200 transform transition-all duration-500 delay-200">
                    نمونه‌های پروژه
                  </p>
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {selectedProject.screenshots.map((screenshot: string, index: number) => (
                      <div 
                        key={index}
                        className={`
                          relative break-inside-avoid overflow-hidden rounded-2xl bg-gray-100 border border-gray-200
                          transform transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-2xl
                          ${isModalOpen ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'}
                          group cursor-zoom-in
                        `}
                        style={{ 
                          animationDelay: `${400 + index * 120}ms`,
                          animationFillMode: 'both'
                        }}
                        onClick={() => openImageModal(screenshot)}
                      >
                        <div className={`${index % 3 === 0 ? 'aspect-[4/3]' : index % 3 === 1 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                          <Image
                            src={screenshot}
                            alt={`${selectedProject.name} screenshot ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#29b0cb]/20 to-[#253e5f]/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute top-4 right-4 transform -translate-y-8 opacity-0 transition-all duration-500 delay-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                            <span className="text-gray-700 font-bold text-sm">{index + 1}</span>
                          </div>
                        </div>
                        {/* Zoom Icon */}
                        <div className="absolute top-4 left-4 transform translate-y-8 opacity-0 transition-all duration-500 delay-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className={`
          fixed inset-0 z-[60] transition-all duration-500 ease-out
          ${isImageModalOpen ? 'opacity-100' : 'opacity-0'}
        `}>
          {/* Backdrop */}
          <div 
            className={`
              absolute inset-0 bg-black/90 backdrop-blur-md transition-all duration-500 ease-out
              ${isImageModalOpen ? 'backdrop-opacity-100' : 'backdrop-opacity-0'}
            `}
            onClick={closeImageModal}
          />
          
          {/* Image Container */}
          <div className={`
            absolute inset-4 md:ins-20 flex items-center justify-center transform transition-all duration-500 ease-out
            ${isImageModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          `}>
            <div className="relative w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Zoomed screenshot"
                fill
                className="object-contain transition-transform duration-300 ease-out"
              />
              
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 left-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 backdrop-blur-sm"
              >
                <svg className="w-6 h-6 text-white transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Download Button */}
              <button
                onClick={() => window.open(selectedImage, '_blank')}
                className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 backdrop-blur-sm"
                title="Download image"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              {/* Navigation Arrows (if you want to add multiple image navigation) */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white text-sm font-medium">
                  برای بستن کلیک کنید یا ESC را بزنید
                </span>
              </div>
            </div>
          </div>

          {/* Keyboard Support */}
          <div 
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeImageModal();
            }}
            className="outline-none"
          />
        </div>
      )}

      {/* Custom CSS for Smooth Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        
        .swiper-pagination-bullet {
          transition: all 0.4s ease-out;
        }
        
        .swiper-pagination-bullet-active {
          transform: scale(1.3);
        }
        
        .swiper-slide {
          transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(180deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) rotate(-10deg);
          }
          70% {
            transform: scale(0.9) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes widthGrow {
          from {
            opacity: 0;
            width: 0%;
          }
          to {
            opacity: 1;
            width: 100%;
          }
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .animate-widthGrow {
          animation: widthGrow 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        /* Smooth scrolling for modal */
        .modal-open {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}