"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

type CheckoutProps = {
  customerName: string;
  customerPhone: string;
  address: string;
  items: {
    variantId: string;
    quantity: number;
    originalPrice?: number;
    finalPrice?: number;
  }[];
  couponCode?: string | null;
  totalPrice?: number;
};

type PaymentResponse = {
  success: boolean;
  startPay?: string;
  authority?: string;
  message?: string;
};

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCart();

const handleCheckout = async ({
  customerName,
  customerPhone,
  items,
  couponCode,
}: CheckoutProps) => {
  if (!items || items.length === 0) {
    alert("سبد خرید شما خالی است");
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Create pre-payment order
    const orderRes = await fetch(`/api/proxy/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        customerName,
        customerPhone,
        items,
        couponCode,
        status: "not_payed",
      }),
    });

    const orderData = await orderRes.json();
    if (!orderData.orderId) throw new Error("خطا در ایجاد سفارش");
    const orderId = orderData.orderId;

    // 2️⃣ Prepare payment
    const paymentRes = await fetch(`/api/zarinpal/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        callbackUrl: `/api/zarinpal/verify`,
      }),
    });

    const paymentData: PaymentResponse = await paymentRes.json();
    if (!paymentData.success || !paymentData.startPay) {
      throw new Error(paymentData.message || "خطا در درخواست پرداخت");
    }

    // 3️⃣ Redirect to Zarinpal
    window.location.href = paymentData.startPay;
  } catch (error: any) {
    console.error("Checkout error:", error);
    alert(error.message || "مشکلی پیش آمد، دوباره تلاش کنید");
  } finally {
    setLoading(false);
  }
};


  return { handleCheckout, loading };
}
