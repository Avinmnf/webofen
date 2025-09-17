"use client";

import React from "react";
import Image from "next/image";

interface DashboardSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobile: boolean;
}

const services = [
  { id: "backlink", label: "بک لینک", icon: "/dashboard/backlink.png" },
  { id: "content", label: "محتوا", icon: "/dashboard/content.png" },
  { id: "optimization", label: "بهینه سازی", icon: "/dashboard/optimize.png" },
  { id: "security", label: "امنیت", icon: "/dashboard/security.png" },
  { id: "cluster", label: "کلاستر", icon: "/dashboard/cluster.png" },
  { id: "rankdomain", label: "افزایش رنک", icon: "/dashboard/rankup.png" },
  { id: "reportage", label: "رپورتاژ", icon: "/dashboard/newspaper.png" },
  { id: "spam", label: "اسپم اسکور", icon: "/dashboard/spamscore.png" },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeSection, setActiveSection, isMobile }) => {
  return (
    <div
      className={`bg-white ${
        isMobile
          ? "fixed bottom-0 left-0 right-0 z-50 flex flex-row overflow-x-auto whitespace-nowrap border-t border-gray-200"
          : "block md:w-44 overflow-y-auto"
      }`}
    >
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => setActiveSection(service.id)}
          className={`flex flex-col gap-1 justify-center items-center flex-[0_0_auto] 
            ${isMobile ? "min-w-[90px] h-[80px] px-2" : "w-full space-x-3 space-x-reverse p-3 mb-2 rounded-r-xl"} 
            transition-all duration-300 
            ${activeSection === service.id ? "bg-[#1d546b] text-white shadow-md" : "hover:bg-gray-300 text-black"}
          `}
        >
          <div className={`flex-shrink-0 p-2 rounded-lg ${activeSection === service.id ? "bg-white bg-opacity-20" : "bg-gray-200"}`}>
            <Image width={24} height={24} src={service.icon} alt={service.label} className={activeSection === service.id ? "" : "opacity-70"} />
          </div>
          <span className="text-xs md:text-sm font-medium">{service.label}</span>
        </button>
      ))}
    </div>
  );
};

export default DashboardSidebar;
