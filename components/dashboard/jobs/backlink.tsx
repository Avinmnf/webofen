"use client";

import React, { useState } from "react";
import { useOrderInput } from "@/hooks/useOrderInput";
import HoverVideo from "@/components/videos/hovervideos";
import ProgressCircle from "../progress";
import SmallProgressCircle from "../smallprogress";

export interface BacklinkItem {
  id: string;
  slug: string;
  productTitle: string;
  attributes: { name: string; value: string }[];
  quantity: number;
  price: number;
  orderId: string;
  status: string;
  adminStatus?: string; // for progress
  delayed?: string; // string from backend (date or "true")
  completionTime?: string;
  deadline?: string;
  createdAt: string;
  siteurl?: string;
  keyword: string;
}

interface BacklinkProps {
  backlinks: BacklinkItem[];
}

// Map adminStatus to percentage
const statusProgressMap: Record<string, number> = {
  pending: 0,
  in_progress: 50,
  completed: 100,
};

const Backlink: React.FC<BacklinkProps> = ({ backlinks }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
    null
  );

  const { fields, values, loading, error, handleChange, submitValues } =
    useOrderInput(selectedOrderItemId);

  const handleClick = (id: string) => {
    setSelectedOrderItemId(id);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      await submitValues();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to submit input values", err);
    }
  };

  const getProgress = (item: BacklinkItem) =>
    statusProgressMap[item.adminStatus ?? "pending"] ?? 0;

  // Updated isDelayed: treats "out_of_time" as delayed
  const isDelayed = (item: BacklinkItem) => {
    if (item.adminStatus === "out_of_time") return true; // backend status override
    if (!item.delayed) return false;

    const delayedStr = item.delayed.toLowerCase().trim();
    if (delayedStr === "true") return true;
    if (delayedStr === "false") return false;

    const delayedDate = new Date(delayedStr);
    return !isNaN(delayedDate.getTime()) && delayedDate < new Date();
  };

  // Separate items by status
  const inProgressItems = backlinks.filter(
    (item) => item.adminStatus === "in_progress"
  );

  const delayedItems = backlinks.filter(
    (item) => item.adminStatus === "out_of_time"
  );

  const canceledItems = backlinks.filter(
    (item) => item.adminStatus === "canceled"
  );

  const normalItems = backlinks.filter(
    (item) =>
      item.adminStatus !== "in_progress" &&
      item.adminStatus !== "pending" &&
      item.adminStatus !== "out_of_time" &&
      item.adminStatus !== "canceled"
  );

  // Pick the first in-progress as the "big" one
  const bigInProgressItem = inProgressItems[0];
  const otherInProgressItems = inProgressItems.slice(1);

  // Pending item (status === "0")
  const pendingBacklink = backlinks.find((item) => item.status === "0");

  // Now bigInProgressItem, otherInProgressItems, delayedItems, normalItems
  // are ready to render

  return (
    <>
      <div className="flex flex-col items-center text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm space-y-8">
        {/* Top in-progress pill */}
        {bigInProgressItem && (
          <div className="flex flex-row items-center relative">
            <ProgressCircle
              percentage={getProgress(bigInProgressItem)}
              delayed={isDelayed(bigInProgressItem)}
            />
            <button
              onClick={() => handleClick(bigInProgressItem.id)}
              className="absolute right-[45px] w-16 h-16 flex items-center justify-center"
            >
              {/* SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="150"
                height="150"
                viewBox="-46.08 -46.08 604.16 604.16"
              >
                <path
                  fill="#DFDFE1"
                  d="M479.587 188.925c43.218-43.221 43.218-113.29 0-156.512-43.221-43.218-113.292-43.218-156.513 0L32.413 323.075c-43.218 43.221-43.216 113.29.002 156.512 43.219 43.218 113.29 43.218 156.51 0z"
                />
                <path
                  fill="#CFCDD2"
                  d="M479.587 32.414 32.414 479.587c43.219 43.218 113.29 43.218 156.51 0l290.663-290.662c43.218-43.221 43.218-113.29 0-156.511"
                />
                <path
                  fill="#6FD6E5"
                  d="m177.743 177.745-145.33 145.33c-43.218 43.221-43.216 113.29.002 156.512 43.219 43.218 113.29 43.218 156.51 0l145.331-145.331z"
                />
                <path
                  fill="#64c3d1"
                  d="M255.999 256 32.414 479.587c43.219 43.218 113.29 43.218 156.51 0l145.331-145.331z"
                />
              </svg>
            </button>
            <div className="text-center mt-2 text-sm">
              <div>
                <p className="text-gray-600">خرید:</p>
                <p className="text-gray-600">
                  {new Date(bigInProgressItem.createdAt).toLocaleDateString(
                    "fa-IR"
                  )}
                </p>
              </div>
              <div>
                <p className="text-gray-600">تعداد:</p>
                <p className="text-gray-700 font-semibold">
                  {bigInProgressItem.attributes
                    .map((attr) => attr.value)
                    .join(" / ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Small pills: other in-progress, delayed, and normal items */}
        <div className="flex flex-wrap justify-center gap-6 w-full">
          {[
            ...otherInProgressItems,
            ...delayedItems,
            ...canceledItems,
            ...normalItems,
          ].map((item) => {
            const variantName = item.attributes.map((a) => a.value).join(" / ");
            const delayed = isDelayed(item);
            const canceled = item.adminStatus === "canceled";

            return (
              <div
                key={item.id}
                className="flex flex-col items-center relative scale-90"
              >
                <SmallProgressCircle
                  percentage={getProgress(item)}
                  delayed={delayed}
                  canceled={canceled}
                />
                <button
                  onClick={() => handleClick(item.id)}
                  className="absolute top-4 w-12 h-12 flex items-center justify-center"
                >
                  {/* Pill SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="-46.08 -46.08 604.16 604.16"
                  >
                    <path
                      fill="#DFDFE1"
                      d="M479.587 188.925c43.218-43.221 43.218-113.29 0-156.512-43.221-43.218-113.292-43.218-156.513 0L32.413 323.075c-43.218 43.221-43.216 113.29.002 156.512 43.219 43.218 113.29 43.218 156.51 0z"
                    />
                    <path
                      fill="#CFCDD2"
                      d="M479.587 32.414 32.414 479.587c43.219 43.218 113.29 43.218 156.51 0l290.663-290.662c43.218-43.221 43.218-113.29 0-156.511"
                    />
                    <path
                      fill="#6FD6E5"
                      d="m177.743 177.745-145.33 145.33c-43.218 43.221-43.216 113.29.002 156.512 43.219 43.218 113.29 43.218 156.51 0l145.331-145.331z"
                    />
                    <path
                      fill="#64c3d1"
                      d="M255.999 256 32.414 479.587c43.219 43.218 113.29 43.218 156.51 0l145.331-145.331z"
                    />
                  </svg>

                  {/* Red line if delayed */}
                  {delayed && (
                    <div className="mt-1 w-full h-1 bg-red-500 rounded" />
                  )}
                </button>

                <div className="text-center mt-2 text-sm">
                  <div>
                    <p className="text-gray-600">خرید:</p>
                    <p className="text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">تعداد:</p>
                    <p className="text-gray-700 font-semibold">{variantName}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {pendingBacklink && (
        <div className="flex justify-center w-full mt-6">
          <button onClick={() => handleClick(pendingBacklink.id)}>
            <div className="animate-bounce w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              ⚡
            </div>
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div className="bg-white w-[40%] relative rounded-xl overflow-hidden">
            <div className="p-2 relative w-full aspect-[19/9] bg-[#001933] rounded-xl overflow-hidden flex items-start">
              <HoverVideo
                src="/guidance/Hailuo_Video_Create_a_smooth_looping_animat_420401581408546819.mp4"
                className="h-full absolute left-0 w-auto object-cover"
              />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-white text-2xl hover:text-red-500 z-20"
              >
                &times;
              </button>

              <div className="absolute top-[25%] right-[15%] z-10 flex flex-col gap-2">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  ثبت اطلاعات
                </h2>
                {fields.map((field) => (
                  <input
                    key={field.id}
                    type={field.fieldType === "number" ? "number" : "text"}
                    name={field.id}
                    placeholder={field.placeholder || field.label}
                    value={values[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="w-full mb-3 p-2 border border-gray-200 rounded-lg text-white"
                    required={field.required}
                  />
                ))}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#6fd6e5] text-white py-2 rounded hover:bg-green-700"
                >
                  ثبت
                </button>
              </div>
            </div>

            {loading && <p>در حال بارگذاری فیلدها...</p>}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Backlink;
