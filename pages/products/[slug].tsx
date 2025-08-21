"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useProductBySlug from "@/hooks/useProductBySlug";
import useRelatedProducts from "@/hooks/useRelatedProducts";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CommentForm from "@/components/comments/comments";
import CommentsList from "@/components/comments/CommentsList";
import RatingForm from "@/components/rating/rating";
import AverageRating from "@/components/rating/AverageRating";

export default function ProductDetailPage() {
  const { addItem } = useCart();
  const router = useRouter();
  const { slug } = router.query;
  const { product, loading, error } = useProductBySlug(
    typeof slug === "string" ? slug : undefined
  );
  const [skip, setSkip] = useState(0);
  const take = 5;
  const { related, loading: loadingRelated } = useRelatedProducts(
    product?.slug,
    skip,
    take
  );
  const [orderMessage, setOrderMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [attributeMap, setAttributeMap] = useState<Record<string, string[]>>(
    {}
  );
  const [showToast, setShowToast] = useState(false);
  const [orderItemId, setOrderItemId] = useState<string | undefined>();
  const [userOrderItems, setUserOrderItems] = useState<{ id: string }[]>([]);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<
    string | undefined
  >();

  const { user } = useAuth();

  // New states to track if user bought the product
  const [hasBought, setHasBought] = useState(false);
  const [checkingBought, setCheckingBought] = useState(true);

  // Check if the logged-in user has bought this product
  useEffect(() => {
    if (!user || !product?.id) {
      setHasBought(false);
      setCheckingBought(false);
      return;
    }

    const checkBought = async () => {
      setCheckingBought(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API}/hasBoughtProduct?productId=${product.id}` ||`http://localhost:3003/hasBoughtProduct?productId=${product.id}`,
          {
            credentials: "include", // send cookies
          }
        );
        const data = await res.json();
        setHasBought(data.hasBought === true);
      } catch (err) {
        console.error("Error checking purchase:", err);
        setHasBought(false);
      } finally {
        setCheckingBought(false);
      }
    };

    checkBought();
  }, [user, product?.id]);

  useEffect(() => {
    if (!user || !product?.id) {
      setOrderItemId(undefined);
      return;
    }

    async function fetchLatestOrderItem() {
      try {
        const res = await fetch("http://localhost:3003/userorders", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user orders");
        const data = await res.json();

        if (!data.orders || !Array.isArray(data.orders)) {
          setOrderItemId(undefined);
          return;
        }

        // Sort orders descending by createdAt
        const sortedOrders = data.orders.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        for (const order of sortedOrders) {
          const matchingItem = order.items.find(
            (item: any) => item.variant.product.id === product!.id
          );
          if (matchingItem) {
            setOrderItemId(matchingItem.id);
            return; // Stop after first found
          }
        }

        setOrderItemId(undefined); // No matching item found
      } catch (err) {
        console.error("Error fetching latest order item:", err);
        setOrderItemId(undefined);
      }
    }

    fetchLatestOrderItem();
  }, [user, product?.id]);

  useEffect(() => {
    if (!product?.variants?.length) return;

    const map: Record<string, Set<string>> = {};

    product.variants.forEach((variant) => {
      variant.attributeValues.forEach(({ attribute, value }) => {
        if (!map[attribute.name]) map[attribute.name] = new Set();
        map[attribute.name].add(value);
      });
    });

    const grouped: Record<string, string[]> = {};
    for (const attr in map) {
      grouped[attr] = Array.from(map[attr]);
    }

    setAttributeMap(grouped);
    setSelectedAttributes({});
    setQuantity(1);
  }, [product]);

  const matchedVariant = product?.variants.find((variant) => {
    const attrs = variant.attributeValues;
    return (
      Object.entries(selectedAttributes).every(([attrName, value]) =>
        attrs.some((av) => av.attribute.name === attrName && av.value === value)
      ) && attrs.length === Object.keys(selectedAttributes).length
    );
  });

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (matchedVariant && val > matchedVariant.stock)
      val = matchedVariant.stock;
    setQuantity(val);
  }

  async function handleTestOrder() {
    if (!product || !matchedVariant) {
      setOrderMessage("لطفا ویژگی‌ها را کامل انتخاب کنید.");
      return;
    }

    if (matchedVariant.stock < quantity) {
      setOrderMessage("موجودی کافی نیست.");
      return;
    }

    const orderData = {
      customerName: "ساجده حسینی",
      customerPhone: "09214892475",
      address: "آدرس تستی",
      items: [
        {
          variantId: matchedVariant.id,
          quantity,
          price: matchedVariant.price,
        },
      ],
    };

    try {
      const res = await fetch(`/api/proxy/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const json = await res.json();

      if (res.ok) {
        setOrderMessage(`سفارش ثبت شد! شناسه سفارش: ${json.orderId}`);
      } else {
        setOrderMessage(`خطا در ثبت سفارش: ${json.error || "نامشخص"}`);
      }
    } catch {
      setOrderMessage("خطای شبکه، لطفا دوباره تلاش کنید.");
    }
  }

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">در حال بارگذاری...</p>
    );
  if (error)
    return (
      <p className="text-center py-10 text-red-600 font-semibold">
        خطا: {error}
      </p>
    );
  if (!product)
    return <p className="text-center py-10 text-gray-600">محصول یافت نشد.</p>;

  return (
    <main>
      <div className="w-11/12 flex text-gray-700">
        <div className="w-2/3">
          <h1 className="text-3xl font-extrabold mb-6">{product.title}</h1>
        </div>

        <div className="w-1/3 mx-auto p-6 bg-white rounded-lg border border-gray-400 text-gray-900">
          <p className="mb-6 leading-relaxed text-gray-700">
            {product.description}
          </p>

          <div
            className="prose max-w-none mb-10 text-gray-800"
            dangerouslySetInnerHTML={{ __html: product.content }}
          />

          <h2 className="text-2xl font-semibold mb-4">انتخاب ویژگی‌ها</h2>

          <div className="space-y-6 mb-8">
            {Object.entries(attributeMap).map(([attrName, values]) => (
              <div key={attrName}>
                <h4 className="font-medium mb-2">{attrName}:</h4>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => (
                    <button
                      key={value}
                      onClick={() =>
                        setSelectedAttributes((prev) => ({
                          ...prev,
                          [attrName]: value,
                        }))
                      }
                      className={`px-4 py-2 rounded border ${
                        selectedAttributes[attrName] === value
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {matchedVariant ? (
            <div className="p-4 border rounded bg-gray-50 mb-6">
              <p>
                <strong>قیمت:</strong> {matchedVariant.price.toLocaleString()}{" "}
                ریال
              </p>
              <p>
                <strong>موجودی:</strong>{" "}
                {matchedVariant.stock > 0 ? matchedVariant.stock : "ناموجود"}
              </p>
            </div>
          ) : (
            Object.keys(selectedAttributes).length ===
              Object.keys(attributeMap).length && (
              <p className="text-red-600 mb-6">
                واریانت مناسب با این ترکیب پیدا نشد.
              </p>
            )
          )}

          <div className="max-w-xs mb-6">
            <label
              htmlFor="quantity"
              className="block mb-1 font-semibold text-gray-700"
            >
              تعداد سفارش
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={matchedVariant?.stock || 1}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={!matchedVariant}
            />
          </div>

          <button
            className="bg-blue-500 p-2 rounded-xl text-white cursor-pointer"
            onClick={() => {
              addItem({
                title: product.title,
                productId: product.id,
                variantId: matchedVariant?.id,
                quantity,
                price: matchedVariant?.price,
              });
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
          >
            افزودن به سبد
          </button>
        </div>
      </div>

      <div className="w-11/12 text-gray-700 m-auto">
        {!loadingRelated && related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">محصولات مرتبط</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {related.map((item) => (
                <li
                  key={item.id}
                  className="border p-4 rounded shadow-sm bg-white"
                >
                  <a
                    href={`/products/${item.slug}`}
                    className="font-semibold text-blue-700"
                  >
                    {item.title}
                  </a>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-40 object-cover mt-2 rounded"
                    />
                  )}
                  {item.description && (
                    <p className="text-sm mt-2">{item.description}</p>
                  )}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSkip((prev) => prev + take)}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              بارگذاری بیشتر
            </button>
          </div>
        )}
      </div>
      <AverageRating productId={product?.id} />
      <RatingForm
        contentType="product"
        contentId={product?.id ?? ""}
        orderItemId={orderItemId}
      />
      {!checkingBought && hasBought ? (
        <CommentForm
          contentType="product"
          pageSlug={typeof slug === "string" ? slug : ""}
          productId={product?.id}
          orderItemId={orderItemId}
        />
      ) : !checkingBought && !hasBought ? (
        <p className="max-w-3xl mx-auto mt-10 text-center text-red-600 font-semibold">
          برای ارسال نظر، ابتدا باید این محصول را خریداری کنید.
        </p>
      ) : (
        <p className="max-w-3xl mx-auto mt-10 text-center text-gray-500 animate-pulse">
          در حال بررسی وضعیت خرید شما...
        </p>
      )}

      {/* Comments list is always shown */}
      <CommentsList
        contentType="product"
        pageSlug={typeof slug === "string" ? slug : ""}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-[15%] transform -translate-x-1/2 bg-blue-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all">
          محصول با موفقیت به سبد خرید افزوده شد
        </div>
      )}
    </main>
  );
}
