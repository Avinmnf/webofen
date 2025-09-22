"use client";

import { useEffect, useState } from "react";
import ProgressCircle from "./progress"; // adjust path if needed

// -----------------------------
// Types defined directly here
// -----------------------------
interface AttributeValue {
  value: string;
  attribute: {
    name: string;
  };
}

interface Variant {
  product: {
    id: string;
    slug: string;
    title: string;
  };
  attributeValues: AttributeValue[];
}

interface OrderItemInputValue {
  id: string;
  field: {
    label: string;
  };
  value: string;
}

export interface OrderItem {
  id: string;
  createdAt: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  finalPrice?: number;
  status: string;
  adminStatus?: string;
  delayed?: boolean;
  completionTime?: string;
  variant: Variant;
  inputValues?: OrderItemInputValue[];
  completionReport?: string;
  deadline?: string; // optional deadline if you want
}

interface AnimatedProgressProps {
  item: OrderItem;
  canceled?: boolean;
  delayed?: boolean;
}
const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  item,
  canceled = false,
  delayed = false,
}) => {
  const [percentage, setPercentage] = useState(0);

  const getDynamicProgress = () => {
    if (!item.completionTime) return 0;
    const start = new Date(item.createdAt).getTime();
    const end = new Date(item.completionTime).getTime();
    const now = Date.now();
    if (now >= end || item.adminStatus === "completed") return 100;
    if (now <= start) return 0;
    return ((now - start) / (end - start)) * 100;
  };

  useEffect(() => {
    setPercentage(getDynamicProgress());
    const interval = setInterval(() => {
      setPercentage(getDynamicProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, [item]);

  return (
    <ProgressCircle
      percentage={percentage}
      delayed={delayed}
      canceled={canceled}
    />
  );
};

export default AnimatedProgress;
