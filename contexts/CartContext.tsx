"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export type CartItem = {
  title: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price?: number;
  imageUrl?: string;
  variantAttributes?: Record<string, string>;
};

type CustomerInfo = {
  customerName: string;
  customerPhone: string;
  address: string;
  couponCode?: string;
};

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

  const storageKey = user ? `cart_${user.id}` : "cart_guest";

  // Load cart from localStorage on mount and merge guest with user cart
  useEffect(() => {
    const guestCart = localStorage.getItem("cart_guest");
    const userCart = localStorage.getItem(storageKey);

    let initialCart: CartItem[] = [];

    if (guestCart) initialCart = [...JSON.parse(guestCart)];
    if (userCart) initialCart = [...initialCart, ...JSON.parse(userCart)];

    if (initialCart.length > 0) setCart(initialCart);

    if (user) localStorage.removeItem("cart_guest");
  }, [user?.id]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

  const addItem = (item: CartItem) => {
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
      } else {
        return [...prev, item];
      }
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((i) => i.productId !== productId || i.variantId !== variantId)
    );
  };

  const updateItemQuantity = (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => {
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
    localStorage.removeItem(storageKey);
  };

  const placeOrder = async (
    customerInfo: CustomerInfo,
    extra?: OrderExtraInfo
  ) => {
    try {
      const payload = {
        ...customerInfo,
        ...extra,
      };

      const res = await fetch(`api/proxy/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setCart([]);
        localStorage.removeItem(storageKey);
        return {
          success: true,
          message: "سفارش با موفقیت ثبت شد.",
          orderId: data.id,
        };
      } else {
        return { success: false, message: data.message || "خطا در ثبت سفارش." };
      }
    } catch (error) {
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
