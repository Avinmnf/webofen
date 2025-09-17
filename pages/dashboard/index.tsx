"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardContent, { Jobs } from "@/components/dashboard/content";
import HeaderPanel from "@/components/dashboard/header";
import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders } from "@/hooks/useUserOrders";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
export interface BacklinkItem {
  id: string;
  slug: string;
  productTitle: string;
  attributes: { name: string; value: string }[];
  quantity: number;
  price: number;
  orderId: string;
  status: string;
  adminStatus?: string;
  createdAt: string;
  siteurl?: string;
  keyword: string;
}

export interface SecurityItem {
  id: string;
  slug: string;
  productTitle: string;
  attributes: { name: string; value: string }[];
  quantity: number;
  price: number;
  orderId: string;
  status: string;
  createdAt: string;
  siteurl?: string;
  keyword: string;
}

// Hook to detect mobile
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

const Page: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { orders, loading, error } = useUserOrders();
  const [activeTab, setActiveTab] = useState<string | null>(null); // null = home
  const isMobile = useIsMobile();

  // Generate backlinks
  const backlinks: BacklinkItem[] = orders.flatMap((order) =>
    order.items
      .filter((item) => item.variant?.product?.slug === "backlink")
      .map((item) => ({
        id: item.id,
        slug: item.variant.product.slug,
        productTitle: item.variant.product.title,
        attributes: item.variant.attributeValues.map((av) => ({
          name: av.attribute.name,
          value: av.value,
        })),
        quantity: item.quantity,
        price: item.finalPrice ?? item.price ?? 0,
        orderId: order.id,
        status: order.status,
        adminStatus: item.adminStatus,
        createdAt: order.createdAt,
        siteurl:
          item.inputValues?.find((iv) => iv.field?.label === "Site URL")?.value ||
          "",
        keyword:
          item.inputValues?.find((iv) => iv.field?.label === "Keyword")?.value ||
          "",
      }))
  );

  // Generate security orders
  const security: SecurityItem[] = orders.flatMap((order) =>
    order.items
      .filter((item) => item.variant?.product?.slug === "security")
      .map((item) => ({
        id: item.id,
        slug: item.variant.product.slug,
        productTitle: item.variant.product.title,
        attributes: item.variant.attributeValues.map((av) => ({
          name: av.attribute.name,
          value: av.value,
        })),
        quantity: item.quantity,
        price: item.finalPrice ?? item.price ?? 0,
        orderId: order.id,
        status: order.status,
        createdAt: order.createdAt,
        siteurl:
          item.inputValues?.find((iv) => iv.field?.label === "Site URL")?.value ||
          "",
        keyword:
          item.inputValues?.find((iv) => iv.field?.label === "Keyword")?.value ||
          "",
      }))
  );

  const jobs: Jobs = {
    backlink: backlinks,
    security: security,
    content: [],
    cluster: [],
    seo: [],
    spam: [],
  };

  if (!isLoggedIn) {
    return (
      <p className="text-center py-10">
        ابتدا باید وارد حساب کاربری خود شوید
      </p>
    );
  }

  if (loading) {
    return <p className="text-center py-10">در حال بارگیری...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative min-h-screen">
        <div className="md:w-7/12 mx-auto px-4 py-6 max-w-7xl">
          <HeaderPanel />

          {/* Sidebar always visible */}
          <DashboardSidebar
            activeSection={activeTab || ""}
            setActiveSection={setActiveTab}
            isMobile={isMobile}
          />

          {/* Home Page */}
          {!activeTab && (
            <div className="mt-6 flex flex-col gap-4 items-center justify-center h-80 rounded-2xl shadow-lg glass-effect">
              <h2 className="text-2xl font-semibold mb-4">پنل کاربری</h2>
              <p>لطفا یک بخش را از نوار کناری انتخاب کنید</p>
            </div>
          )}

          {/* Dashboard Content */}
          {activeTab && (
            <div className="mt-6 relative rounded-2xl h-screen shadow-lg overflow-hidden glass-effect hover-scale animate-slideInRight z-0">
              <DashboardContent jobs={jobs} activeSection={activeTab} />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setActiveTab(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  بازگشت به خانه
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
