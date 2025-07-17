'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type CartItem = {
  title: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price?: number; // optional, could store price snapshot
};

type CartContextType = {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateItemQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (
    customerName: string,
    customerPhone: string,
    address: string
  ) => Promise<{ success: boolean; orderId?: string; error?: string }>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save to localStorage on cart change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
    );
  };

  const updateItemQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setCart([]);

  // Call your backend API to place the order
  const placeOrder = async (customerName: string, customerPhone: string, address: string) => {
    if (cart.length === 0) return { success: false, error: 'Cart is empty' };

    // Construct items for API: must include variantId, quantity, price
    // You can add price to CartItem or fetch price on server-side
    const items = cart.map(({ variantId, quantity, price }) => {
      if (!variantId) throw new Error('variantId missing from cart item');
      if (!price) throw new Error('price missing from cart item');
      return { variantId, quantity, price };
    });

    try {
      const res = await fetch('/api/proxy/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, customerPhone, address, items }),
      });
      const json = await res.json();
      if (!res.ok) return { success: false, error: json.error || 'Order failed' };

      clearCart();
      return { success: true, orderId: json.orderId };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateItemQuantity, clearCart, placeOrder }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
