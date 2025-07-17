'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { title } from 'process';

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity, placeOrder } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderMessage, setOrderMessage] = useState('');

  const totalPrice = cart.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);

  async function handlePlaceOrder() {
    const res = await placeOrder(customerName, customerPhone, address);
    if (res.success) {
      setOrderMessage(`سفارش شما ثبت شد! شناسه سفارش: ${res.orderId}`);
      setCustomerName('');
      setCustomerPhone('');
      setAddress('');
    } else {
      setOrderMessage(`خطا در ثبت سفارش: ${res.error}`);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow text-black">
      <h1 className="text-3xl font-bold mb-6">سبد خرید شما</h1>

      {cart.length === 0 && <p>سبد خرید شما خالی است.</p>}

      {cart.map(({ productId, variantId, quantity, price }, idx) => (
        <div key={`${productId}-${variantId ?? 'no-variant'}`} className="mb-4 border p-4 rounded flex justify-between items-center">
          <div>
            <p>محصول: {title}</p>
            <p>شناسه خرید: {variantId || 'اصلی'}</p>
            <p>قیمت واحد: {price?.toLocaleString('fa-IR') ?? 0} ریال</p>
          </div>

          <div>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => updateItemQuantity(productId, variantId, parseInt(e.target.value) || 1)}
              className="w-16 border rounded px-2 py-1"
            />
            <button
              onClick={() => removeItem(productId, variantId)}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              حذف
            </button>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <p className="text-xl font-semibold mb-6">جمع کل: {totalPrice.toLocaleString('fa-IR')} ریال</p>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="نام و نام خانوادگی"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="tel"
              placeholder="شماره تلفن"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              placeholder="آدرس"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              rows={3}
            />
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={!customerName || !customerPhone || !address}
            className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            ثبت سفارش
          </button>

          {orderMessage && <p className="mt-4 text-center text-sm">{orderMessage}</p>}
        </>
      )}
    </div>
  );
}
