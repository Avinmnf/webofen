"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { useOrderInput } from "@/hooks/useOrderInput";
import ProgressCircle from "../progress";
import SmallProgressCircle from "../smallprogress";
import Image from "next/image";
import BacklinkHistory from "../history/backlinkhistory";

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
  delayed?: string;
  completionTime?: string;
  deadline?: string;
  createdAt: string;
  siteurl?: string;
  keyword: string;
  submittedValues?: { id: string; label: string; value: string }[];
}

interface BacklinkProps {
  backlinks: BacklinkItem[];
}

const statusProgressMap: Record<string, number> = {
  pending: 0,
  in_progress: 50,
  completed: 100,
  out_of_time: 100,
};

const Backlink: React.FC<BacklinkProps> = ({ backlinks }) => {
  const [backlinksState, setBacklinksState] = useState<BacklinkItem[]>(backlinks);
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const {
    fields,
    values,
    setValues,
    loading,
    error,
    handleChange,
    submitValues,
    fetchValues,
  } = useOrderInput(selectedOrderItemId);
  
  // Use backlinksState instead of backlinks
  const selectedItem = backlinksState.find((item) => item.id === selectedOrderItemId);
  const canEdit = selectedItem?.adminStatus === "pending";
  
  const handleClick = async (id: string) => {
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

  const getProgress = (item: BacklinkItem) =>
    statusProgressMap[item.adminStatus ?? "pending"] ?? 0;

  const isDelayed = (item: BacklinkItem) => {
    if (item.adminStatus === "out_of_time") return true;
    if (!item.delayed) return false;

    const delayedStr = item.delayed.toLowerCase().trim();
    if (delayedStr === "true") return true;
    if (delayedStr === "false") return false;

    const delayedDate = new Date(delayedStr);
    return !isNaN(delayedDate.getTime()) && delayedDate < new Date();
  };

  useEffect(() => {
    const delayedItems = backlinksState.filter((item) => item.adminStatus === "out_of_time");
    if (delayedItems.length > 0) {
      setShowNotification(true);
    }
  }, [backlinksState]);

  // Use backlinksState for all filtering
  const inProgressItems = backlinksState.filter(
    (item) => item.adminStatus === "in_progress"
  );

  const delayedItems = backlinksState.filter(
    (item) => item.adminStatus === "out_of_time"
  );

  const canceledItems = backlinksState.filter(
    (item) => item.adminStatus === "canceled"
  );

  const normalItems = backlinksState.filter(
    (item) =>
      item.adminStatus !== "in_progress" &&
      item.adminStatus !== "out_of_time" &&
      item.adminStatus !== "canceled"
  );

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recentBacklinks = backlinksState.filter(
    (item) => new Date(item.createdAt) >= oneMonthAgo
  );

  const bigInProgressItem = inProgressItems[0];
  const otherInProgressItems = inProgressItems.slice(1);

  const pendingBacklink = backlinksState.find((item) => item.status === "0");

  const historyOrders = backlinksState.filter(
    (item) =>
      item.adminStatus === "completed" || new Date(item.createdAt) < oneMonthAgo
  );
  
  return (
    <>
      <div className="relative w-full min-h-[70vh] perspective-[1200px]">
        <div
          className={`transition-transform duration-700 [transform-style:preserve-3d] ${
            showHistory ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* FRONT SIDE – Recent Orders */}
          <div className="absolute inset-0 backface-hidden">
            <div className="flex flex-col items-center text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm space-y-8">
              {showNotification && (
                <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center animate-slideDown z-50">
                  ⚠️ سفارش شما دیرکرد داشته است. ما از تأخیر پوزش می‌طلبیم.
                </div>
              )}

              {/* Top in-progress pill */}
              {bigInProgressItem && (
                <div className="flex items-center relative flex-row-reverse w-full justify-between p-4">
                  <ProgressCircle
                    percentage={getProgress(bigInProgressItem)}
                    delayed={isDelayed(bigInProgressItem)}
                  />
                  <button
                    onClick={() => handleClick(bigInProgressItem.id)}
                    className="absolute left-14 w-20 h-16 flex items-center justify-center"
                  >
                    <div className="relative w-full h-32 flex justify-center items-center overflow-hidden">
                      <Image
                        width={220}
                        height={220}
                        alt="Backlink"
                        src={"/dashboard/backlink.png"}
                        className="object-contain rotate-30"
                      />
                    </div>
                  </button>
                  <div className=" mt-2 text-sm w-1/3">
                    <div className="flex gap-2 items-center">
                      <p className="text-gray-600 font-semibold">
                        تاریخ خرید:{" "}
                      </p>
                      <p className="text-gray-600">
                        {new Date(
                          bigInProgressItem.createdAt
                        ).toLocaleDateString("fa-IR")}
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
                      {bigInProgressItem?.submittedValues?.length ? (
                        <div className="mt-1 text-sm">
                          {bigInProgressItem.submittedValues.map((input) => (
                            <div key={input.id} className="flex gap-1 items-center">
                              <span className="font-semibold text-gray-600">{input.label}:</span>
                              <span className="text-gray-700">{input.value || "—"}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}

              {/* Small pills: other in-progress, delayed, canceled, and normal items */}
              <div className="flex flex-wrap justify-center gap-6 w-full">
                {[
                  ...otherInProgressItems,
                  ...delayedItems,
                  ...canceledItems,
                  ...normalItems,
                ].map((item) => {
                  const variantName = item.attributes
                    .map((a) => a.value)
                    .join(" / ");
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
                        <div className="relative w-full h-16 flex justify-center items-center overflow-hidden">
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
                            {new Date(item.createdAt).toLocaleDateString(
                              "fa-IR"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">تعداد:</p>
                          <p className="text-gray-700 font-semibold">
                            {variantName}
                          </p>
                        </div>
                        {/* Show submitted values for small pills */}
                        {item?.submittedValues?.length ? (
                          <div className="mt-1 text-xs">
                            {item.submittedValues.map((input) => (
                              <div key={input.id} className="flex gap-1 items-center">
                                <span className="font-semibold text-gray-600">{input.label}:</span>
                                <span className="text-gray-700">{input.value || "—"}</span>
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
          </div>

          {/* BACK SIDE – History */}
          <div className="absolute inset-0 [transform:rotateY(180deg)] backface-hidden">
            <div className="flex flex-col items-center text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm space-y-8">
              {historyOrders.length > 0 ? (
                <BacklinkHistory
                  history={historyOrders}
                  onSelect={handleClick}
                  getProgress={getProgress}
                  isDelayed={isDelayed}
                />
              ) : (
                <p className="text-gray-500 text-center mt-10">
                  هیچ سابقه‌ای برای این محصول وجود ندارد.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Flip Button */}
        {historyOrders.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg transition"
            >
              {showHistory ? "بازگشت" : "تاریخچه"}
            </button>
          </div>
        )}
      </div>

      {/* Pending Backlink */}
      {pendingBacklink && (
        <div className="flex justify-center w-full mt-6">
          <button onClick={() => handleClick(pendingBacklink.id)}>
            <div className="animate-bounce w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              ⚡
            </div>
          </button>
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
                src={"/dashboard/backlink.png"}
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
                  <li>اطلاعات وارد شده پس از ثبت قابل ویرایش نیست.</li>
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

export default Backlink;