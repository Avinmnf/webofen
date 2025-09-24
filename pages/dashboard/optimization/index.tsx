"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useOrderInput } from "@/hooks/useOrderInput";
import { useUserOrders } from "@/hooks/useUserOrders";
import { useAuth } from "@/contexts/AuthContext";
import SimpleProgress from "@/components/dashboard/AnimatedProgress";
import CircularProgressWithTimesmall from "@/components/dashboard/AnimatedProgresssmall";

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

export interface OptimizationItem {
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

const statusProgressMap: Record<string, number> = {
  pending: 0,
  in_progress: 50,
  completed: 100,
  out_of_time: 100,
};

const OptimizationPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { orders, loading, error } = useUserOrders();
  const [inputValuesMap, setInputValuesMap] = useState<Record<string, any[]>>(
    {}
  );
  // Map orders to Optimization
  useEffect(() => {
    const mappedOptimization: OptimizationItem[] = orders.flatMap((order) =>
      order.items
        .filter((item) => item.variant?.product?.slug === "optimization")
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
              item.inputValues?.find((iv) => iv.field?.label === "Site URL")
                ?.value || "",
            keyword:
              item.inputValues?.find((iv) => iv.field?.label === "Keyword")
                ?.value || "",
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

    setOptimizationsState(mappedOptimization);
  }, [orders, inputValuesMap]);

  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  const [OptimizationsState, setOptimizationsState] = useState<OptimizationItem[]>([]);

  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<
    "all" | "completed" | "cancelled"
  >("all");
  const [showNotification, setShowNotification] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"completed" | "cancelled" | null>(
    null
  );

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

  const selectedItem = OptimizationsState.find(
    (item) => item.id === selectedOrderItemId
  );
  const canEdit = selectedItem?.adminStatus === "pending";
  useEffect(() => {
    const fetchAllValues = async () => {
      const map: Record<string, any[]> = {};
      for (const order of orders) {
        for (const item of order.items) {
          if (item.variant?.product?.slug === "optimization") {
            const savedValues = await fetchValues(item.id);
            map[item.id] = savedValues || [];
          }
        }
      }
      setInputValuesMap(map);
    };

    fetchAllValues();
  }, [orders]);

  // for opening modal
  const handleClick = async (id: string) => {
    const item = OptimizationsState.find((i) => i.id === id);
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

  const selectedCompletedOrder = OptimizationsState.find(
    (item) => item.id === completedOrderId
  );
  const handleSubmit = async () => {
    try {
      await submitValues();
      setOptimizationsState((prev) =>
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

  const getProgress = (item: OptimizationItem) =>
    statusProgressMap[item.adminStatus ?? "pending"] ?? 0;

  const isDelayed = (item: OptimizationItem) => {
    if (item.adminStatus === "out_of_time") return true;
    if (!item.delayed) return false;

    const delayedStr = item.delayed.toLowerCase().trim();
    if (delayedStr === "true") return true;
    if (delayedStr === "false") return false;

    const delayedDate = new Date(delayedStr);
    return !isNaN(delayedDate.getTime()) && delayedDate < new Date();
  };

  useEffect(() => {
    const delayedItems = OptimizationsState.filter(
      (item) => item.adminStatus === "out_of_time"
    );
    if (delayedItems.length > 0) {
      setShowNotification(true);
    }
  }, [OptimizationsState]);

  // Filtering for different states
  const inProgressItems = OptimizationsState.filter(
    (item) => item.adminStatus === "in_progress"
  );
  const delayedItems = OptimizationsState.filter(
    (item) => item.adminStatus === "out_of_time"
  );
  const canceledItems = OptimizationsState.filter(
    (item) => item.adminStatus === "cancelled"
  );
  const normalItems = OptimizationsState.filter(
    (item) =>
      item.adminStatus !== "in_progress" &&
      item.adminStatus !== "out_of_time" &&
      item.adminStatus !== "cancelled"
  );

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const recentOptimizations = OptimizationsState.filter(
    (item) => new Date(item.createdAt) >= oneMonthAgo
  );
  const bigInProgressItem = inProgressItems[0];
  const otherInProgressItems = inProgressItems.slice(1);
  const pendingOptimizations = OptimizationsState.find((item) => item.status === "0");
  const historyOrders = OptimizationsState.filter(
    (item) =>
      item.adminStatus === "completed" || new Date(item.createdAt) < oneMonthAgo
  );
  useEffect(() => {
    setOptimizationsState((prev) =>
      prev.map((item) => ({
        ...item,
        submittedValues: inputValuesMap[item.id] || [],
      }))
    );
  }, [inputValuesMap]);

  console.log(bigInProgressItem);
  console.log("StartTime:", bigInProgressItem?.startTime);
  console.log("Deadline:", bigInProgressItem?.deadline);
  console.log("bigitem:", bigInProgressItem?.submittedValues);
  if (!isLoggedIn)
    return (
      <p className="text-center py-10">ابتدا باید وارد حساب کاربری خود شوید</p>
    );
  if (loading) return <p className="text-center py-10">در حال بارگیری...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <>
      <div className="relative w-full">
        <div className="w-full flex justify-end">
          <button
            onClick={() => setHistoryModalOpen(true)}
            className="bg-[#f7f8fc] text-gray-700 font-semibold p-2 py-4 text-sm rounded-t-xl w-1/3 cursor-pointer"
          >
            تاریخچه
          </button>
        </div>
        <div className="flex relative flex-col items-center text-gray-700 bg-[#f7f8fc] p-4 rounded-b-xl rounded-tr-xl space-y-8">
          {/* big pill */}
          {bigInProgressItem && (
            <>
            <div className="flex items-center relative flex-row-reverse w-full justify-between p-4">
              {bigInProgressItem && (
                <SimpleProgress
                  startTime={bigInProgressItem.startTime}
                  deadline={bigInProgressItem.deadline || ""}
                  completionTime={bigInProgressItem.completionTime}
                  canceled={bigInProgressItem.adminStatus === "cancelled"}
                />
              )}

              <button
                onClick={() => handleClick(bigInProgressItem.id)}
                className="absolute left-14 w-20 h-16 flex items-center justify-center"
              >
                <div className="relative w-full h-32 flex justify-center items-center overflow-hidden">
                  <Image
                    width={220}
                    height={220}
                    alt="Backlink"
                    src={"/dashboard/security.png"}
                    className="object-contain rotate-30"
                  />
                </div>
              </button>
              <div className=" mt-2 text-sm w-1/3">
                <div className="flex gap-2 items-center">
                  <p className="text-gray-600 font-semibold">تاریخ خرید: </p>
                  <p className="text-gray-600">
                    {new Date(bigInProgressItem.createdAt).toLocaleDateString(
                      "fa-IR"
                    )}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-gray-600 font-semibold">تعداد:</p>
                  <p className="text-gray-700">
                    {bigInProgressItem.attributes
                      .map((attr) => attr.value)
                      .join(" / ")}
                  </p>
                </div>
                <div className="flex gap-2 items-center mt-1">
                  <div className="mt-1 text-sm">
                    {bigInProgressItem.submittedValues?.length ? (
                      <div className="mt-2 text-sm">
                        {bigInProgressItem.submittedValues.map((bigitem) => (
                          <div
                            key={bigitem.id}
                            className="flex gap-1 items-center"
                          >
                            <span className="font-semibold text-gray-600">
                              {bigitem.label}:
                            </span>
                            <span className="text-gray-700">
                              {bigitem.value || "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 mt-2">اطلاعات وارد نشده</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          <div className="h-1 w-full bg-gray-200 rounded-2xl"></div>
          </>
          )}
          {/* Small pills */}
          <div className="flex flex-col w-full gap-8">
            {/* Active/Ongoing Pills */}
            {[
              ...otherInProgressItems,
              ...delayedItems,
              ...canceledItems,
              ...normalItems,
            ].filter(
              (item) =>
                (!item.submittedValues || item.submittedValues.length === 0) &&
                item.adminStatus !== "completed" &&
                item.adminStatus !== "canceled" &&
                item.adminStatus !== "in_progress" &&
                item.adminStatus !== "out_of_time"
            ).length > 0 && (
              <div>
                <h3 className="text-gray-700 text-lg font-semibold mb-4">
                  قرص های مصرف نشده
                </h3>
                <div className="flex flex-wrap justify-start bg-gray-200 rounded-xl p-6 gap-6 w-full">
                  {[
                    ...otherInProgressItems,
                    ...delayedItems,
                    ...canceledItems,
                    ...normalItems,
                  ]
                    .filter(
                      (item) =>
                        (!item.submittedValues ||
                          item.submittedValues.length === 0) &&
                        item.adminStatus !== "completed" &&
                        item.adminStatus !== "cancelled" &&
                        item.adminStatus !== "in_progress" &&
                        item.adminStatus !== "out_of_time"
                    )
                    .map((item) => {
                      const variantName = item.attributes
                        .map((a) => a.value)
                        .join(" / ");
                      const delayed = isDelayed(item);
                      const canceled = item.adminStatus === "cancelled";

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col items-center relative scale-90 "
                        >
                          <CircularProgressWithTimesmall
                            startTime={item.startTime}
                            deadline={item.deadline || undefined}
                            completionTime={item.completionTime}
                            delayed={delayed}
                            canceled={canceled}
                          />
                          <button
                            onClick={() => handleClick(item.id)}
                            className="absolute top-4 w-12 h-12 flex items-center justify-center cursor-pointer"
                          >
                            <div className="relative w-full h-16 flex justify-center items-center overflow-hidden">
                              <Image
                                width={220}
                                height={220}
                                alt="Backlink"
                                src={"/dashboard/security.png"}
                                className="object-contain rotate-30"
                              />
                            </div>
                          </button>
                          <div className="text-center mt-2 text-sm">
                            <p className="text-gray-600">خرید:</p>
                            <p className="text-gray-600">
                              {new Date(item.createdAt).toLocaleDateString(
                                "fa-IR"
                              )}
                            </p>
                            <p className="text-gray-600 mt-1">تعداد:</p>
                            <p className="text-gray-700 font-semibold">
                              {variantName}
                            </p>

                            {/* Show submitted values for active pills */}
                            {item?.submittedValues?.length ? (
                              <div className="mt-1 text-xs">
                                {item.submittedValues.map((input) => (
                                  <div
                                    key={input.id}
                                    className="flex gap-1 items-center"
                                  >
                                    <span className="font-semibold text-gray-600">
                                      {input.label}:
                                    </span>
                                    <span className="text-gray-700">
                                      {input.value || "—"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {completedOrderId && selectedCompletedOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-99 animate-fadeIn ">
          <div className="bg-white w-[90%] max-w-lg rounded-3xl shadow-2xl p-6 relative">
            <button
              onClick={() => setCompletedOrderId(null)}
              className="absolute top-4 right-4 text-2xl font-bold hover:text-red-500"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
              سفارش تکمیل‌شده
            </h2>

            <div className="mb-4">
              <p className="text-gray-700">
                <span className="font-semibold">محصول:</span>{" "}
                {selectedCompletedOrder.productTitle}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">تاریخ خرید:</span>{" "}
                {new Date(selectedCompletedOrder.createdAt).toLocaleDateString(
                  "fa-IR"
                )}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">تاریخ تکمیل:</span>{" "}
                {selectedCompletedOrder.completionTime
                  ? new Date(
                      selectedCompletedOrder.completionTime
                    ).toLocaleDateString("fa-IR")
                  : "—"}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">تعداد:</span>{" "}
                {selectedCompletedOrder.attributes
                  .map((a) => a.value)
                  .join(" / ")}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">گزارش تکمیل</h3>
              {selectedCompletedOrder.completionReport
                ?.split("\n")
                .map((line, idx) =>
                  line.startsWith("http") ? (
                    <div key={idx}>
                      <a
                        href={line}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all"
                      >
                        {line}
                      </a>
                    </div>
                  ) : (
                    <p key={idx} className="text-gray-700">
                      {line}
                    </p>
                  )
                )}
            </div>
          </div>
        </div>
      )}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-[#00172f] rounded-3xl w-[60%] p-10 relative overflow-y-auto max-h-[120vh]">
            {/* Close button */}
            <button
              onClick={() => setHistoryModalOpen(false)}
              className="absolute top-4 right-4 text-2xl font-bold hover:text-red-200"
            >
              &times;
            </button>
            <div className="flex justify-between items-center border border-gray-100 rounded-full p-4 mb-4">
              <div className="flex items-center w-1/3">
                <div className="p-4 rounded-full bg-[#6fd6e5] ml-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <rect
                        width="48"
                        height="48"
                        fill="white"
                        fill-opacity="0.01"
                      ></rect>{" "}
                      <path
                        d="M5.81824 6.72729V14H13.091"
                        stroke="#4f4f4f"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M4 24C4 35.0457 12.9543 44 24 44V44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C16.598 4 10.1351 8.02111 6.67677 13.9981"
                        stroke="#4f4f4f"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M24.005 12L24.0038 24.0088L32.4832 32.4882"
                        stroke="#4f4f4f"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>

                <h2 className="text-md text-gray-100 ">تاریخچه سفارش‌ها</h2>
              </div>
              {/* Filter buttons */}
              <div className="relative flex justify-center gap-4 bg-gray-300 rounded-full h-12 w-full ">
                {/* active background */}
                <div
                  className="absolute top-0 left-0 h-full bg-[#6FD6E5] rounded-full transition-all duration-300"
                  style={{
                    width: `${100 / 3}%`,
                    transform:
                      historyFilter === "all"
                        ? "translateX(200%)"
                        : historyFilter === "completed"
                        ? "translateX(100%)"
                        : " translateX(0%)",
                  }}
                ></div>

                {/* Buttons */}
                {["all", "completed", "cancelled"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f as any)}
                    className="flex-1 z-10 text-sm md:text-md h-12 rounded-full cursor-pointer relative flex items-center justify-center transition-colors duration-200
        hover:text-gray-200 text-gray-700"
                  >
                    {f === "all"
                      ? "همه"
                      : f === "completed"
                      ? "تکمیل شده"
                      : "لغو شده"}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {OptimizationsState
                .filter((item) =>
                  historyFilter === "all"
                    ? true
                    : item.adminStatus === historyFilter
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-lg transition"
                  >
                    <button
                      onClick={() => handleClick(item.id)}
                      className="relative w-14 h-14 flex justify-center items-center"
                    >
                      <div
                        className={`absolute w-12 h-12 flex justify-center items-center rounded-full border-2 ${
                          item.adminStatus === "completed"
                            ? "border-green-700 animate-bounce"
                            : item.adminStatus === "cancelled"
                            ? "border-red-800"
                            : item.adminStatus === "in_progress"
                            ? "border-orange-500" 
                            : "border-gray-200"
                        }`}
                      >
                        <Image
                          width={32}
                          height={32}
                          alt="Backlink"
                          src={"/dashboard/security.png"}
                          className="object-contain rotate-12"
                        />
                      </div>
                    </button>

                    <div className="ml-4 flex-1">
                      <p className="text-gray-700 text-sm font-bold">
                        تاریخ خرید:{" "}
                        {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                      <p className="text-gray-700 text-sm font-semibold">
                        محصول: {item.productTitle}
                      </p>
                      <p className="text-gray-500 text-sm">
                        وضعیت:{" "}
                        {item.adminStatus === "completed"
                          ? "تکمیل شده"
                          : item.adminStatus === "cancelled"
                          ? "لغو شده"
                          : "در حال انجام"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-[#0B1120]/90 to-[#1C2233]/90 w-[90%] max-w-lg relative rounded-3xl shadow-2xl overflow-hidden border border-cyan-500/20 animate-scaleUp">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white text-3xl hover:text-red-500 transition-colors z-20"
            >
              &times;
            </button>

            <div className="relative w-full h-64 flex justify-center items-center overflow-hidden">
              <Image
                width={220}
                height={220}
                alt="Backlink"
                src={"/dashboard/security.png"}
                className="object-contain animate-float blur-[1px]"
              />
              <div className="absolute inset-0 flex items-end p-4">
                <h2 className="text-2xl font-bold text-white text-center w-full drop-shadow-lg">
                  ثبت اطلاعات سفارش بک لینک
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {fields?.map((field) => (
                <div key={field.id} className="flex flex-col">
                  <label className="text-sm text-gray-300 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.fieldType === "number" ? "number" : "text"}
                    name={field.id}
                    placeholder={field.placeholder || field.label}
                    value={values[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl border border-cyan-500/30 bg-[#1C2233] text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-500 outline-none transition-all duration-300 ${
                      !canEdit
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:ring-cyan-300"
                    }`}
                    required={field.required}
                    disabled={!canEdit}
                  />
                </div>
              ))}

              <button
                onClick={handleSubmit}
                className={`w-full py-3 rounded-xl text-lg font-semibold text-white transition-all duration-300 ${
                  !canEdit
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600 active:scale-95 shadow-lg"
                }`}
                disabled={!canEdit}
              >
                {!canEdit ? "ثبت شده" : "ثبت اطلاعات"}
              </button>

              {!canEdit ? (
                <p className="text-sm text-gray-400 text-center">
                  این سفارش قبلاً ثبت شده و دیگر قابل تغییر نیست.
                </p>
              ) : (
                <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                  <li>اطلاعات وارد شده پس از تایید، قابل ویرایش نیست.</li>
                  <li>از صحت اطلاعات قبل از ارسال مطمئن شوید.</li>
                  <li>پس از ثبت، وضعیت سفارش شما برای بررسی ارسال می‌شود.</li>
                </ul>
              )}

              {loading && (
                <p className="text-cyan-400 text-sm animate-pulse">
                  در حال بارگذاری...
                </p>
              )}
              {error && (
                <p className="text-red-400 text-sm animate-shake">{error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OptimizationPage;
