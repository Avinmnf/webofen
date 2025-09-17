"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  isMobile: boolean;
}

const services = [
  { id: "backlink", label: "بک لینک", icon: "/dashboard/backlink.png", href: "/dashboard/backlink" },
  { id: "content", label: "محتوا", icon: "/dashboard/content.png", href: "/dashboard/content" },
  { id: "optimization", label: "بهینه سازی", icon: "/dashboard/optimize.png", href: "/dashboard/optimization" },
  { id: "security", label: "امنیت", icon: "/dashboard/security.png", href: "/dashboard/security" },
  { id: "cluster", label: "کلاستر", icon: "/dashboard/cluster.png", href: "/dashboard/cluster" },
  { id: "rankdomain", label: "افزایش رنک", icon: "/dashboard/rankup.png", href: "/dashboard/rankdomain" },
  { id: "reportage", label: "رپورتاژ", icon: "/dashboard/newspaper.png", href: "/dashboard/reportage" },
  { id: "spam", label: "اسپم اسکور", icon: "/dashboard/spamscore.png", href: "/dashboard/spam" },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isMobile }) => {
  const pathname = usePathname();

  return (
    <div
      className={`bg-[#f7f8fc] rounded-r-md ${
        isMobile
          ? "fixed bottom-0 left-0 right-0 z-50 flex flex-row overflow-x-auto whitespace-nowrap border-t border-gray-200"
          : "block md:w-44 overflow-y-auto"
      }`}
    >
      {services.map((service) => {
        const isActive = pathname?.startsWith(service.href);
        return (
          <Link
            key={service.id}
            href={service.href}
            className={`flex flex-col gap-1 justify-center items-center flex-[0_0_auto] 
              ${isMobile ? "min-w-[90px] h-[80px] px-2" : "w-full space-x-3 space-x-reverse p-3 mb-2 rounded-r-xl"} 
              transition-all duration-300 
              ${isActive ? "bg-[#1d546b] text-white shadow-md" : "hover:bg-gray-300 text-black"}
            `}
          >
            <div className={`flex-shrink-0 p-2 rounded-lg ${isActive ? "bg-white bg-opacity-20" : "bg-gray-200"}`}>
              <Image
                width={24}
                height={24}
                src={service.icon}
                alt={service.label}
                className={isActive ? "" : "opacity-70"}
              />
            </div>
            <span className="text-xs md:text-sm font-medium">{service.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default DashboardSidebar;
