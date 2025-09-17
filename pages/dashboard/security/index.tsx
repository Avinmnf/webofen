"use client";

import React from "react";
import Backlink, { BacklinkItem } from "@/components/dashboard/jobs/backlink";
import { useUserOrders } from "@/hooks/useUserOrders";
import { useAuth } from "@/contexts/AuthContext";

const BacklinkPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { orders, loading, error } = useUserOrders();

  if (!isLoggedIn) return <p className="text-center py-10">ابتدا باید وارد حساب کاربری خود شوید</p>;
  if (loading) return <p className="text-center py-10">در حال بارگیری...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  const backlinks: BacklinkItem[] = orders.flatMap(order =>
    order.items
      .filter(item => item.variant?.product?.slug === "backlink")
      .map(item => ({
        id: item.id,
        slug: item.variant.product.slug,
        productTitle: item.variant.product.title,
        attributes: item.variant.attributeValues.map(av => ({
          name: av.attribute.name,
          value: av.value,
        })),
        quantity: item.quantity,
        price: item.finalPrice ?? item.price ?? 0,
        orderId: order.id,
        status: order.status,
        adminStatus: item.adminStatus,
        createdAt: order.createdAt,
        siteurl: item.inputValues?.find(iv => iv.field?.label === "Site URL")?.value || "",
        keyword: item.inputValues?.find(iv => iv.field?.label === "Keyword")?.value || "",
      }))
  );

  return (
        <Backlink backlinks={backlinks} />
  );
};

export default BacklinkPage;
