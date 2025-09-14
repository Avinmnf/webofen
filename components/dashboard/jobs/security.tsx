"use client";

import React, { useState } from "react";
import { useOrderInput } from "@/hooks/useOrderInput";
import HoverVideo from "@/components/videos/hovervideos";

export interface SecurityItem {
  id: string;
  slug: string; // <-- added slug
  productTitle: string;
  attributes: { name: string; value: string }[];
  quantity: number;
  price: number;
  orderId: string;
  status: string;
  createdAt: string;
  siteurl?: string;
  keyword: string;
}

interface SecurityProps {
  security: SecurityItem[];
}

const Security: React.FC<SecurityProps> = ({ security }) => {
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

  const pendingSecurity = security.find((item) => item.status === "0");
  const backlinkOrders = security.filter((item) => item.slug === "security");

  return (
    <>
      <div className="grid grid-cols-3 gap-4 text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
        {security.map((item) => {
          // Generate a variant name from attributes
          const variantName = item.attributes
            .map((attr) => attr.value)
            .join(" / ");

          return (
            <div key={item.id} className="flex justify-between items-center">
              <div className="text-sm text-right">
                <div className="flex">
                  <p className="text-gray-600 ml-2"> خرید:</p>
                  <p className="text-gray-600">
                    {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <div className="flex">
                  <p className="text-gray-600 ml-2">تعداد:</p>
                  <p className="text-gray-700 font-semibold">{variantName}</p>
                </div>
              </div>

              <button onClick={() => handleClick(item.id)}>
                <div className=" w-25 h-25 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="animate-bounce"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="-46.08 -46.08 604.16 604.16"
                  >
                    {" "}
                    <path
                      fill="#DFDFE1"
                      d="M479.587 188.925c43.218-43.221 43.218-113.29 0-156.512-43.221-43.218-113.292-43.218-156.513 0L32.413 323.075c-43.218 43.221-43.216 113.29.002 156.512 43.219 43.218 113.29 43.218 156.51 0z"
                    />{" "}
                    <path
                      fill="#CFCDD2"
                      d="M479.587 32.414 32.414 479.587c43.219 43.218 113.29 43.218 156.51 0l290.663-290.662c43.218-43.221 43.218-113.29 0-156.511"
                    />{" "}
                    <path
                      fill="#5e5483"
                      d="m177.743 177.745-145.33 145.33c-43.218 43.221-43.216 113.29.002 156.512 43.219 43.218 113.29 43.218 156.51 0l145.331-145.331z"
                    />{" "}
                    <path
                      fill="#634c76"
                      d="M255.999 256 32.414 479.587c43.219 43.218 113.29 43.218 156.51 0l145.331-145.331z"
                    />{" "}
                  </svg>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {pendingSecurity && (
        <div className="flex justify-center w-full mt-6">
          <button onClick={() => handleClick(pendingSecurity.id)}>
            <div className="animate-bounce w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              ⚡
            </div>
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div className="bg-white w-[50%]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-800 hover:text-red-500 text-2xl"
            >
              &times;
            </button>

            <div className="">
              <div className="p-2 relative w-full aspect-[19/9] bg-[#001933] rounded-xl overflow-hidden flex items-start">
                <HoverVideo
                  src="/guidance/Hailuo_Video_Create_a_smooth_looping_animat_420401581408546819.mp4"
                  className="h-full absolute left-0 w-auto object-cover"
                />
                <h2 className="text-xl font-semibold mb-4 text-white">
                  ثبت اطلاعات لینک
                </h2>
                <div className="absolute top-10 right-10 z-10 flex flex-col gap-2">
                  {fields.map((field) => (
                    <input
                      key={field.id}
                      type={field.fieldType === "number" ? "number" : "text"}
                      name={field.id}
                      placeholder={field.placeholder || field.label}
                      value={values[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-full mb-3 p-2 border border-gray-200 rounded-lg text-gray-600"
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
            </div>
            {loading && <p>در حال بارگذاری فیلدها...</p>}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Security;
