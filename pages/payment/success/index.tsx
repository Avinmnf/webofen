import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext"; // or wherever your cart context is

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Only clear cartnp once when payment is confirmed
    clearCart();
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-green-600">پرداخت با موفقیت انجام شد 🎉</h1>
      <p>سفارش شما ثبت شد و به زودی پردازش خواهد شد.</p>
    </div>
  );
}
