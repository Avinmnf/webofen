"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Backlink from "./jobs/backlink";
import Security from "./jobs/security";

export type Jobs = {
  backlink: any[];
  content: any[];
  security: any[];
  cluster: any[];
  seo: any[];
  spam?: any[];
};

interface DashboardContentProps {
  jobs: Jobs;
}

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  return isMobile;
};

const DashboardContent: React.FC<DashboardContentProps> = ({ jobs }) => {
  const [activeSection, setActiveSection] = useState<keyof Jobs>("backlink");
  const isMobile = useIsMobile();

  const services = [
    { id: "backlink" as const, label: "بک لینک", icon: "/dashboard/backlink.png" },
    { id: "content" as const, label: "محتوا", icon: "/dashboard/content.png" },
    { id: "security" as const, label: "امنیت", icon: "/dashboard/security.png" },
    { id: "cluster" as const, label: "کلاستر", icon: "/dashboard/cluster.png" },
    { id: "seo" as const, label: "سئو", icon: "/dashboard/rankup.png" },
    { id: "spam" as const, label: "اسپم", icon: "/dashboard/spamscore.png" },
  ];

  return (
    <div className="bg-white p-4">
      <div className="flex flex-col md:flex-row relative bg-[#1d546b] rounded-2xl">
        {/* Sidebar */}
        <div className={`${isMobile ? "hidden" : "block"} md:w-44 bg-white`}>
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveSection(service.id)}
              className={`w-full flex items-center space-x-3 space-x-reverse p-3 mb-2 rounded-r-xl transition-all duration-300 ${
                activeSection === service.id
                  ? "text-white shadow-r-md bg-[#1d546b]"
                  : "hover:bg-gray-300 text-black"
              }`}
            >
              <div
                className={`flex-shrink-0 p-2 rounded-lg ${
                  activeSection === service.id
                    ? "bg-white bg-opacity-20"
                    : "bg-gray-200"
                }`}
              >
                <Image
                  width={28}
                  height={28}
                  src={service.icon}
                  alt={service.label}
                  className={activeSection === service.id ? "" : "opacity-70"}
                />
              </div>
              <span className="text-sm font-medium">{service.label}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          {activeSection === "backlink" && <Backlink backlinks={jobs.backlink} />}
          {activeSection === "security" && <Security security={jobs.security} />}
          {activeSection === "content" && <p>📄 بخش محتوا در حال توسعه است</p>}
          {activeSection === "cluster" && <p>🔗 بخش کلاستر در حال توسعه است</p>}
          {activeSection === "seo" && <p>📊 بخش سئو در حال توسعه است</p>}
          {activeSection === "spam" && <p>🚫 بخش اسپم در حال توسعه است</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;