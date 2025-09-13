'use client';

import React from "react";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardContent, { Jobs, BacklinkItem } from "@/components/dashboard/content";
import HeaderPanel from "@/components/dashboard/header";
import { useAuth } from "@/contexts/AuthContext";
import { useUserOrders } from "@/hooks/useUserOrders";

const Page: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { orders, loading, error } = useUserOrders();

  // Convert orders -> backlinks
const backlinks: BacklinkItem[] = orders.flatMap((order) =>
  order.items.map((item) => ({
    id: item.id,
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
    siteurl: item.inputValues?.find((iv) => iv.field.label === "Site URL")?.value || "",
    keyword: item.inputValues?.find((iv) => iv.field.label === "Keyword")?.value || "",
  }))
);

  const jobs: Jobs = {
    backlink: backlinks,
    content: [],
    security: [],
    cluster: [],
    seo: [],
    spam: [],
  };

  if (!isLoggedIn) {
    return <p className="text-center py-10">Please log in to view your dashboard.</p>;
  }

  if (loading) {
    return <p className="text-center py-10">Loading your dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
        <div className="md:w-7/12 mx-auto px-4 py-6 max-w-7xl">
          <div className="animate-fadeIn z-40">
            <HeaderPanel />
          </div>
          <div className="mt-6 relative rounded-2xl shadow-lg overflow-hidden glass-effect hover-scale animate-slideInRight z-0">
            <DashboardContent jobs={jobs} backlinks={backlinks} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
