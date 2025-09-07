'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import Backlink from './jobs/backlink';

// Define BacklinkItem type
export interface BacklinkItem {
  id: string;
  siteurl: string;
  keyword: string;
  status: string;
  datetime?: string;
}

export type Jobs = {
  backlink: string[];
  content: string[];
  security: string[];
  cluster: string[];
  seo: string[];
  spam?: string[];
};

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return isMobile;
};

interface DashboardContentProps {
  jobs: Jobs;
  backlinks: BacklinkItem[]; // Make sure to pass this prop
}

const DashboardContent: React.FC<DashboardContentProps> = ({ jobs, backlinks }) => {
  const [activeSection, setActiveSection] = useState<keyof Jobs>('backlink');
  const isMobile = useIsMobile();

  const services = [
    { id: 'backlink' as const, label: 'بک لینک', icon: '/dashboard/backlink.png' },
    { id: 'content' as const, label: 'محتوا', icon: '/dashboard/content.png' },
    { id: 'security' as const, label: 'امنیت', icon: '/dashboard/security.png' },
    { id: 'cluster' as const, label: 'کلاستر', icon: '/dashboard/cluster.png' },
    { id: 'seo' as const, label: 'سئو', icon: '/dashboard/rankup.png' },
    { id: 'spam' as const, label: 'اسپم', icon: '/dashboard/spamscore.png' },
  ];

  return (
    <div className="flex flex-col md:flex-row relative bg-gray-100">
      {/* Sidebar */}
      <div className={`${isMobile ? 'hidden' : 'block'} md:w-44 bg-white`}>
        <div className="pr-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveSection(service.id)}
              className={`w-full flex items-center space-x-3 space-x-reverse p-3 mb-2 rounded-r-xl transition-all duration-300 ${
                activeSection === service.id
                  ? `text-blue-950 shadow-r-md bg-gray-100`
                  : 'hover:bg-gray-300 text-gray-700'
              }`}
            >
              <div
                className={`flex-shrink-0 p-2 rounded-lg ${
                  activeSection === service.id ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                }`}
              >
                <Image
                  width={28}
                  height={28}
                  src={service.icon}
                  alt={service.label}
                  className={activeSection === service.id ? '' : 'opacity-70'}
                />
              </div>
              <span className="text-sm font-medium">{service.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="text-gray-800">
          <h2 className="text-lg font-semibold mb-4">{activeSection.toUpperCase()}</h2>

          {activeSection === 'backlink' ? (
            <Backlink backlinks={backlinks} />
          ) : (
            <ul className="list-disc pl-6 space-y-1">
              {jobs[activeSection]?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <Swiper slidesPerView={4} freeMode modules={[FreeMode]} className="py-2">
            {services.map((service) => (
              <SwiperSlide key={service.id} className="flex items-center justify-center">
                <button
                  onClick={() => setActiveSection(service.id)}
                  className={`flex items-center justify-center flex-col p-2 rounded-lg ${
                    activeSection === service.id ? `text-blue-950 shadow-r-md bg-gray-100` : ''
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      activeSection === service.id ? 'bg-white bg-opacity-20' : 'bg-gray-300'
                    }`}
                  >
                    <Image width={24} height={24} src={service.icon} alt={service.label} />
                  </div>
                  <span className="text-xs mt-1">{service.label}</span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
