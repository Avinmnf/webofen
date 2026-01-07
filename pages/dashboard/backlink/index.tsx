"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useOrderInput } from "@/hooks/useOrderInput";
import { useUserOrders } from "@/hooks/useUserOrders";
import { useVipDeadline } from "@/hooks/useVipDeadline";
import { useAuth } from "@/contexts/AuthContext";
import SimpleProgress from "@/components/dashboard/AnimatedProgress";
import { motion, AnimatePresence } from 'framer-motion';
// Add these imports at the top of BacklinkPage
import { Calendar, Tag, Hash, ExternalLink } from 'lucide-react';
import {
  PlayCircle,
  Edit2,
  AlertOctagon,
  CheckCircle,
  Clock,
  Package,
  FileText,
  AlertTriangle,
  Copy,
  History as HistoryIcon
} from "lucide-react";

// Import reusable components
import ProductDashboardWrapper from "@/components/dashboard/products/ProductDashboardWrapper";
import TabNavigation from "@/components/dashboard/products/TabNavigation";
import OrderItemCard from "@/components/dashboard/products/OrderItemCard";
import InputModal from "@/components/dashboard/products/InputModal";
import SuccessToast from "@/components/dashboard/products/SuccessToast";
import { LoadingState, ErrorState, LoginRequiredState, EmptyState } from "@/components/dashboard/products/LoadingStates";
import { isDelayed, shouldShowProgressBar, stripHtmlTags } from "@/components/dashboard/products/statusHelpers";

interface Variant {
  product: {
    id: string;
    slug: string;
    title: string;
  };
  attributeValues: {
    attribute: { name: string };
    value: string;
  }[];
}

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
  delayed?: boolean;
  completionTime?: string;
  deadline?: string;
  vipDeadline?: string;
  createdAt: string;
  startTime: string;
  siteurl?: string;
  keyword: string;
  imageUrl?: string;
  videoUrl?: string;
  submittedValues?: { id: string; label: string; value: string }[];
  completionReport?: string;
  variant: Variant;
}

