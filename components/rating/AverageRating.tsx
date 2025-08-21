import React, { useEffect, useState } from "react";

interface AverageRatingProps {
  productId: string;
}

export default function AverageRating({ productId }: AverageRatingProps) {
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  async function fetchAverage() {
    if (!productId) return;

    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_CMS_API || "http://localhost:3003";
      const res = await fetch(`${baseUrl}/ratings-average?productId=${productId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setAverage(data.average);
      setCount(data.count);
    } catch (err) {
      console.error("Failed to load average rating:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchAverage();
}, [productId]);


  if (loading) {
    return <p className="text-gray-500 text-sm">Loading rating...</p>;
  }

  if (average === null) {
    return <p className="text-gray-500 text-sm">No ratings yet</p>;
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Star icons */}
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              i < Math.round(average) ? "text-yellow-400" : "text-gray-300"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.384 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.384-2.46a1 1 0 00-1.176 0l-3.384 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.287-3.974z" />
          </svg>
        ))}
      </div>

      {/* Average number */}
      <span className="text-sm font-medium text-gray-700">
        {average.toFixed(1)}
      </span>

      {/* Count */}
      <span className="text-sm text-gray-500">({count})</span>
    </div>
  );
}
