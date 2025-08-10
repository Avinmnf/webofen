'use client';

import React, { useState } from 'react';

interface RatingFormProps {
  contentType: 'post' | 'product';
  contentId: string;      // productId or postId
  orderItemId?: string;   // required for product rating
}

export default function RatingForm({ contentType, contentId, orderItemId }: RatingFormProps) {
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClick = async (starValue: number) => {
    setValue(starValue);
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('http://localhost:3003/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          value: starValue,
          productId: contentType === 'product' ? contentId : undefined,
          postId: contentType === 'post' ? contentId : undefined,
          orderItemId: contentType === 'product' ? orderItemId : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error submitting rating');

      setSuccess('✅ Thank you for your rating!');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rating-form max-w-md mx-auto mt-4 p-4 border rounded shadow-sm">
      <p className="mb-2 font-semibold">Rate this {contentType}:</p>
      <div className="stars flex gap-2 cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            filled={star <= value}
            onClick={() => handleClick(star)}
            disabled={loading}
          />
        ))}
      </div>
      {loading && <p className="mt-2 text-gray-600">Submitting...</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {success && <p className="mt-2 text-green-600">{success}</p>}
    </div>
  );
}

function Star({
  filled,
  onClick,
  disabled,
}: {
  filled: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <svg
      onClick={disabled ? undefined : onClick}
      xmlns="http://www.w3.org/2000/svg"
      fill={filled ? 'gold' : 'gray'}
      viewBox="0 0 24 24"
      stroke="none"
      className={`w-8 h-8 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
