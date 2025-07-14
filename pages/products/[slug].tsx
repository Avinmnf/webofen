import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import useProductBySlug from '@/hooks/useProductBySlug';
import useRelatedProducts from '@/hooks/useRelatedProducts';

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { product, loading, error } = useProductBySlug(typeof slug === 'string' ? slug : undefined);
  const [skip, setSkip] = useState(0);
  const take = 5;
  const { related, loading: loadingRelated } = useRelatedProducts(product?.slug, skip, take);

  const [orderMessage, setOrderMessage] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Set default selected variant once product loads
  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariantId(product.variants[0].id);
      setQuantity(1);
    }
  }, [product]);

  // Get currently selected variant object for stock check
  const selectedVariant = product?.variants.find(v => v.id === selectedVariantId);

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (selectedVariant && val > selectedVariant.stock) val = selectedVariant.stock;
    setQuantity(val);
  }

  async function handleTestOrder() {
    if (!product || !product.variants || product.variants.length === 0) {
      setOrderMessage('هیچ ویژگی‌ای برای سفارش موجود نیست.');
      return;
    }

    if (!selectedVariant) {
      setOrderMessage('لطفا یک ویژگی را انتخاب کنید.');
      return;
    }

    if (selectedVariant.stock < quantity) {
      setOrderMessage('موجودی این ویژگی کافی نیست.');
      return;
    }

    const orderData = {
      customerName: 'mahsa',
      customerPhone: '09214892475',
      address: 'آدرس تستی',
      items: [
        {
          variantId: selectedVariant.id,
          quantity,
          price: selectedVariant.price,
        },
      ],
    };

    try {
      const res = await fetch('http://localhost:3003/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const json = await res.json();

      if (res.ok) {
        setOrderMessage(`سفارش با موفقیت ثبت شد! شناسه سفارش: ${json.orderId}`);
      } else {
        setOrderMessage(`خطا در ثبت سفارش: ${json.error || 'خطای نامشخص'}`);
      }
    } catch (err) {
      setOrderMessage('خطای شبکه، لطفا دوباره تلاش کنید.');
    }
  }

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
          <label
            key={v.id}
            className={`border rounded-lg p-5 shadow-sm flex justify-between items-center cursor-pointer
              ${
                selectedVariantId === v.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300 hover:shadow-md'
              }`}
          >
            <div>
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
                className={`font-semibold ${v.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                موجودی: {v.stock > 0 ? v.stock : 'ناموجود'}
              </p>
            </div>
            <input
              type="radio"
              name="variant"
              value={v.id}
              checked={selectedVariantId === v.id}
              disabled={v.stock < 1}
              onChange={() => setSelectedVariantId(v.id)}
              className="w-5 h-5"
            />
          </label>
        ))}
      </div>

      {/* Quantity input */}
      <div className="mt-4 max-w-xs">
        <label htmlFor="quantity" className="block mb-1 font-semibold text-gray-700">
          تعداد سفارش
        </label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={selectedVariant?.stock || 1}
          value={quantity}
          onChange={handleQuantityChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          disabled={!selectedVariant}
        />
        {selectedVariant && quantity > selectedVariant.stock && (
          <p className="text-red-600 text-sm mt-1">موجودی کافی نیست.</p>
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={handleTestOrder}
          className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
          disabled={!selectedVariantId || quantity < 1 || (selectedVariant && quantity > selectedVariant.stock)}
        >
          ثبت سفارش
        </button>
        {orderMessage && <p className="mt-4 text-center text-sm text-gray-700">{orderMessage}</p>}
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
