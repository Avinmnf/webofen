"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardHome: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <p className="text-center py-10">
        ابتدا باید وارد حساب کاربری خود شوید
      </p>
    );
  }

  return (
      <div className="flex flex-col gap-4 items-center justify-center h-80 rounded-2xl shadow-lg glass-effect">
        <h2 className="text-2xl font-semibold mb-4">پنل کاربری</h2>
        <p>لطفا یک بخش را از نوار کناری انتخاب کنید</p>
      </div>
  );
};

export default DashboardHome;
