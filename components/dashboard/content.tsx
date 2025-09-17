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
  reportage?: any[];
  optimization?: any[];
  rankdomain?: any[];
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

const DashboardContent: React.FC<{ jobs: Jobs; activeSection: string }> = ({ jobs, activeSection }) => {
  return (
    <div className="flex-1 p-4 pb-24 md:pb-4">
      {activeSection === "backlink" && <Backlink backlinks={jobs.backlink} />}
      {activeSection === "security" && <Security security={jobs.security} />}
      {activeSection === "content" && <p>📄 بخش محتوا در حال توسعه است</p>}
      {activeSection === "cluster" && <p>🔗 بخش کلاستر در حال توسعه است</p>}
      {activeSection === "seo" && <p>📊 بخش سئو در حال توسعه است</p>}
      {activeSection === "spam" && <p>🚫 بخش اسپم در حال توسعه است</p>}
    </div>
  );
};

export default DashboardContent;

