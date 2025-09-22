"use client";

import React from "react";
import SmallProgressCircle from "../smallprogress";
import Image from "next/image";
import { BacklinkItem } from "@/pages/dashboard/backlink";
interface BacklinkHistoryProps {
  history: BacklinkItem[];
  onSelect: (id: string) => void;
  getProgress: (item: BacklinkItem) => number;
  isDelayed: (item: BacklinkItem) => boolean;
}

const BacklinkHistory: React.FC<BacklinkHistoryProps> = ({
  history,
  onSelect,
  getProgress,
  isDelayed,
}) => {
  if (!history.length)
    return (
      <p className="text-gray-400 text-sm text-center mt-4">
        تاریخچه‌ای موجود نیست.
      </p>
    );

  return (
    <div className="flex flex-wrap justify-center gap-6 w-full">
      {history.map((item) => {
        const variantName = item.attributes.map((a) => a.value).join(" / ");
        const delayed = isDelayed(item);

        return (
          <div
            key={item.id}
            className="flex flex-col items-center relative scale-90"
          >
            <SmallProgressCircle
              percentage={getProgress(item)}
              delayed={delayed}
            />
            <button
              onClick={() => onSelect(item.id)}
              className="absolute top-4 w-12 h-12 flex items-center justify-center"
            >
              <div className="relative w-full h-64 flex justify-center items-center overflow-hidden">
                <Image
                  width={220}
                  height={220}
                  alt="Backlink"
                  src={"/dashboard/backlink.png"}
                  className="object-contain rotate-30"
                />
              </div>
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
  );
};

export default BacklinkHistory;
