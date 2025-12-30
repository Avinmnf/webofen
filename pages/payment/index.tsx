// pages/cart.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useCart } from "@/contexts/CartContext";
import { useCoupon } from "@/hooks/useCoupon";
import Image from "next/image";
import Link from "next/link";
import { useCheckout } from "@/hooks/useCheckout";
import { useRouter } from "next/router";
import Productvideo from "@/components/productvideo";
import { ShoppingBag, Trash2, Tag, ArrowLeft, CheckCircle, AlertCircle, User, Phone, MapPin, Loader2 } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { clearCart, cart, removeItem } = useCart();
  const { placeOrder } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [refId, setRefId] = useState<string | null>(null);
  const { handleCheckout, loading } = useCheckout();
  const [orderUpdateFailed, setOrderUpdateFailed] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  
  // Use coupon hook
  const {
    appliedCoupon,
    couponMessage,
    validateCoupon,
    setAppliedCoupon,
    setCouponMessage,
  } = useCoupon();

  const [couponCode, setCouponCode] = useState("");
  const [isCouponLoading, setIsCouponLoading] = useState(false);

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    setCustomerPhone(value);

    if (value && !/^(\+98|0)?9\d{9}$/.test(value)) {
      setPhoneError("شماره تماس معتبر نیست");
    } else {
      setPhoneError("");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsCouponLoading(true);
    const coupon = await validateCoupon(couponCode, subtotal);
    if (!coupon) setAppliedCoupon(null);
    setIsCouponLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setOrderMessage("سبد خرید شما خالی است");
      return;
    }

    if (!customerName || !customerPhone) {
      setOrderMessage("لطفا اطلاعات خود را کامل کنید");
      return;
    }

    if (phoneError) {
      setOrderMessage("لطفا شماره تماس معتبر وارد کنید");
      return;
    }

    const itemsForOrder: { variantId: string; quantity: number }[] = [];
    lines.forEach((line) => {
      for (let i = 0; i < line.quantity; i++) {
        itemsForOrder.push({
          variantId: line.variantId!,
          quantity: 1,
        });
      }
    });

    const success = await handleCheckout({
      customerName,
      customerPhone,
      address: "",
      items: itemsForOrder,
      couponCode: appliedCoupon?.code || null,
    });

  
  };

  // Success state
  if (paymentSuccess && cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              پرداخت موفق
            </h1>
            <p className="text-gray-600 mb-6">
              سفارش شما با موفقیت ثبت شد و به زودی آماده ارسال خواهد شد.
            </p>
            {refId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">کد رهگیری</p>
                <p className="font-mono text-lg font-bold text-gray-900">
                  {refId}
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ادامه خرید
              </Link>
              <Link
                href="/orders"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                پیگیری سفارش
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cart.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              سبد خرید خالی است
            </h1>
            <p className="text-gray-600 mb-6">
              محصولی به سبد خرید اضافه نکرده‌اید.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              بازگشت به محصولات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main cart view
  return (
    <>
      <Head>
        <title>سبد خرید | وبوفن</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              سبد خرید
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <ShoppingBag className="w-4 h-4" />
              <span>{lines.length} کالا</span>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {lines.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100">
                            {item.imageUrl ? (
                              <Productvideo product={item.imageUrl} />
                            ) : (
                              <Image
                                width={96}
                                height={96}
                                src={item.imageUrl || "/dashboard/backlink.png"}
                                loader={({ src }) => src}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
                                {item.title}
                              </h3>
                              <div className="mt-2 space-y-1">
                                <p className="text-sm text-gray-500">
                                  تعداد: {item.quantity} بسته
                                </p>
                                {item.variantAttributes && (
                                  <div className="flex flex-wrap gap-2">
                                    {Object.entries(item.variantAttributes).map(
                                      ([attr, value], i) => (
                                        <span
                                          key={i}
                                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                                        >
                                          {attr}: {value}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                              title="حذف از سبد خرید"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Price Section */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {item.couponApplied ? (
                                <>
                                  <span className="text-sm line-through text-gray-400">
                                    {(item.price! / 10).toLocaleString()} تومان
                                  </span>
                                  <span className="text-base font-bold text-emerald-600">
                                    {(item.finalUnit / 10).toLocaleString()} تومان
                                  </span>
                                </>
                              ) : (
                                <span className="text-base font-bold text-gray-900">
                                  {(item.price! / 10).toLocaleString()} تومان
                                </span>
                              )}
                            </div>
                            {item.couponApplied && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                                تخفیف خورده
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="sticky top-8 space-y-6">
                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    خلاصه سفارش
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">قیمت کالاها</span>
                      <span className="text-gray-900">{(subtotal / 10).toLocaleString()} تومان</span>
                    </div>
                    
                    {discountTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">تخفیف</span>
                        <span className="text-emerald-600">-{(discountTotal / 10).toLocaleString()} تومان</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-base">
                        <span className="font-semibold text-gray-900">مبلغ قابل پرداخت</span>
                        <span className="font-bold text-gray-900 text-lg">{(totalPrice / 10).toLocaleString()} تومان</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-900">کد تخفیف</h3>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="کد تخفیف خود را وارد کنید"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isCouponLoading || !couponCode.trim()}
                      className="px-4 py-2.5 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCouponLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "اعمال"
                      )}
                    </button>
                  </div>
                  
                  {couponMessage && (
                    <div className={`mt-3 text-sm px-3 py-2 rounded-lg ${
                      couponMessage.includes("اعمال شد") 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "bg-red-50 text-red-700"
                    }`}>
                      {couponMessage}
                    </div>
                  )}
                </div>

                {/* Checkout Form */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    اطلاعات تکمیلی
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        نام و نام خانوادگی
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: علی محمدی"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                        <Phone className="w-4 h-4" />
                        شماره تماس
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={handlePhoneChange}
                        placeholder="مثال: 09123456789"
                        className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                          phoneError ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      {phoneError && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {phoneError}
                        </p>
                      )}
                    </div>
                    
                  
                  </div>

                  {/* Order Message */}
                  {orderMessage && (
                    <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg">
                      {orderMessage}
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !customerName || !customerPhone || !!phoneError}
                    className="w-full mt-6 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        در حال ثبت سفارش...
                      </>
                    ) : (
                      "تکمیل سفارش"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}