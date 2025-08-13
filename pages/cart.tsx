'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cart, removeItem, updateItemQuantity, placeOrder } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePlaceOrder = async () => {
    const res = await placeOrder({ customerName, customerPhone, address });
    if (res.success) {
      setOrderMessage(`سفارش شما با موفقیت ثبت شد! ${res.orderId ? `شناسه سفارش: ${res.orderId}` : ''}`);
      setCustomerName('');
      setCustomerPhone('');
      setAddress('');
      setShowSuccessModal(true); // Show modal on success
    } else {
      setOrderMessage(`خطا در ثبت سفارش: ${res.message}`);
    }
  };

  const totalPrice = cart.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl text-gray-700 font-semibold mb-6 text-center border-b pb-2">سبد خرید</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600 mt-10 text-lg">سبد خرید خالی است.</div>
      ) : (
        <>
          <ul className="space-y-5">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md p-4 rounded-lg border border-gray-400"
              >
                <div className="flex-1 space-y-1 mb-3 sm:mb-0">
                  <p className="font-bold text-lg">{item.title}</p>
                  <p className="text-sm text-gray-700">تعداد: {item.quantity}</p>
                  {item.price && (
                    <p className="text-sm text-gray-700">قیمت واحد: {item.price.toLocaleString()} تومان</p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItemQuantity(item.productId, item.variantId, parseInt(e.target.value))
                    }
                    className="w-20 border rounded px-3 py-1 text-center text-sm"
                    min={1}
                  />
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 text-sm"
                  >
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-right mt-4 text-lg font-bold text-gray-800">
            مجموع نهایی: {totalPrice.toLocaleString()} تومان
          </div>
        </>
      )}

      {cart.length > 0 && (
        <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-400 space-y-4">
          <h2 className="text-xl font-bold mb-2">📦 اطلاعات سفارش</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="نام مشتری"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="شماره تماس"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="آدرس"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-green-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-150"
          >
            ثبت سفارش
          </button>
          {orderMessage && (
            <div className="text-center text-sm text-blue-700 mt-2 font-medium">{orderMessage}</div>
          )}
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="text-green-700 text-base mb-4">{orderMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
