"use client";

import React from 'react';
import { Crown, History } from 'lucide-react';

interface ProductDashboardWrapperProps {
  title: string;
  children: React.ReactNode;
  isVIP: boolean;
  onOpenHistory: () => void;
}

const ProductDashboardWrapper: React.FC<ProductDashboardWrapperProps> = ({
  title,
  children,
  isVIP,
  onOpenHistory
}) => {
  return (
    <div className="h-full overflow-auto bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm">
        <div className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl text-gray-700">مدیریت سفارش‌های {title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {isVIP && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">کاربر ویژه</span>
                </div>
              )}
              <button
                onClick={onOpenHistory}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1d546b] rounded-lg text-white hover:text-gray-200 cursor-pointer transition"
              >
                <History className="w-4 h-4" />
                تاریخچه
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mx-auto">
        {children}
      </div>
    </div>
  );
};

export default ProductDashboardWrapper;