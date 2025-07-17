'use client';

import Useproducts from "@/hooks/useproduct";

export default function ProductList() {
  const { products, loading, error, loadMore, hasMore } = Useproducts(10);

  if (error) return <p className="text-red-500">Error: {error}</p>;

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
      {hasMore && !loading && (
        <button onClick={loadMore} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Load More
        </button>
      )}
      {!hasMore && <p className="mt-4 text-gray-500">No more products.</p>}
    </div>
  );
}
