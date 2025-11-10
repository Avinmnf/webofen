"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export type CartItem = {
  title: string;
  productId: string;
  slug: string; // ← add this
  variantId?: string;
  quantity: number;
  price?: number;
  imageUrl?: string;
  videoUrl?: string;
  variantAttributes?: Record<string, string>;
};

type CustomerInfo = {
  customerName: string;
  customerPhone: string;
  address: string;
  couponCode?: string;
};

// Extra info we send to backend
type OrderExtraInfo = {
  items: any[];
  subtotal: number;
  totalPrice: number;
  discountTotal: number;
  couponId?: string | null;
};

type CartContextType = {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateItemQuantity: (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => void;
  clearCart: () => void;
  placeOrder: (
    customerInfo: CustomerInfo,
    extra?: OrderExtraInfo
  ) => Promise<{ success: boolean; message: string; orderId?: string }>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  // Always compute storageKey dynamically
  const storageKey = user ? `cart_${user.id}` : null;

  /**
   * ✅ FIRST: Check URL for paymentSuccess on first mount.
   * This runs BEFORE we try to hydrate cart from storageKey.
   * Clears ALL cart keys (guest + user carts).
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get("paymentSuccess");

    if (paymentSuccess === "true") {
      console.log("✅ Payment success detected — clearing all carts");

      // Remove all keys starting with "cart_"
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("cart_")) {
          localStorage.removeItem(key);
        }
      });

      setCart([]);

      // Clean up URL so refresh won't keep clearing
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  /**
   * ✅ SECOND: Hydrate cart whenever storageKey changes.
   * Will hydrate empty cart if the first effect already cleared storage.
   */
  useEffect(() => {
    if (!storageKey) {
      setCart([]); // reset cart for logged-out users
      return;
    }

    const storedCart = localStorage.getItem(storageKey);
    setCart(storedCart ? JSON.parse(storedCart) : []);
  }, [storageKey]);

  /**
   * ✅ THIRD: Persist to localStorage whenever cart changes.
   */
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    }
  }, [cart, storageKey]);

  const addItem = (item: CartItem) => {
    if (!storageKey) return;
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    if (!storageKey) return;
    setCart((prev) =>
      prev.filter((i) => i.productId !== productId || i.variantId !== variantId)
    );
  };

  const updateItemQuantity = (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => {
    if (!storageKey) return;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (storageKey) localStorage.removeItem(storageKey);
  };

 const placeOrder = async (
  customerInfo: CustomerInfo,
  extra?: OrderExtraInfo
) => {
  if (!user) return { success: false, message: "User not logged in." };

  try {
    const payload = {
      ...customerInfo,
      ...extra,
      status: "not_payed",
    };

    const res = await fetch(`/api/proxy/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) return { success: false, message: data.message || "خطا در ثبت سفارش." };

    // ✅ Call admin SMS API
    await fetch(`/api/sms/smssend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: data.orderId,
        type: "order_admin",
      }),
    }).catch((err) => console.error("Admin SMS error:", err));

    // ✅ Call user SMS API
    await fetch(`/api/zarinpal/sms/payment-success`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: data.orderId,
        customerName: customerInfo.customerName,
        customerPhone: customerInfo.customerPhone,
        totalPrice: extra?.totalPrice || 0,
      }),
    }).catch((err) => console.error("User SMS error:", err));

    return {
      success: true,
      message: "سفارش با موفقیت ثبت شد.",
      orderId: data.orderId,
    };
  } catch (error) {
    console.error("placeOrder error:", error);
    return { success: false, message: "خطای شبکه یا سرور." };
  }
};

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};