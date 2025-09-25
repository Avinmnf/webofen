'use client';

import { useState } from 'react';

export type Coupon = {
  id: string;
  title: string;
  code: string;
  discountPercentage: number;
  minTotal?: string;
  maxDiscount?: string;
};

export function useCoupon() {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState('');

  const validateCoupon = async (couponCode: string, cartTotal: number) => {
    if (!couponCode) {
      setCouponMessage('❌ لطفا کد تخفیف را وارد کنید');
      setAppliedCoupon(null);
      return null;
    }

    try {
      const res = await fetch(`/api/proxy/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCouponMessage('❌ ' + (data.error || 'خطا در اعمال کوپن'));
        setAppliedCoupon(null);
        return null;
      } else {
        setAppliedCoupon(data.coupon);
        setCouponMessage(`✅ کوپن اعمال شد: ${data.coupon.discountPercentage}% تخفیف`);
        return data.coupon;
      }
    } catch (err) {
      console.error(err);
      setCouponMessage('❌ خطا در ارتباط با سرور');
      setAppliedCoupon(null);
      return null;
    }
  };

  return {
    appliedCoupon,
    couponMessage,
    validateCoupon,
    setAppliedCoupon,
    setCouponMessage,
  };
}
