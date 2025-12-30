"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useOrderInput } from "@/hooks/useOrderInput";
import { useUserOrders } from "@/hooks/useUserOrders";
import { useAuth } from "@/contexts/AuthContext";
import SimpleProgress from "@/components/dashboard/AnimatedProgress";
import CircularProgressWithTimesmall from "@/components/dashboard/AnimatedProgresssmall";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Edit2,
  ChevronLeft,
  Filter,
  Calendar,
  Package,
  Link as LinkIcon,
  Search
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

export interface ContentItem {
  id: string;
  slug: string;
  productTitle: string;
  attributes: { name: string; value: string }[];
  quantity: number;
  price: number;
  orderId: string;
  status: string;
  adminStatus?: string;
  delayed?: string;
  completionTime?: string;
  deadline?: string;
  createdAt: string;
  startTime: string;
  siteurl?: string;
  keyword: string;
  submittedValues?: { id: string; label: string; value: string }[];
  completionReport?: string;
  variant: Variant;
}

const ContentPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { orders, loading, error } = useUserOrders();
  const [inputValuesMap, setInputValuesMap] = useState<Record<string, any[]>>({});
  const [contentsState, setContentsState] = useState<ContentItem[]>([]);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<"all" | "completed" | "cancelled">("all");

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

  // Process orders into content items
  useEffect(() => {
    const mappedContent: ContentItem[] = orders.flatMap((order) =>
      order.items
        .filter((item) => item.variant?.product?.slug === "content")
        .map((item) => {
          const savedValues = inputValuesMap[item.id] || [];
          return {
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
              item.inputValues?.find((iv) => iv.field?.label === "Site URL")?.value || "",
            keyword:
              item.inputValues?.find((iv) => iv.field?.label === "Keyword")?.value || "",
            completionReport: item.completionReport || "",
            variant: item.variant,
            startTime: item.startTime,
            deadline: item.deadline,
            submittedValues: savedValues.map((sv: any) => ({
              id: sv.id,
              label: sv.label,
              value: sv.value,
            })),
          };
        })
    );
    setContentsState(mappedContent);
  }, [orders, inputValuesMap]);

  // Fetch input values
  useEffect(() => {
    const fetchAllValues = async () => {
      const map: Record<string, any[]> = {};
      for (const order of orders) {
        for (const item of order.items) {
          if (item.variant?.product?.slug === "content") {
            const savedValues = await fetchValues(item.id);
            map[item.id] = savedValues || [];
          }
        }
      }
      setInputValuesMap(map);
    };
    fetchAllValues();
  }, [orders]);

  const selectedItem = useMemo(() => 
    contentsState.find((item) => item.id === selectedOrderItemId),
    [contentsState, selectedOrderItemId]
  );

  const canEdit = selectedItem?.adminStatus === "pending";

  // Filter items
  const activeItems = useMemo(() => 
    contentsState.filter(item => 
      item.adminStatus === "in_progress" || item.adminStatus === "out_of_time"
    ), [contentsState]);

  const pendingItems = useMemo(() => 
    contentsState.filter(item => 
      item.adminStatus === "pending" && 
      (!item.submittedValues || item.submittedValues.length === 0)
    ), [contentsState]);

  const completedItems = useMemo(() => 
    contentsState.filter(item => item.adminStatus === "completed"), [contentsState]);

  const mainActiveItem = activeItems[0];

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
      case "pending": return "text-gray-500 bg-gray-100";
      case "in_progress": return "text-blue-600 bg-blue-50";
      case "completed": return "text-green-600 bg-green-50";
      case "cancelled": return "text-red-600 bg-red-50";
      case "out_of_time": return "text-orange-600 bg-orange-50";
      default: return "text-gray-500 bg-gray-100";
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
    const item = contentsState.find((i) => i.id === id);
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
      setContentsState((prev) =>
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

  // Loading states
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">لطفاً ابتدا وارد شوید</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-gray-800">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl text-gray-500 mt-1">مدیریت سفارش‌های محتوا</p>
            </div>
            <button
              onClick={() => setHistoryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              <Calendar className="w-4 h-4" />
              تاریخچه
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Active Orders */}
        {activeItems.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">در حال اجرا</h2>
              <span className="text-sm text-gray-500">{activeItems.length} سفارش</span>
            </div>

            {/* Main Active Order */}
            {mainActiveItem && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border p-6 mb-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(mainActiveItem.adminStatus)}`}>
                        {getStatusIcon(mainActiveItem.adminStatus)}
                        <span>{getStatusText(mainActiveItem.adminStatus)}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(mainActiveItem.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {mainActiveItem.productTitle}
                    </h3>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">ویژگی‌ها</p>
                        <p className="text-gray-900">
                          {mainActiveItem.attributes.map((attr) => attr.value).join(" • ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">مقدار</p>
                        <p className="text-gray-900">{mainActiveItem.quantity} عدد</p>
                      </div>
                    </div>

                  </div>

                  <div className="ml-8 flex flex-col items-center">
                    <SimpleProgress
                      startTime={mainActiveItem.startTime}
                      deadline={mainActiveItem.deadline || ""}
                      completionTime={mainActiveItem.completionTime}
                      canceled={mainActiveItem.adminStatus === "cancelled"}
                    />
                    <button
                      onClick={() => handleItemClick(mainActiveItem.id)}
                      className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                    >
                      مشاهده جزئیات
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other Active Orders Grid */}
            {activeItems.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeItems.slice(1).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border p-4 hover:border-gray-400 transition cursor-pointer"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${getStatusColor(item.adminStatus)}`}>
                        {getStatusIcon(item.adminStatus)}
                        <span>{getStatusText(item.adminStatus)}</span>
                      </div>
                      <CircularProgressWithTimesmall
                        startTime={item.startTime}
                        deadline={item.deadline || undefined}
                        completionTime={item.completionTime}
                        delayed={item.adminStatus === "out_of_time"}
                        canceled={item.adminStatus === "cancelled"}
                      />
                    </div>

                    <h4 className="font-medium text-gray-900 mb-2 truncate">{item.productTitle}</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      {item.attributes.map((attr) => attr.value).join(" • ")}
                    </p>

                    {item.submittedValues?.slice(0, 2).map((val) => (
                      <div key={val.id} className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">{val.label}:</span>
                        <span className="text-gray-900 font-medium truncate max-w-[120px]">
                          {val.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending Orders */}
        {pendingItems.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">نیاز به ثبت اطلاعات</h2>
              <span className="text-sm text-gray-500">{pendingItems.length} سفارش</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-200 p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Edit2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">تاریخ خرید</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      در انتظار
                    </span>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">{item.productTitle}</h4>
                  <p className="text-sm text-gray-600 mb-6">
                    {item.attributes.map((attr) => attr.value).join(" • ")}
                  </p>

                  <button
                    onClick={() => handleItemClick(item.id)}
                    className="w-full py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium"
                  >
                    ثبت اطلاعات
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Orders Preview */}
        {completedItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">تکمیل شده‌ها</h2>
              <button
                onClick={() => {
                  setHistoryModalOpen(true);
                  setHistoryFilter("completed");
                }}
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                مشاهده همه
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border p-4 hover:border-gray-400 transition cursor-pointer"
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">تکمیل شده</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.completionTime || item.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-2">{item.productTitle}</h4>
                  <p className="text-sm text-gray-500">
                    {item.attributes.map((attr) => attr.value).join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {contentsState.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">سفارش محتوایی ندارید</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              هنوز هیچ سفارش محتوایی ثبت نکرده‌اید. سفارش جدید ایجاد کنید یا منتظر بمانید.
            </p>
          </div>
        )}
      </div>

      {/* Completed Order Modal */}
      {completedOrderId && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCompletedOrderId(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">سفارش تکمیل شده</h3>
                      <p className="text-sm text-gray-500">با موفقیت انجام شد</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCompletedOrderId(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">جزئیات سفارش</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">محصول:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {contentsState.find(item => item.id === completedOrderId)?.productTitle}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">تاریخ تکمیل:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(
                            contentsState.find(item => item.id === completedOrderId)?.completionTime || ""
                          ).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">گزارش تکمیل</h4>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-sm text-gray-700 space-y-2">
                        {contentsState
                          .find(item => item.id === completedOrderId)
                          ?.completionReport?.split("\n")
                          .map((line, idx) =>
                            line.startsWith("http") ? (
                              <a
                                key={idx}
                                href={line}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 break-all flex items-center gap-1"
                              >
                                <LinkIcon className="w-3 h-3" />
                                {line}
                              </a>
                            ) : (
                              <p key={idx}>{line}</p>
                            )
                          )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCompletedOrderId(null)}
                    className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    بستن
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setHistoryModalOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">تاریخچه سفارش‌ها</h3>
                    <p className="text-sm text-gray-500 mt-1">تمام سفارش‌های گذشته شما</p>
                  </div>
                  <button
                    onClick={() => setHistoryModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  {["all", "completed", "cancelled"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setHistoryFilter(filter as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        historyFilter === filter
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter === "all" ? "همه" : filter === "completed" ? "تکمیل شده" : "لغو شده"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentsState
                    .filter((item) =>
                      historyFilter === "all" ? true : item.adminStatus === historyFilter
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition cursor-pointer"
                        onClick={() => handleItemClick(item.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              item.adminStatus === "completed" ? "bg-green-100" : "bg-red-100"
                            }`}>
                              {item.adminStatus === "completed" ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{item.productTitle}</h4>
                              <p className="text-xs text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.adminStatus === "completed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {getStatusText(item.adminStatus)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.attributes.map((attr) => attr.value).join(" • ")}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">ثبت اطلاعات</h3>
                    <p className="text-sm text-gray-500 mt-1">{selectedItem.productTitle}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {fields?.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 mr-1">*</span>}
                      </label>
                      <input
                        type={field.fieldType === "number" ? "number" : "text"}
                        name={field.id}
                        placeholder={field.placeholder || field.label}
                        value={values[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition"
                        required={field.required}
                        disabled={!canEdit}
                      />
                    </div>
                  ))}

                  {!canEdit ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        این سفارش قبلاً ثبت شده و دیگر قابل تغییر نیست.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">توجه:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• اطلاعات وارد شده پس از تایید، قابل ویرایش نیستند.</li>
                        <li>• از صحت اطلاعات قبل از ارسال مطمئن شوید.</li>
                        <li>• پس از ثبت، وضعیت سفارش برای بررسی ارسال می‌شود.</li>
                      </ul>
                    </div>
                  )}

                  {inputError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-700">{inputError}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!canEdit || inputLoading}
                    className={`w-full py-3.5 rounded-lg font-medium transition ${
                      canEdit
                        ? "bg-gray-900 hover:bg-gray-800 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {inputLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>در حال ثبت...</span>
                      </div>
                    ) : !canEdit ? (
                      "ثبت شده"
                    ) : (
                      "ثبت اطلاعات"
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

export default ContentPage;