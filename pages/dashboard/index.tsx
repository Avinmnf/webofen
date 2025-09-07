import React from "react";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardContent, { Jobs } from "@/components/dashboard/content";
import HeaderPanel from "@/components/dashboard/header";

const jobs: Jobs = {
  backlink: [], // we won't use this array for backlinks anymore
  content: ["Article 1", "Article 2"],
  security: ["Check 1", "Check 2"],
  cluster: ["Cluster A", "Cluster B"],
  seo: ["SEO Task 1", "SEO Task 2"],
  spam: ["Spam Check 1", "Spam Check 2"],
};

// Define your backlinks here
const backlinks = [
  { id: "1", siteurl: "https://example.com", keyword: "خرید پنل", status: "0" },
  {
    id: "2",
    siteurl: "https://another.com",
    keyword: "بهترین بک لینک",
    status: "1",
    datetime: "2025-09-07",
  },
  {
    id: "3",
    siteurl: "https://bazarpanel.com",
    keyword: "خرید بازدید",
    status: "1",
    datetime: "2025-09-06",
  },
];

const Page: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
        <div className="md:w-7/12 mx-auto px-4 py-6 max-w-7xl">
          <div className="animate-fadeIn z-40">
            <HeaderPanel />
          </div>
          <div className="mt-6 relative rounded-2xl shadow-lg overflow-hidden glass-effect hover-scale animate-slideInRight z-0">
            {/* Pass both jobs and backlinks to DashboardContent */}
            <DashboardContent jobs={jobs} backlinks={backlinks} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
