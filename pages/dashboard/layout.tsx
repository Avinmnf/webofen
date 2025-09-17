"use client";

import React from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import HeaderPanel from "../../components/dashboard/header";

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="md:w-7/12 mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <HeaderPanel />
        {/* Sidebar */}
        <div className="flex mt-6">
          <DashboardSidebar isMobile={isMobile} />
          {/* Main content */}
          <div className="w-full bg-white rounded-md p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
