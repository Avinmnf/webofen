import { useRouter } from 'next/router';
import { useState } from 'react';
import useProductBySlug from '@/hooks/useProductBySlug';
import useRelatedProducts from '@/hooks/useRelatedProducts';

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { product, loading, error } = useProductBySlug(typeof slug === 'string' ? slug : undefined);
  const [skip, setSkip] = useState(0);
  const take = 5;
  const { related, loading: loadingRelated } = useRelatedProducts(product?.slug, skip, take);

  if (loading) return <p className="text-center py-10 text-gray-500">در حال بارگذاری...</p>;
  if (error) return <p className="text-center py-10 text-red-600 font-semibold">خطا: {error}</p>;
  if (!product) return <p className="text-center py-10 text-gray-600">محصول یافت نشد.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-900">
      <h1 className="text-3xl font-extrabold mb-6">{product.title}</h1>

      {product.imageUrl && (
        <div className="mb-8 flex justify-center">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full max-w-md rounded-lg object-cover shadow-lg"
          />
        </div>
      )}

      <p className="mb-6 leading-relaxed text-gray-700">{product.description}</p>

      <div
        className="prose max-w-none mb-10 text-gray-800"
        dangerouslySetInnerHTML={{ __html: product.content }}
      />

      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">ویژگی‌ها و قیمت‌ها</h2>

      <div className="space-y-6">
        {product.variants.map((v) => (
          <div
            key={v.id}
            className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <p className="mb-2 font-medium text-gray-800">
              ویژگی‌ها:{' '}
              <span className="font-normal text-gray-600">
                {v.attributeValues
                  .map((av) => `${av.attribute.name}: ${av.value}`)
                  .join(', ')}
              </span>
            </p>
            <p className="mb-1 text-lg font-semibold text-indigo-600">
              قیمت: {v.price.toLocaleString()} ریال
            </p>
            <p
              className={`font-semibold ${v.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}
            >
              موجودی: {v.stock > 0 ? v.stock : 'ناموجود'}
            </p>
          </div>
        ))}
      </div>
      {!loadingRelated && related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">محصولات مرتبط</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {related.map((item) => (
              <li key={item.id} className="border p-4 rounded shadow-sm bg-white">
                <a href={`/products/${item.slug}`} className="font-semibold text-blue-700">
                  {item.title}
                </a>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-40 object-cover mt-2 rounded"
                  />
                )}
                {item.description && <p className="text-sm mt-2">{item.description}</p>}
              </li>
            ))}

          </ul>
          <button onClick={() => setSkip((prev) => prev + take)}>Load More</button>
        </div>
      )}

    </div>
  );
}
