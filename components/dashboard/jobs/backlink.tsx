"use client";

import React, { useState } from "react";
import { useOrderInput } from "@/hooks/useOrderInput"; // adjust path if needed

export interface BacklinkItem {
  id: string;
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

interface BacklinkProps {
  backlinks: BacklinkItem[];
}

const Backlink: React.FC<BacklinkProps> = ({ backlinks }) => {
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

  const pendingBacklink = backlinks.find((item) => item.status === "0");

  return (
    <>
      <div className="flex flex-col gap-4 text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
        {backlinks.map((item) => {
          // Generate a variant name from attributes
          const variantName = item.attributes
            .map((attr) => attr.value)
            .join(" / ");

          return (
            <div key={item.id} className="flex justify-between items-center">
              <div className="text-sm text-right">
                <p className="text-gray-700 font-semibold">{variantName}</p>
                <p className="text-gray-600">{item.keyword}</p>
              </div>

                        <button 
                onClick={() => handleClick(item.id)}
                        >
            <div className="animate-bounce w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              ⚡
            </div>
          </button>
            </div>
          );
        })}
      </div>

      {pendingBacklink && (
        <div className="flex justify-center w-full mt-6">
          <button onClick={() => handleClick(pendingBacklink.id)}>
            <div className="animate-bounce w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              ⚡
            </div>
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-800 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-600">
              ثبت اطلاعات لینک
            </h2>

            {loading && <p>در حال بارگذاری فیلدها...</p>}
            {error && <p className="text-red-500">{error}</p>}

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
      )}
    </>
  );
};

export default Backlink;
