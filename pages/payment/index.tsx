// pages/cart.tsx
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useCoupon } from "@/hooks/useCoupon";
import Image from "next/image";
import Link from "next/link";
import { useCheckout } from "@/hooks/useCheckout";
import { useRouter } from "next/router";

export default function CartPage() {
  const router = useRouter();
  const { clearCart, cart } = useCart();
  const { removeItem, updateItemQuantity, placeOrder } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [refId, setRefId] = useState<string | null>(null);
  const { handleCheckout, loading } = useCheckout();
  const [orderUpdateFailed, setOrderUpdateFailed] = useState(false);

  // Use coupon hook
  const {
    appliedCoupon,
    couponMessage,
    validateCoupon,
    setAppliedCoupon,
    setCouponMessage,
  } = useCoupon();

  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    const { paymentSuccess, ref_id, orderUpdate } = router.query;

    if (paymentSuccess === "true") {
      setPaymentSuccess(true);
    }
    if (ref_id) {
      setRefId(ref_id as string);
    }
    if (orderUpdate === "failed") {
      setOrderUpdateFailed(true);
    }
  }, [router.isReady, router.query]);

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
useEffect(() => {
  console.log("📍 CART PAGE - URL DETAILS:", {
    fullURL: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    queryParams: router.query,
    hasPaymentSuccess: router.query.paymentSuccess === "true",
    hasRefId: !!router.query.ref_id
  });
}, [router.query]);

// Also add this to check if the effect is running
useEffect(() => {
  console.log("🔄 Cart page useEffect triggered");
}, []);

  const handleApplyCoupon = async () => {
    const coupon = await validateCoupon(couponCode, subtotal);
    if (!coupon) setAppliedCoupon(null);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("سبد خرید شما خالی است");
      return;
    }

    const itemsForOrder = lines.map((line) => ({
      variantId: line.variantId!,
      quantity: line.quantity,
    }));

    await handleCheckout({
      customerName,
      customerPhone,
      address,
      items: itemsForOrder,
      couponCode: appliedCoupon?.code || null,
    });

    setCustomerName("");
    setCustomerPhone("");
    setAddress("");
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  if (paymentSuccess && cart.length === 0) {
    return (
      <div className="p-6 w-9/12 mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">پرداخت موفق</h2>
          <p className="text-gray-600 mb-4">
            پرداخت شما با موفقیت انجام شد و سبد خرید خالی شد.
          </p>
          {refId && (
            <p className="text-sm text-gray-500 mb-6">کد رهگیری: {refId}</p>
          )}
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              ادامه خرید
            </Link>
            <Link
              href="/orders"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              مشاهده سفارشات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart without success message (normal empty cart)
  if (cart.length === 0 && !paymentSuccess) {
    return (
      <div className="p-6 w-9/12 mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            سبد خرید خالی است
          </h2>
          <p className="text-gray-600 mb-6">
            هیچ محصولی در سبد خرید شما وجود ندارد.
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  // Normal cart with items
  return (
    <div className="p-6 w-9/12 mx-auto space-y-8 text-gray-800">
      <div className="border-b text-lg font-semibold text-gray-700 pb-4 border-gray-300 mb-6  items-center justify-between">
        <p>سبد خرید شما</p>
        <span className="text-sm font-normal text-gray-500">
          {lines.length} آیتم
        </span>
      </div>

      <div className="flex justify-between">
        {/* Cart items */}
        <div className="space-y-4 w-full pl-4">
          {lines.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 border-b border-gray-300 transition"
            >
              <Link href={`/products/${item.productId}`}>
                <div className="flex space-y-1">
                  <Image
                    width={100}
                    height={90}
                    src={item.imageUrl || "/dashboard/backlink.png"}
                    loader={({ src }) => src}
                    alt={item.title}
                    className="rounded-t-2xl"
                  />
                  <div>
                    <p className="font-semibold text-lg mb-2">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      تعداد: {item.quantity}
                    </p>
                    {item.variantAttributes && (
                      <div className="text-sm text-gray-500 mt-1">
                        {Object.entries(item.variantAttributes ?? {}).map(
                          ([attr, value], i, arr) => (
                            <span key={i}>
                              {attr}: {value}
                              {i < arr.length - 1 ? ", " : ""}
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {/* Original Price (with line-through if coupon applied) */}
                    <p
                      className={`text-sm text-gray-500 ${
                        item.couponApplied ? "line-through text-gray-400" : ""
                      }`}
                    >
                      قیمت: {item.price?.toLocaleString()} تومان
                    </p>

                    {/* Show discounted price if coupon applied */}
                    {item.couponApplied && (
                      <p className="text-sm text-emerald-600 font-semibold">
                        بعد از کوپن: {item.finalUnit.toLocaleString()} تومان
                      </p>
                    )}
                  </div>
                </div>
              </Link>
              <div className="flex gap-3 mt-3 sm:mt-0">
                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="p-2 rounded-lg  text-red-600 hover:bg-red-50"
                >
                  {/* Your SVG icon */}
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
            <p className=" text-sm mt-1">
              قیمت محصولات: {subtotal.toLocaleString()} تومان
            </p>
            <p className=" text-sm mt-1">
              جمع سبد خرید: {totalPrice.toLocaleString()} تومان
            </p>
          </div>
          <div className="flex gap-2 items-center mt-6">
            <input
              type="text"
              placeholder="کد تخفیف"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 border-b px-4 py-2 border-gray-400 text-sm"
            />
            <button
              onClick={handleApplyCoupon}
              className="px-2 py-2 text-sm rounded-md bg-[#1d546b] text-white"
            >
              اعمال
            </button>
          </div>
          {couponMessage && (
            <div className="mt-2 text-sm font-medium">{couponMessage}</div>
          )}
        </div>
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
            disabled={loading}
            className="w-1/4 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "در حال ثبت سفارش..." : "ثبت سفارش"}
          </button>

          {orderMessage && (
            <div className="text-center text-sm text-blue-700 mt-2 font-medium">
              {orderMessage}
            </div>
          )}
        </div>
      )}

      {/* Success Modal (alternative approach) */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center space-y-4">
            <div className="text-green-500 text-6xl">✓</div>
            <h3 className="text-xl font-bold text-gray-800">پرداخت موفق</h3>
            <p className="text-gray-600">پرداخت شما با موفقیت انجام شد.</p>
            {refId && (
              <p className="text-sm text-gray-500">کد رهگیری: {refId}</p>
            )}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              ادامه
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