const BacklinkPage: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const {
    updateVipDeadline,
    loading: deadlineLoading,
    error: deadlineError,
    resetError,
  } = useVipDeadline();
  const { orders, loading, error, role } = useUserOrders();
  const [openCalendarId, setOpenCalendarId] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Record<string, Date | null>>({});
  const [inputValuesMap, setInputValuesMap] = useState<Record<string, any[]>>({});
  const [backlinksState, setBacklinksState] = useState<BacklinkItem[]>([]);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<"all" | "completed" | "cancelled" | "out_of_time">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDelayNotification, setShowDelayNotification] = useState(false);
  const [notificationItem, setNotificationItem] = useState<BacklinkItem | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed' | 'delayed'>('active');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const {
    fields,
    values,
    setValues,
    loading: inputLoading,
    error: inputError,
    handleChange,
    submitValues,
    fetchValues,
  } = useOrderInput(selectedOrderItemId);

  // Filtering logic - CLEARLY SEPARATED
  const pendingItems = useMemo(() =>
    backlinksState.filter(item => {
      // PENDING: Items with NO submitted values
      const hasSubmittedValues = item.submittedValues && item.submittedValues.length > 0;
      const hasValidValues = hasSubmittedValues
        ? item.submittedValues?.some(val => val.value && val.value.trim() !== '') || false
        : false;

      return item.adminStatus === "pending" && !hasValidValues && !isDelayed(item);
    }), [backlinksState]);

  // ACTIVE: Items that admin has started working on (has startTime AND is in_progress)
  const activeItems = useMemo(() =>
    backlinksState.filter(item => {
      // Don't show completed, cancelled, or out_of_time
      if (["completed", "cancelled", "out_of_time"].includes(item.adminStatus || "")) {
        return false;
      }
      // Don't show delayed items
      if (isDelayed(item)) {
        return false;
      }
      // Show only if work has started (has startTime) AND status is in_progress
      return item.adminStatus === "in_progress" && !!item.startTime;
    }), [backlinksState]);

  // WAITING: Items with submitted values but admin hasn't started yet
  const waitingForAdminItems = useMemo(() =>
    backlinksState.filter(item => {
      // Items that have submitted values but adminStatus is still "pending"
      const hasSubmittedValues = item.submittedValues && item.submittedValues.length > 0;
      const hasValidValues = hasSubmittedValues
        ? item.submittedValues?.some(val => val.value && val.value.trim() !== '') || false
        : false;

      return item.adminStatus === "pending" && hasValidValues && !isDelayed(item);
    }), [backlinksState]);

  const delayedItems = useMemo(() =>
    backlinksState.filter(item => isDelayed(item)), [backlinksState]);

  const completedItems = useMemo(() =>
    backlinksState.filter(item => item.adminStatus === "completed"), [backlinksState]);

  const filteredHistoryItems = useMemo(() => {
    return backlinksState.filter((item) => {
      if (historyFilter === "all") return true;
      if (historyFilter === "completed") return item.adminStatus === "completed";
      if (historyFilter === "cancelled") return item.adminStatus === "cancelled";
      if (historyFilter === "out_of_time") return item.adminStatus === "out_of_time";
      return true;
    });
  }, [backlinksState, historyFilter]);

  // Process orders into backlink items
  useEffect(() => {
    const mappedBacklinks: BacklinkItem[] = orders.flatMap((order) =>
      order.items
        .filter((item) => item.variant?.product?.slug === "backlink")
        .map((item) => {
          const savedValues = inputValuesMap[item.id] || [];
          const itemInputValues = item.inputValues || [];

          const allSubmittedValues = savedValues.length > 0
            ? savedValues
            : itemInputValues.map((iv: any) => ({
              id: iv.field?.id || `field_${Date.now()}_${Math.random()}`,
              label: iv.field?.label || 'Unknown',
              value: iv.value || ''
            }));

          return {
            id: item.id,
            slug: item.variant.product.slug,
            productTitle: item.variant.product.title,
            attributes: item.variant.attributeValues.map((av) => ({
              name: av.attribute.name,
              value: av.value,
            })),
            quantity: item.quantity,
            price: item.finalPrice ?? item.originalPrice ?? 0,
            orderId: order.id,
            status: order.status,
            adminStatus: item.adminStatus || "pending",
            createdAt: order.createdAt,
            imageUrl: item.variant.product.imageUrl,
            videoUrl: item.variant.product.videoUrl,
            completionTime: item.completionTime,
            siteurl: itemInputValues.find((iv: any) => iv.field?.label === "Site URL")?.value || "",
            keyword: itemInputValues.find((iv: any) => iv.field?.label === "Keyword")?.value || "",
            completionReport: item.completionReport || "",
            variant: item.variant,
            startTime: item.startTime || "",
            deadline: item.deadline || "",
            vipDeadline: item.vipDeadline || "",
            submittedValues: allSubmittedValues,
            delayed: !!item.delayed,
          };
        })
    );
    setBacklinksState(mappedBacklinks);
  }, [orders, inputValuesMap]);

  // Fetch input values
  useEffect(() => {
    const fetchAllValues = async () => {
      const map: Record<string, any[]> = {};
      for (const order of orders) {
        for (const item of order.items) {
          if (item.variant?.product?.slug === "backlink") {
            const savedValues = await fetchValues(item.id);
            map[item.id] = savedValues || [];
          }
        }
      }
      setInputValuesMap(map);
    };
    fetchAllValues();
  }, [orders]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setOpenCalendarId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedItem = useMemo(() =>
    backlinksState.find((item) => item.id === selectedOrderItemId),
    [backlinksState, selectedOrderItemId]
  );

  const canEdit = selectedItem?.adminStatus === "pending";
  const isVIP = role === "vipclient";
  const mainActiveItem = activeItems[0];

  // Auto-select tab based on content
  useEffect(() => {
    if (waitingForAdminItems.length > 0 || activeItems.length > 0) {
      setActiveTab('active');
    } else if (pendingItems.length > 0) {
      setActiveTab('pending');
    } else if (delayedItems.length > 0) {
      setActiveTab('delayed');
    } else if (completedItems.length > 0) {
      setActiveTab('completed');
    }
  }, [activeItems.length, pendingItems.length, completedItems.length, delayedItems.length, waitingForAdminItems.length]);

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedOrderItemId(null);
    setValues({});
  };

  const handleItemClick = async (id: string) => {
    const item = backlinksState.find((i) => i.id === id);
    if (!item) return;

    if (item.adminStatus === "completed") {
      setCompletedOrderId(id);
      return;
    }

    setSelectedOrderItemId(id);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      await submitValues();

      const submittedValuesArray = fields?.map((field) => ({
        id: field.id,
        label: field.label,
        value: values[field.id] || "",
      })) ?? [];

      setInputValuesMap(prev => ({
        ...prev,
        [selectedOrderItemId!]: submittedValuesArray
      }));

      setBacklinksState(prev =>
        prev.map((item) =>
          item.id === selectedOrderItemId
            ? {
              ...item,
              submittedValues: submittedValuesArray,
              adminStatus: "pending", // Keep as pending until admin starts
            }
            : item
        )
      );

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setShowModal(false);
      setTimeout(() => {
        setActiveTab('active');
      }, 100);

    } catch (err) {
      console.error("Failed to submit input values", err);
    }
  };

  const handleUpdateVipDeadline = async (itemId: string, deadlineDate: string) => {
    try {
      await updateVipDeadline(itemId, deadlineDate);
      setBacklinksState((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, vipDeadline: deadlineDate }
            : item
        )
      );
      setOpenCalendarId(null);
    } catch (error) {
      console.error("Failed to update VIP deadline:", error);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Define tabs
  const tabs = [
    {
      id: 'active',
      label: 'در حال اجرا',
      icon: <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
      count: activeItems.length + waitingForAdminItems.length,
      color: 'text-gray-900',
      bgColor: 'bg-gray-100'
    },
    {
      id: 'pending',
      label: 'نیاز به ثبت',
      icon: <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />,
      count: pendingItems.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'delayed',
      label: 'تاخیر خورده',
      icon: <AlertOctagon className="w-3 h-3 sm:w-4 sm:h-4" />,
      count: delayedItems.length,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 'completed',
      label: 'تکمیل شده',
      icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
      count: completedItems.length,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];
  const handleTabChange = (tabId: string) => {
    // Type guard to ensure tabId is one of the valid values
    if (['active', 'pending', 'completed', 'delayed'].includes(tabId)) {
      setActiveTab(tabId as 'active' | 'pending' | 'completed' | 'delayed');
    }
  };

  // Loading states
  if (!isLoggedIn) return <LoginRequiredState />;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

  // Tab content components
  const ActiveTabContent = () => {
    // Separate truly active items (with startTime) from waiting items
    const trulyActiveItems = activeItems.filter(item => item.id !== mainActiveItem?.id);
    const waitingItems = waitingForAdminItems;

    return (
      <div className="space-y-8">
        <SuccessToast
          message="اطلاعات با موفقیت ثبت شد!"
          isVisible={showSuccessToast}
        />

        {/* Main Active Order */}
        {mainActiveItem && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] // Custom easing curve for smooth motion
    }}
    className="relative"
  >
    <div className="bg-[#153e4c] shadow-sm rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-7 overflow-hidden">
      {/* Slide-in content container */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
          {/* Content Section - Left */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 space-y-4 sm:space-y-5 h-55 bg-white rounded-xl p-6"
          >
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {isDelayed(mainActiveItem) && (
                  <motion.span
                    initial={{ rotate: -10, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                      delay: 0.3
                    }}
                    className="px-2 py-1 sm:px-2.5 sm:py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    تاخیر خورده
                  </motion.span>
                )}
                {isVIP && mainActiveItem.vipDeadline && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 500,
                      delay: 0.35
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg"
                  >
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">
                      مهلت ویژه
                    </span>
                  </motion.span>
                )}
              </div>
              
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="text-xl  font-semibold text-gray-900 leading-snug"
              >
                {mainActiveItem.productTitle}
              </motion.h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-md font-medium text-gray-700 mb-1.5">ویژگی‌ها</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mainActiveItem.attributes.map((attr, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ 
                          scale: 0,
                          rotate: -20 
                        }}
                        animate={{ 
                          scale: 1,
                          rotate: 0 
                        }}
                        transition={{ 
                          type: "spring",
                          stiffness: 300,
                          damping: 12,
                          delay: 0.4 + idx * 0.08
                        }}
                        whileHover={{ 
                          y: -2,
                          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)"
                        }}
                        className="px-2 py-1 sm:px-2.5 sm:py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-md font-medium cursor-default inline-block"
                      >
                        {attr.value}
                      </motion.span>
                    ))}
                  </div>
                </div>
                
                <motion.div
                className="flex justify-between mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-md font-medium text-gray-700 mb-1">تاریخ خرید</p>
                  <p className="text-gray-900 font-medium text-md">
                    {new Date(mainActiveItem.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {mainActiveItem.submittedValues?.map((val, idx) => (
                  <motion.div
                    key={val.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.3,
                      delay: 0.7 + idx * 0.1 
                    }}
                    whileHover={{ 
                      x: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="flex items-center justify-between py-1.5 group hover:bg-gray-50 rounded px-1.5 -mx-1.5 transition-colors"
                  >
                    <span className="text-sm text-gray-600">{val.label}:</span>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[140px]">
                        {val.value}
                      </span>
                      <motion.button
                        onClick={() => copyToClipboard(val.value, val.id)}
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 5 
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded"
                      >
                        {copiedId === val.id ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 500
                            }}
                          >
                            <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
                          </motion.div>
                        ) : (
                          <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Progress Bar Section - Right side */}
          <motion.div
  initial={{ x: 30, opacity: 0, scale: 0.95 }}
  animate={{ x: 0, opacity: 1, scale: 1 }}
  transition={{ 
    duration: 0.5,
    delay: 0.3,
    ease: [0.22, 1, 0.36, 1]
  }}
  className="lg:w-auto w-full"
>
  <div className="flex flex-col items-center gap-3">
    {shouldShowProgressBar(mainActiveItem) ? (
      <>
        {/* Remove the animated container around SimpleProgress */}
        <div className="relative">
          <div className="scale-75 sm:scale-90 lg:scale-100 transform-gpu">
            <SimpleProgress
              startTime={mainActiveItem.startTime}
              deadline={mainActiveItem.deadline || ""}
              completionTime={mainActiveItem.completionTime}
              delayed={isDelayed(mainActiveItem)}
              canceled={mainActiveItem.adminStatus === "cancelled"}
              productImage={mainActiveItem.imageUrl}
              videoUrl={mainActiveItem.videoUrl}
              productTitle={mainActiveItem.productTitle}
            />
            
            <motion.div
              className="pt-3 sm:pt-4 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                onClick={() => handleItemClick(mainActiveItem.id)}
                whileHover={{ 
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-white rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                مشاهده جزئیات
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </>
    ) : (
      <div className="w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center relative">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
          <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
        </div>
        <div className="text-center">
          <span className="text-xs sm:text-sm font-medium text-gray-600 block">در انتظار شروع</span>
          <span className="text-xs text-gray-500">به زودی شروع می‌شود</span>
        </div>
      </div>
    )}
  </div>
</motion.div>
        </div>
      </div>
      
      {/* Subtle hover overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl sm:rounded-2xl"
        whileHover={{ opacity: 1 }}
      />
    </div>
  </motion.div>
)}

        {trulyActiveItems.length > 0 && (
          <div className="mt-8 sm:mt-12 bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6 px-1">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg sm:rounded-xl">
                <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">دیگر سفارش‌های در حال اجرا</p>
              </div>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                {trulyActiveItems.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
              {trulyActiveItems.map((item) => (
                <OrderItemCard
                  key={item.id}
                  item={item}
                  onClick={handleItemClick}
                  copyToClipboard={copyToClipboard}
                  copiedId={copiedId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Waiting for Admin Items (submitted but not started) */}
        {waitingItems.length > 0 && (
          <div className="mt-8 sm:mt-12 bg-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 px-1">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 ml-2 bg-amber-50 rounded-lg sm:rounded-xl">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-base sm:text-xl text-gray-900 tracking-tight">در انتظار </p>
                  <p className="text-xs sm:text-sm text-gray-500">اطلاعات ثبت شده، منتظر شروع کار توسط تیم فنی</p>
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0">
                {waitingItems.length}
                سفارش
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
              {waitingItems.map((item) => (
                <OrderItemCard
                  key={item.id}
                  item={item}
                  onClick={handleItemClick}
                  copyToClipboard={copyToClipboard}
                  copiedId={copiedId}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Update the PendingTabContent component in BacklinkPage

  const PendingTabContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">نیاز به ثبت اطلاعات</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">لطفاً اطلاعات سفارش‌های زیر را تکمیل کنید</p>
        </div>
        <span className="mt-2 sm:mt-0 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium border border-blue-100">
          {pendingItems.length} سفارش
        </span>
      </div>

      {pendingItems.length === 0 ? (
        <div className="text-center py-8 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border border-gray-200">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
          </div>
          <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">همه سفارش‌ها ثبت شدند</h3>
          <p className="text-gray-600 max-w-md mx-auto text-xs sm:text-sm">
            تمام سفارش‌های در انتظار، اطلاعاتشان ثبت شده است.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pendingItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -4,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item.id)}
              className="group relative bg-white rounded-xl sm:rounded-2xl cursor-pointer overflow-hidden border border-blue-200"
              style={{
                boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(59, 130, 246, 0.05)',
              }}
            >
              {/* Gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-50" />

              {/* Status badge */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                <div className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 backdrop-blur-sm">
                  <motion.div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>نیاز به ثبت</span>
                </div>
              </div>

              {/* Date badge */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs text-gray-600 border border-gray-200">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{new Date(item.createdAt).toLocaleDateString("fa-IR")}</span>
                </div>
              </div>

              {/* Main content */}
              <div className="p-4 sm:p-6 pt-14 sm:pt-16">
                {/* Icon section */}
                <div className="flex justify-center mb-4 sm:mb-6">
                  <motion.div
                    className="relative"
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-100 transition-all duration-500 border-2 border-blue-100">
                      <Edit2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 group-hover:text-blue-700 transition-colors duration-500" />
                    </div>

                    {/* Pulse effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-200"
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </div>

                {/* Product title */}
                <div className="mb-4 sm:mb-6 text-center">
                  <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                    {item.productTitle}
                  </h4>

                  {/* Animated underline */}
                  <motion.div
                    className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                      width: '60%',
                      opacity: 1,
                    }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  />
                </div>

                {/* Attributes */}
                {item.attributes.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                      <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="font-medium">ویژگی‌ها</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {item.attributes.map((attr, idx) => (
                        <motion.div
                          key={idx}
                          className="px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100"
                          initial={false}
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ delay: idx * 0.1, duration: 0.5 }}
                        >
                          <div className="text-xs text-blue-600 mb-0.5 sm:mb-1">{attr.name}</div>
                          <div className="text-sm font-semibold text-gray-900">{attr.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order ID */}
                <motion.div
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50/50 to-transparent mt-3 sm:mt-4"
                  animate={{
                    backgroundColor: ['#f0f9ff', '#e0f2fe', '#f0f9ff'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    <span className="text-xs sm:text-sm text-gray-500">کد سفارش:</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-900 font-mono font-semibold">
                      {item.id.slice(-8)}
                    </span>
                    <motion.div
                      animate={{
                        x: [0, 2, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Action button */}
                <motion.div
                  className="mt-4 sm:mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    className="w-full py-2.5 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-blue-200"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    ثبت اطلاعات سفارش
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
  const DelayedTabContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
        <div>
          <p className="text-base sm:text-lg text-gray-900">سفارش‌های تاخیر خورده</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">این سفارش‌ها در حال پیگیری توسط ادمین ها هستند</p>
        </div>
        <span className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0">{delayedItems.length} سفارش</span>
      </div>
      {delayedItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl sm:rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">سفارش تاخیر خورده‌ای ندارید</h3>
          <p className="text-gray-600 max-w-md mx-auto text-xs sm:text-sm">
            همه سفارش‌های شما طبق برنامه در حال انجام هستند.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
          {delayedItems.map((item) => (
            <OrderItemCard
              key={item.id}
              item={item}
              onClick={handleItemClick}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
            />
          ))}
        </div>
      )}
    </div>
  );

  const CompletedTabContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">سفارش‌های تکمیل شده</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">سفارش‌هایی که با موفقیت انجام شده‌اند</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
          <span className="text-xs sm:text-sm text-gray-500">{completedItems.length} سفارش</span>
        </div>
      </div>

      {completedItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl sm:rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">سفارش تکمیل شده‌ای ندارید</h3>
          <p className="text-gray-600 max-w-md mx-auto text-xs sm:text-sm">
            سفارش‌های تکمیل شده در این بخش نمایش داده می‌شوند.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {completedItems.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg sm:rounded-xl border p-3 sm:p-5 hover:border-emerald-300 transition cursor-pointer group"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-emerald-600">تکمیل شده</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(item.completionTime || item.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>

              <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">{item.productTitle}</h4>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                {item.attributes.map((attr, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {attr.value}
                  </span>
                ))}
              </div>

              {item.completionReport && (
                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1.5 sm:mb-2">گزارش تکمیل:</p>
                  <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                    {stripHtmlTags(item.completionReport)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ProductDashboardWrapper
      title="بک لینک"
      isVIP={isVIP}
      onOpenHistory={() => setHistoryModalOpen(true)}
      // Add these props:
      historyItems={backlinksState} // or filteredHistoryItems if you want to use the filtered ones
      historyFilter={historyFilter}
      onHistoryFilterChange={setHistoryFilter}
    >
      <div className="mb-6 sm:mb-8">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange} // Use the wrapper function
        />
      </div>

      {/* Tab Content */}
      <div className="">
        {activeTab === 'active' && <ActiveTabContent />}
        {activeTab === 'pending' && <PendingTabContent />}
        {activeTab === 'delayed' && <DelayedTabContent />}
        {activeTab === 'completed' && <CompletedTabContent />}
      </div>

      {/* Empty State */}
      {backlinksState.length === 0 && <EmptyState />}

      {/* Input Modal */}
      <InputModal
        isOpen={showModal}
        onClose={handleModalClose}
        selectedItem={selectedItem}
        fields={fields || []}
        values={values}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        canEdit={canEdit}
        isVIP={isVIP}
        inputLoading={inputLoading}
        inputError={inputError}
        deadlineLoading={deadlineLoading}
        deadlineError={deadlineError}
        resetError={resetError}
        openCalendarId={openCalendarId}
        setOpenCalendarId={setOpenCalendarId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        handleUpdateVipDeadline={handleUpdateVipDeadline}
      />
    </ProductDashboardWrapper>
  );
};

export default BacklinkPage;