"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useOrderInput } from "@/hooks/useOrderInput";
import { useUserOrders } from "@/hooks/useUserOrders";
import { useVipDeadline } from "@/hooks/useVipDeadline";
import { useAuth } from "@/contexts/AuthContext";
import SimpleProgress from "@/components/dashboard/AnimatedProgress";
import CircularProgressWithTimesmall from "@/components/dashboard/AnimatedProgresssmall";
import { Calendar as DatePicker } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit2,
  Calendar,
  Package,
  Link as LinkIcon,
  Crown,
  History,
  Filter,
  Copy,
  ExternalLink,
  AlertTriangle,
  PlayCircle,
  AlertOctagon,
  FileText,
  Zap
} from "lucide-react";

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


  // Fix for History Modal filtering
  const filteredHistoryItems = useMemo(() => {
    return backlinksState.filter((item) => {
      if (historyFilter === "all") return true;
      if (historyFilter === "completed") return item.adminStatus === "completed";
      if (historyFilter === "cancelled") return item.adminStatus === "cancelled";
      if (historyFilter === "out_of_time") return item.adminStatus === "out_of_time";
      return true;
    });
  }, [backlinksState, historyFilter]);


  // Calculate delayed items - FIXED LOGIC
  const isDelayed = (item: BacklinkItem) => {
    // If item is completed, it's not delayed
    if (item.adminStatus === "completed") return false;

    // If adminStatus is explicitly "out_of_time", return true
    if (item.adminStatus === "out_of_time") return true;

    // Only consider delayed if there's a startTime AND delayed flag is true
    if (!item.startTime) return false;

    // delayed is a boolean from Keystone checkbox
    return !!item.delayed;
  };

  const shouldShowProgressBar = (item: BacklinkItem) => {
    // Don't show progress for completed or cancelled items
    if (item.adminStatus === "completed" || item.adminStatus === "cancelled") {
      return false;
    }

    // Show progress only when work has started (has startTime) AND status is in_progress
    // OR if it's delayed (has startTime and delayed flag)
    return (item.adminStatus === "in_progress" && !!item.startTime) ||
      (isDelayed(item) && !!item.startTime);
  };

  // More robust HTML stripper that also handles special entities
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';

    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      // Fallback for SSR: simple regex to remove HTML tags
      return html.replace(/<[^>]*>/g, '');
    }

    // Create a temporary DOM element to parse HTML and get text content
    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    // Get text content and replace multiple spaces/newlines with single space
    const text = tmp.textContent || tmp.innerText || '';
    return text.replace(/\s+/g, ' ').trim();
  };

  // Process orders into backlink items - FIXED DATA MAPPING
  useEffect(() => {
    const mappedBacklinks: BacklinkItem[] = orders.flatMap((order) =>
      order.items
        .filter((item) => item.variant?.product?.slug === "backlink")
        .map((item) => {
          const savedValues = inputValuesMap[item.id] || [];

          // Handle deadline - it might be text or null
          const deadlineValue = item.deadline || ""; // Ensure it's never undefined

          // delayed should already be a boolean from Keystone
          const delayedValue = !!item.delayed;

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
            siteurl:
              item.inputValues?.find((iv) => iv.field?.label === "Site URL")?.value || "",
            keyword:
              item.inputValues?.find((iv) => iv.field?.label === "Keyword")?.value || "",
            completionReport: item.completionReport || "",
            variant: item.variant,
            startTime: item.startTime || "", // Ensure it's never undefined
            deadline: deadlineValue,
            vipDeadline: item.vipDeadline || "",
            submittedValues: savedValues.map((sv: any) => ({
              id: sv.id,
              label: sv.label,
              value: sv.value,
            })),
            delayed: delayedValue,
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

  // Filter items - IMPROVED LOGIC
  const activeItems = useMemo(() =>
    backlinksState.filter(item => {
      // Don't show completed, cancelled, or out_of_time items in active
      if (["completed", "cancelled", "out_of_time"].includes(item.adminStatus || "")) {
        return false;
      }

      // Don't show delayed items in active tab
      if (isDelayed(item)) {
        return false;
      }

      // Show items that are either:
      // 1. in_progress (work has started)
      // 2. pending AND have submitted values (waiting for admin to start)
      return item.adminStatus === "in_progress" ||
        (item.adminStatus === "pending" && item.submittedValues && item.submittedValues.length > 0);
    }), [backlinksState]);

  const pendingItems = useMemo(() =>
    backlinksState.filter(item =>
      item.adminStatus === "pending" &&
      (!item.submittedValues || item.submittedValues.length === 0) &&
      !isDelayed(item) // Ensure pending items aren't delayed
    ), [backlinksState]);

  const delayedItems = useMemo(() =>
    backlinksState.filter(item => isDelayed(item)), [backlinksState]);

  const completedItems = useMemo(() =>
    backlinksState.filter(item => item.adminStatus === "completed"), [backlinksState]);

  const mainActiveItem = activeItems[0];

  // Auto-select tab based on content
  useEffect(() => {
    if (activeItems.length > 0) {
      setActiveTab('active');
    } else if (delayedItems.length > 0) {
      setActiveTab('delayed');
    } else if (pendingItems.length > 0) {
      setActiveTab('pending');
    } else if (completedItems.length > 0) {
      setActiveTab('completed');
    }
  }, [activeItems.length, pendingItems.length, completedItems.length, delayedItems.length]);

  // Status helpers
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "in_progress": return <Clock className="w-4 h-4 animate-pulse" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      case "out_of_time": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending": return "text-gray-600 bg-gray-100";
      case "in_progress": return "text-blue-600 bg-blue-50";
      case "completed": return "text-emerald-600 bg-emerald-50";
      case "cancelled": return "text-red-600 bg-red-50";
      case "out_of_time": return "text-amber-600 bg-amber-50";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "pending": return "در انتظار";
      case "in_progress": return "در حال انجام";
      case "completed": return "تکمیل شده";
      case "cancelled": return "لغو شده";
      case "out_of_time": return "تاخیر خورده";
      default: return "نامشخص";
    }
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

    const existingValues = await fetchValues(id);
    if (existingValues) {
      setValues(existingValues);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitValues();
      setBacklinksState((prev) =>
        prev.map((item) =>
          item.id === selectedOrderItemId
            ? {
              ...item,
              submittedValues:
                fields?.map((field) => ({
                  id: field.id,
                  label: field.label,
                  value: values[field.id] || "",
                })) ?? [],
            }
            : item
        )
      );
      setShowModal(false);
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

  // delayed item pop up
  useEffect(() => {
    if (delayedItems.length > 0 && !showDelayNotification) {
      const firstDelayed = delayedItems[0];
      if (firstDelayed) {
        setNotificationItem(firstDelayed);
        setShowDelayNotification(true);

        const timer = setTimeout(() => {
          setShowDelayNotification(false);
          setNotificationItem(null);
        }, 8000);

        return () => clearTimeout(timer);
      }
    }
  }, [delayedItems, showDelayNotification]);

  // Loading states
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ابتدا وارد شوید</h3>
            <p className="text-gray-600 text-sm">
              برای مشاهده سفارش‌های بک لینک، لطفاً ابتدا وارد حساب کاربری خود شوید.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center space-y-6">
          <div className="w-12 h-12 mx-auto border-3 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <div>
            <p className="text-gray-700 font-medium">در حال بارگذاری سفارش‌ها</p>
            <p className="text-gray-500 text-sm mt-1">لطفاً چند لحظه صبر کنید...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">خطا در بارگذاری</h3>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tab content components
  const ActiveTabContent = () => (
    <div className="space-y-8">
      {/* Main Active Order */}
      {mainActiveItem && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-7 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Content Section - Left */}
            <div className="flex-1 space-y-5">
              {/* Header with Status and Title */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                 
                  {isDelayed(mainActiveItem) && (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3" />
                      تاخیر خورده
                    </span>
                  )}
                  {isVIP && mainActiveItem.vipDeadline && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">
                        مهلت ویژه
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                  {mainActiveItem.productTitle}
                </h3>
              </div>

              {/* Details Grid - More compact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">ویژگی‌ها</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mainActiveItem.attributes.map((attr, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-medium"
                        >
                          {attr.value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">تاریخ خرید</p>
                    <p className="text-gray-900 font-medium text-sm">
                      {new Date(mainActiveItem.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-medium text-gray-500 mb-1">اطلاعات ثبت شده</p>
                  {mainActiveItem.submittedValues?.map((val) => (
                    <div key={val.id} className="flex items-center justify-between py-1.5 group hover:bg-gray-50 rounded px-1.5 -mx-1.5 transition-colors">
                      <span className="text-sm text-gray-600">{val.label}:</span>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                          {val.value}
                        </span>
                        <button
                          onClick={() => copyToClipboard(val.value, val.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded"
                        >
                          {copiedId === val.id ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Progress Bar Section - Right - Reduced spacing */}
            <div className="lg:w-auto w-full">
              <div className="flex flex-col items-center gap-3">
                {shouldShowProgressBar(mainActiveItem) ? (
                  <>
                    <div className="relative">
                      <div className="scale-90 lg:scale-100 transform-gpu">
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
                        <div className="pt-4 flex justify-center">
                          <button
                            onClick={() => handleItemClick(mainActiveItem.id)}
                            className="px-4 py-2  text-gray-600 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-1.5"
                          >
                            مشاهده جزئیات 
                            <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* VIP Deadline Badge - Integrated into progress bar */}
                      {isVIP && mainActiveItem.vipDeadline && mainActiveItem.vipDeadline.trim() !== "" && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white border border-emerald-200 rounded-full px-2.5 py-1 shadow-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-700 whitespace-nowrap">
                              {new Date(mainActiveItem.vipDeadline).toLocaleDateString("fa-IR")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delay Warning - More compact */}
                    {isDelayed(mainActiveItem) && (
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg max-w-[180px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <div className="text-right">
                            <p className="text-xs font-medium text-amber-700">تاخیر در انجام سفارش</p>
                            <p className="text-xs text-amber-600">در حال پیگیری</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // More compact waiting state
                  <div className="w-28 h-28 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <Clock className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-600 block">در انتظار شروع</span>
                      <span className="text-xs text-gray-500">به زودی شروع می‌شود</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeItems.length > 1 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-xl">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">دیگر سفارش‌های فعال</h3>
              </div>
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                {activeItems.length - 1}
              </span>
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeItems.slice(1).map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => handleItemClick(item.id)}
                onMouseEnter={(e) => e.currentTarget.classList.add('ring-1', 'ring-blue-100')}
                onMouseLeave={(e) => e.currentTarget.classList.remove('ring-1', 'ring-blue-100')}
              >
                {/* Interactive gradient overlay */}
                <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" />
                {/* Purchase Date & Quick Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{(item.createdAt)}</span>
                  </div>
                </div>

                {/* Header with Status and Progress */}
                <div className="flex items-start justify-between mb-5">
                  {/* Status Badge with Hover Effect */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(item.adminStatus)} transition-all group-hover:scale-105 cursor-default`}
                    title={(item.adminStatus)}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
                    {getStatusIcon(item.adminStatus)}
                    <span className="leading-none">{getStatusText(item.adminStatus)}</span>
                  </div>

                  {/* Progress Visual with Hover Preview */}
                  {shouldShowProgressBar(item) ? (
                    <div className="relative group/progress">
                      <CircularProgressWithTimesmall
                        startTime={item.startTime}
                        deadline={item.deadline || undefined}
                        completionTime={item.completionTime}
                        delayed={isDelayed(item)}
                        canceled={item.adminStatus === "cancelled"}
                        productImage={item.imageUrl}
                        videoUrl={item.videoUrl}
                        productTitle={item.productTitle}
                      />
                      {/* Progress Tooltip */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/progress:opacity-100 transition-opacity whitespace-nowrap z-10">
                        پیشرفت سفارش
                      </div>
                    </div>
                  ) : (
                    <div className="w-11 h-11 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-300 group-hover:rotate-12">
                      <Clock className="w-4.5 h-4.5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                  )}
                </div>

                {/* Product Title with Expand on Hover */}
                <div className="relative mb-4">
                  <h4
                    className="font-semibold text-gray-900 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-300"
                    title={item.productTitle}
                  >
                    {item.productTitle}
                  </h4>
                  {/* Show full title on hover indicator */}
                  <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white to-transparent w-8 h-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Interactive Attributes Chips */}
                {item.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.attributes.slice(0, 2).map((attr, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 hover:scale-105 transition-all cursor-default"
                      >
                        {attr.value}
                      </span>
                    ))}
                    {item.attributes.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Show all attributes
                        }}
                        className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-100 hover:text-gray-700 transition-all flex items-center gap-0.5"
                      >
                        +{item.attributes.length - 2}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Submitted Values with Copy Functionality */}
                <div className="space-y-2.5 mb-4">
                  {item.submittedValues?.slice(0, 2).map((val) => (
                    <div
                      key={val.id}
                      className="flex items-center justify-between group/value hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(val.value);
                        // Show toast notification
                      }}
                    >
                      <span className="text-xs text-gray-500 truncate flex items-center gap-1">
                        {val.label}
                        <svg className="w-3 h-3 opacity-0 group-hover/value:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <span className="text-xs text-gray-900 font-medium truncate max-w-[60%] group-hover/value:text-blue-600 transition-colors">
                        {val.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delay Indicator with Action Button */}
                {isDelayed(item) && (
                  <div className="pt-4 mt-4 border-t border-amber-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-amber-600 text-xs font-medium">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span>تأخیر در اجرا</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Contact support about delay
                        }}
                        className="text-xs text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                      >
                        پیگیری
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="pt-4 mt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // View details
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      جزئیات کامل
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="text-xs text-gray-400">
                      کد: {item.id.slice(-6)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const PendingTabContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">نیاز به ثبت اطلاعات</h2>
          <p className="text-sm text-gray-500 mt-1">لطفاً اطلاعات سفارش‌های زیر را تکمیل کنید</p>
        </div>
        <span className="text-sm text-gray-500">{pendingItems.length} سفارش</span>
      </div>

      {pendingItems.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">همه سفارش‌ها ثبت شدند</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            تمام سفارش‌های در انتظار، اطلاعاتشان ثبت شده است.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-white to-blue-50 rounded-xl border border-blue-200 p-6 hover:border-blue-300 transition"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Edit2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تاریخ خرید</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                  ثبت نشده
                </span>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">{item.productTitle}</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {item.attributes.map((attr, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                  >
                    {attr.value}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleItemClick(item.id)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                ثبت اطلاعات سفارش
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const DelayedTabContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">سفارش‌های تاخیر خورده</h2>
          <p className="text-sm text-gray-500 mt-1">این سفارش‌ها از مهلت تعیین شده گذشته‌اند</p>
        </div>
        <span className="text-sm text-gray-500">{delayedItems.length} سفارش</span>
      </div>

      {delayedItems.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">سفارش تاخیر خورده‌ای ندارید</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            همه سفارش‌های شما طبق برنامه در حال انجام هستند.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {delayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-white to-red-50 rounded-xl border border-red-200 p-6 hover:border-red-300 transition cursor-pointer"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تاریخ خرید</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                  تاخیر خورده
                </span>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">{item.productTitle}</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.attributes.map((attr, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-red-50 text-red-700 rounded text-xs font-medium"
                  >
                    {attr.value}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-red-200">
                <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  <span>از مهلت گذشته</span>
                </div>
                <p className="text-xs text-gray-600">
                  تیم پشتیبانی در حال پیگیری این سفارش است.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const CompletedTabContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">سفارش‌های تکمیل شده</h2>
          <p className="text-sm text-gray-500 mt-1">سفارش‌هایی که با موفقیت انجام شده‌اند</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{completedItems.length} سفارش</span>
          <button
            onClick={() => {
              setHistoryModalOpen(true);
              setHistoryFilter("completed");
            }}
            className="text-sm text-gray-600 hover:text-gray-900 transition font-medium flex items-center gap-2"
          >
            مشاهده همه
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>

      {completedItems.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">سفارش تکمیل شده‌ای ندارید</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            سفارش‌های تکمیل شده در این بخش نمایش داده می‌شوند.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedItems.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border p-5 hover:border-emerald-300 transition cursor-pointer group"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-emerald-600">تکمیل شده</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(item.completionTime || item.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">{item.productTitle}</h4>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.attributes.map((attr, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {attr.value}
                  </span>
                ))}
              </div>

              {item.completionReport && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">گزارش تکمیل:</p>
                  <p className="text-sm text-gray-700 line-clamp-2">
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
    <div className="h-full overflow-auto bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm ">
        <div className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl text-gray-700">مدیریت سفارش‌های بک لینک</h1>
            </div>
            <div className="flex items-center gap-3">
              {isVIP && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">کاربر ویژه</span>
                </div>
              )}
              <button
                onClick={() => setHistoryModalOpen(true)}
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
        <div className="mb-8">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'active'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${activeItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={activeItems.length === 0}
            >
              <PlayCircle className="w-4 h-4" />
              در حال اجرا
              {activeItems.length > 0 && (
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  {activeItems.length}
                </span>
              )}
            </button>

            {/* Pending Tab - Always shown */}
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'pending'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${pendingItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={pendingItems.length === 0}
            >
              <Edit2 className="w-4 h-4" />
              نیاز به ثبت
              {pendingItems.length > 0 && (
                <span className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                  {pendingItems.length}
                </span>
              )}
            </button>

            {/* Delayed Tab - Always shown */}
            <button
              onClick={() => setActiveTab('delayed')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'delayed'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${delayedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={delayedItems.length === 0}
            >
              <AlertOctagon className="w-4 h-4" />
              تاخیر خورده
              {delayedItems.length > 0 && (
                <span className="text-xs bg-red-100 px-2 py-0.5 rounded-full">
                  {delayedItems.length}
                </span>
              )}
            </button>

            {/* Completed Tab - Always shown */}
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'completed'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${completedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={completedItems.length === 0}
            >
              <CheckCircle className="w-4 h-4" />
              تکمیل شده
              {completedItems.length > 0 && (
                <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded-full">
                  {completedItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="">
          {activeTab === 'active' && <ActiveTabContent />}
          {activeTab === 'pending' && <PendingTabContent />}
          {activeTab === 'delayed' && <DelayedTabContent />}
          {activeTab === 'completed' && <CompletedTabContent />}
        </div>

        {/* Empty State */}
        {backlinksState.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg  text-gray-900 mb-2">سفارشی ثبت نشده</p>
          </div>
        )}
      </div>

      {/* Completed Order Modal - Same as before */}
      {completedOrderId && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCompletedOrderId(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="p-8">
                {/* ... (same completed modal content) ... */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal - FIXED FILTERING */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setHistoryModalOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">تاریخچه سفارش‌های بک لینک</h3>
                    <p className="text-sm text-gray-500 mt-2">تمام سفارش‌های گذشته شما</p>
                  </div>
                  <button
                    onClick={() => setHistoryModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  {["all", "completed", "cancelled", "out_of_time"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setHistoryFilter(filter as any)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${historyFilter === filter
                        ? "bg-[#1d546b] text-white cursor-pointer"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {filter === "all" ? "همه" :
                        filter === "completed" ? "تکمیل شده" :
                          filter === "cancelled" ? "لغو شده" :
                            "تاخیر خورده"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {filteredHistoryItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">سفارشی در این دسته‌بندی یافت نشد</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHistoryItems.map((item) => (<div
                      key={item.id}
                      className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition cursor-pointer group"
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.adminStatus === "completed"
                            ? "bg-emerald-100"
                            : item.adminStatus === "cancelled"
                              ? "bg-red-100"
                              : item.adminStatus === "out_of_time"
                                ? "bg-amber-100"
                                : "bg-blue-100"
                            }`}>
                            {item.adminStatus === "completed" ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            ) : item.adminStatus === "cancelled" ? (
                              <XCircle className="w-5 h-5 text-red-600" />
                            ) : item.adminStatus === "out_of_time" ? (
                              <AlertTriangle className="w-5 h-5 text-amber-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.productTitle}</h4>
                            <p className="text-xs text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded text-xs font-medium ${item.adminStatus === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.adminStatus === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : item.adminStatus === "out_of_time"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                          {getStatusText(item.adminStatus)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.attributes.map((attr, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white text-gray-700 rounded text-xs"
                          >
                            {attr.value}
                          </span>
                        ))}
                      </div>
                      {item.completionReport && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {stripHtmlTags(item.completionReport)}
                        </p>
                      )}
                    </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <Edit2 className="w-6 h-6 text-blue-600" />
                      </div>
                      {isVIP && (
                        <Crown className="w-5 h-5 text-amber-500 absolute -top-2 -right-2" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">ثبت اطلاعات سفارش</h3>
                      <p className="text-sm text-gray-500 mt-1">{selectedItem.productTitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {fields?.map((field) => (
                    <div key={field.id}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label}
                          {field.required && <span className="text-red-500 mr-1">*</span>}
                        </label>
                        {/* VIP Deadline Selector */}
                        {isVIP && field.label === "Site URL" && (
                          <div className="relative" ref={calendarRef}>
                            <button
                              type="button"
                              onClick={() => setOpenCalendarId(openCalendarId === selectedItem.id ? null : selectedItem.id)}
                              disabled={deadlineLoading}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg text-sm font-medium text-amber-700 hover:border-amber-300 transition disabled:opacity-50"
                            >
                              <Clock className="w-4 h-4" />
                              {selectedItem.vipDeadline
                                ? `مهلت: ${new Date(selectedItem.vipDeadline).toLocaleDateString("fa-IR")}`
                                : "تعیین مهلت ویژه"}
                            </button>

                            {openCalendarId === selectedItem.id && (
                              <div className="absolute top-full left-0 mt-2 z-50 bg-white border shadow-xl rounded-xl p-4">
                                <DatePicker
                                  calendar={persian}
                                  locale={persian_fa}
                                  value={
                                    selectedDate[selectedItem.id] ||
                                    (selectedItem.vipDeadline
                                      ? new Date(selectedItem.vipDeadline)
                                      : null)
                                  }
                                  onChange={(date) => {
                                    if (date) {
                                      setSelectedDate(prev => ({
                                        ...prev,
                                        [selectedItem.id]: date.toDate()
                                      }));
                                    }
                                  }}
                                  plugins={[<TimePicker position="bottom" />]}
                                />
                                <div className="flex gap-2 mt-4">
                                  <button
                                    onClick={() => {
                                      const date = selectedDate[selectedItem.id];
                                      if (date) {
                                        handleUpdateVipDeadline(selectedItem.id, date.toISOString());
                                        setOpenCalendarId(null);
                                      }
                                    }}
                                    className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50"
                                    disabled={!selectedDate[selectedItem.id] || deadlineLoading}
                                  >
                                    {deadlineLoading ? "..." : "تایید"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (!deadlineLoading) {
                                        handleUpdateVipDeadline(selectedItem.id, "");
                                        setSelectedDate(prev => ({ ...prev, [selectedItem.id]: null }));
                                        setOpenCalendarId(null);
                                      }
                                    }}
                                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
                                    disabled={deadlineLoading}
                                  >
                                    حذف
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <input
                        type={field.fieldType === "number" ? "number" : "text"}
                        name={field.id}
                        placeholder={field.placeholder || field.label}
                        value={values[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                        required={field.required}
                        disabled={!canEdit}
                      />
                    </div>
                  ))}

                  {!canEdit ? (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-medium text-gray-900">این سفارش قبلاً ثبت شده است</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        اطلاعات این سفارش قبلاً ثبت شده و دیگر قابل تغییر نیست. برای مشاهده جزئیات می‌توانید به صفحه تاریخچه مراجعه کنید.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-3">توجه مهم</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                          <span>اطلاعات وارد شده پس از تایید، قابل ویرایش نیستند.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                          <span>از صحت اطلاعات قبل از ارسال مطمئن شوید.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                          <span>پس از ثبت، وضعیت سفارش برای بررسی ارسال می‌شود.</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {deadlineError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-red-700">{deadlineError}</p>
                        <button
                          onClick={resetError}
                          className="text-red-400 hover:text-red-600 transition"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {inputError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-700">{inputError}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!canEdit || inputLoading}
                    className={`w-full py-4 rounded-xl font-semibold transition ${canEdit
                      ? "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    {inputLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>در حال ثبت اطلاعات...</span>
                      </div>
                    ) : !canEdit ? (
                      "ثبت شده"
                    ) : (
                      "ثبت اطلاعات سفارش"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacklinkPage;