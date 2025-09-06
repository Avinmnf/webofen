"use client";
import { useState } from "react";
import { useProducts } from "@/hooks/useproduct";
import Link from "next/link";
import Image from "next/image";

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const NEXT_PUBLIC_CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;
  const { products, total, loading } = useProducts({
    page,
    limit,
    category,
    sort,
    order,
  });

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6"> لیست محصولات</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            href={`/products/${product.slug}`}
            key={product.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="relative group w-[450px] h-[200px]">
              {product.imageUrl ? (
                <Image
                  src={`${NEXT_PUBLIC_CMS_URL}${product.imageUrl}`}
                  alt={product.title}
                  fill
                  className="bg-gray-200 rounded-2xl"
                />
              ) : (
                <div className="h-52 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                  بدون تصویر
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {product.title}
              </h3>
              {product.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {product.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition"
        >
          → قبلی
        </button>
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          صفحه {page}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={products.length < limit}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition"
        >
          بعدی ←
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-center text-gray-500 dark:text-gray-400 animate-pulse">
          در حال بارگذاری...
        </p>
      )}
    </div>
  );
}
