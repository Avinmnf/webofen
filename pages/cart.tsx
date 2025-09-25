"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useCoupon } from "@/hooks/useCoupon"; // <-- import your custom hook
import Image from "next/image";

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity, placeOrder } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Use coupon hook
  const {
    appliedCoupon,
    couponMessage,
    validateCoupon,
    setAppliedCoupon,
    setCouponMessage,
  } = useCoupon();

  const [couponCode, setCouponCode] = useState("");

  // --- Totals ---
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  let discountTotal = 0;
  let totalPrice = subtotal;
  const lines = cart.map((item) => ({
    ...item,
    finalUnit: item.price || 0,
    couponApplied: false,
  }));

  if (appliedCoupon) {
    const minTotalOk =
      !appliedCoupon.minTotal || subtotal >= Number(appliedCoupon.minTotal);
    if (minTotalOk) {
      let rawDiscount = Math.floor(
        subtotal * (appliedCoupon.discountPercentage / 100)
      );
      if (appliedCoupon.maxDiscount)
        rawDiscount = Math.min(rawDiscount, Number(appliedCoupon.maxDiscount));
      discountTotal = rawDiscount;
      totalPrice = subtotal - discountTotal;

      let remainingDiscount = discountTotal;
      lines.forEach((line, idx) => {
        const lineSubtotal = line.price! * line.quantity;
        const portion =
          idx === lines.length - 1
            ? remainingDiscount
            : Math.floor((lineSubtotal / subtotal) * discountTotal);
        remainingDiscount -= portion;
        const perUnitReduction = Math.floor(portion / line.quantity);
        line.finalUnit = Math.max(0, line.price! - perUnitReduction);
        line.couponApplied = perUnitReduction > 0;
      });
    }
  }

  const handleApplyCoupon = async () => {
    const coupon = await validateCoupon(couponCode, subtotal);
    if (!coupon) setAppliedCoupon(null);
  };

  const handlePlaceOrder = async () => {
    const itemsForOrder = lines.flatMap((line) =>
      Array.from({ length: line.quantity }).map(() => ({
        variantId: line.variantId,
        quantity: 1,
        originalPrice: line.price || 0,
        finalPrice: line.finalUnit,
        appliedCouponId: line.couponApplied ? appliedCoupon?.id || null : null,
      }))
    );

    const res = await placeOrder(
      { customerName, customerPhone, address, couponCode: appliedCoupon?.id },
      { items: itemsForOrder, subtotal, totalPrice, discountTotal }
    );

    if (res.success) {
      setOrderMessage(
        `سفارش شما با موفقیت ثبت شد! ${
          res.orderId ? `شناسه سفارش: ${res.orderId}` : ""
        }`
      );
      setCustomerName("");
      setCustomerPhone("");
      setAddress("");
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponMessage("");
      setShowSuccessModal(true);
    } else {
      setOrderMessage(`خطا در ثبت سفارش: ${res.message}`);
    }
  };

  return (
    <div className="p-6 w-9/12 mx-auto space-y-8 text-gray-800">
      <p className="border-b text-lg font-semibold text-gray-700 pb-4 border-gray-300 mb-6">
        سبد خرید
      </p>
      <div className="flex justify-between">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            سبد خرید خالی است.
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="space-y-4 w-full pl-4">
              {lines.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-2xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex space-y-1">
                    <Image
                      width={500}
                      height={200}
                      src={item.imageUrl || "/placeholder.png"}
                      loader={({ src }) => src}
                      alt={item.title}
                      className="rounded-t-2xl h-42 w-44"
                    />
                    <div>
                      <p className="font-semibold text-lg mb-2">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        تعداد: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        قیمت واحد: {item.price?.toLocaleString()} تومان
                      </p>
                      {item.couponApplied && (
                        <p className="text-sm text-emerald-600 font-medium">
                          بعد از کوپن: {item.finalUnit.toLocaleString()} تومان
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3 sm:mt-0">
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
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
                          <path
                            d="M20.5001 6H3.5"
                            stroke="#1C274C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          ></path>{" "}
                          <path
                            d="M9.5 11L10 16"
                            stroke="#1C274C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          ></path>{" "}
                          <path
                            d="M14.5 11L14 16"
                            stroke="#1C274C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          ></path>{" "}
                          <path
                            d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                            stroke="#1C274C"
                            stroke-width="1.5"
                          ></path>{" "}
                          <path
                            d="M18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5M18.8334 8.5L18.6334 11.5"
                            stroke="#1C274C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          ></path>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-100 p-6 rounded-2xl">
              {/* Totals */}
              <div className="mt-6">
                {discountTotal > 0 && (
                  <p className="text-emerald-600">
                    تخفیف: {discountTotal.toLocaleString()} تومان
                  </p>
                )}
                <p className="font-bold text-sm mt-1">
                  جمع سبد خرید: {totalPrice.toLocaleString()} تومان
                </p>
              </div>
              <div className="flex gap-2 items-center mt-6">
                <input
                  type="text"
                  placeholder="کد تخفیف"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  اعمال
                </button>
              </div>
              {couponMessage && (
                <div className="mt-2 text-sm font-medium">{couponMessage}</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Order Info */}
      {cart.length > 0 && (
        <div className="bg-white p-6 space-y-4">
          <h2 className="text-xl font-bold mb-2">اطلاعات سفارش</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="نام مشتری"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-100"
            />
            <input
              type="text"
              placeholder="شماره تماس"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-100"
            />
            <textarea
              placeholder="آدرس"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-100"
            />
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-1/4 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            ثبت سفارش
          </button>
          {orderMessage && (
            <div className="text-center text-sm text-blue-700 mt-2 font-medium">
              {orderMessage}
            </div>
          )}
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center space-y-4">
            <p className="text-gray-700 text-base">{orderMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
