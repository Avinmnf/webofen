'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity, placeOrder } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderMessage, setOrderMessage] = useState('');

  const handlePlaceOrder = async () => {
    const res = await placeOrder({ customerName, customerPhone, address });
    if (res.success) {
      setOrderMessage(`سفارش شما ثبت شد! ${res.orderId ? `شناسه سفارش: ${res.orderId}` : ''}`);
      setCustomerName('');
      setCustomerPhone('');
      setAddress('');
    } else {
      setOrderMessage(`خطا در ثبت سفارش: ${res.message}`);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">سبد خرید</h1>
      {cart.length === 0 ? (
        <p>سبد خرید خالی است.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p>تعداد: {item.quantity}</p>
                {item.price && <p>قیمت: {item.price}</p>}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItemQuantity(item.productId, item.variantId, parseInt(e.target.value))
                  }
                  className="w-16 border rounded px-2 py-1"
                />
                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <div className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="نام مشتری"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="شماره تماس"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <textarea
            placeholder="آدرس"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            ثبت سفارش
          </button>
          {orderMessage && <p className="text-sm mt-2">{orderMessage}</p>}
        </div>
      )}
    </div>
  );
}
