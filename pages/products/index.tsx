'use client';
import { useState } from "react";
import { useProducts } from "@/hooks/useproduct";

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { products, total, loading } = useProducts({
    page,
    limit,
    category,
    sort,
    order,
  });

  return (
    <div className="text-black p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="mb-6 border-b pb-4">
            <a href={`/products/${product.slug}`} className="text-lg font-semibold">
              {product.title}
            </a>
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.title} className="w-40 mt-2" />
            )}
            {product.description && <p className="mt-2 text-sm">{product.description}</p>}
          </li>
        ))}
      </ul>

      {loading && <p>Loading more...</p>}
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={products.length < limit}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
}
