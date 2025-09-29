import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { Product } from "@/lib/models/products";
import useRelatedProducts from "@/hooks/useRelatedProducts";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CommentForm from "@/components/comments/comments";
import CommentsList from "@/components/comments/CommentsList";
import RatingForm from "@/components/rating/rating";
import AverageRating from "@/components/rating/AverageRating";
import { usePageView } from "@/hooks/usePageView";
import { useCheckPurchase } from "@/hooks/useCheckPurchase"; // ✅ add this import
import { useUserOrders } from "@/hooks/useUserOrders";
import VideoPlayer from "@/components/video";
import Link from "next/link";
import SEO from "@/components/seo";
type Props = { product: Product };

export default function ProductDetailPage({ product }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const { slug } = router.query;
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
  const [showVariantTooltip, setShowVariantTooltip] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [orderItemId, setOrderItemId] = useState<string | undefined>();
  const [userOrderItems, setUserOrderItems] = useState<{ id: string }[]>([]);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<
    string | undefined
  >();

  const { user } = useAuth();

  usePageView({
    slug: product?.slug || "",
    title: product?.title || "",
    type: "product",
  });

  // Correct usage
  const {
    hasBought,
    loading: checkingBought,
    error: purchaseError,
  } = useCheckPurchase(product?.id);

  const {
    orders: userOrders,
    loading: loadingOrders,
    error: ordersError,
  } = useUserOrders();

  useEffect(() => {
    if (!product?.id || !userOrders) {
      setOrderItemId(undefined);
      return;
    }

    // Sort orders descending by createdAt
    const sortedOrders = [...userOrders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    for (const order of sortedOrders) {
      const matchingItem = order.items.find(
        (item) => item.variant?.product?.id === product.id
      );

      if (matchingItem) {
        setOrderItemId(matchingItem.id);
        return; // Stop after first match
      }
    }

    setOrderItemId(undefined);
  }, [product?.id, userOrders]);

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
  const isAddToCartDisabled = !matchedVariant;
    function handleAddToCart() {
      if (!matchedVariant) {
        setOrderMessage("لطفا ویژگی‌ها را کامل انتخاب کنید.");
        return;
      }

      if (matchedVariant.stock < quantity) {
        setOrderMessage("موجودی کافی نیست.");
        return;
      }

      addItem({
        title: product.title,
        productId: product.id,
        variantId: matchedVariant.id,
        quantity,
        price: matchedVariant.price,
        imageUrl: product.imageUrl,
        variantAttributes: matchedVariant.attributeValues.reduce(
          (acc, av) => ({ ...acc, [av.attribute.name]: av.value }),
          {}
        ),
      });

      setOrderMessage(""); // پاک کردن پیام خطا
      setShowToast(true); // نمایش Toast
      setTimeout(() => setShowToast(false), 7000); // محو شدن بعد از 7 ثانیه
    }

  return (
    <>
      <SEO
        title={product.title}
        description={product.description}
        canonical={`https://example.com/products/${product.slug}`}
      />
      <main>
        <div className="max-w-[1250px] m-auto">
          <div className="flex flex-wrap text-gray-700 pt-10">
            <div className="flex w-2/3">
              <div className="flex ml-2 p-2 rounded-3xl  border-2 border-[#f7f8fc] bg-[#f7f8fc]">
                <div className="w-1/2 p-6">
                  <div className="flex items-center">
                    <VideoPlayer product={product.imageUrl} />
                  </div>
                </div>
                <div className="w-1/2 p-6">
                  <h1 className="font-bold pb-4">خرید قرص {product.title}</h1>
                  <p className="text-justify text-sm">{product.description}</p>
                  <div className="flex items-center text-sm mt-4">
                    <span className="bg-blue-300 p-2 m-1 ml-2 rounded-xl hover:scale-110">
                      <Image
                        src="/productsvg/link.svg"
                        width={20}
                        alt="as"
                        height={20}
                      />
                    </span>
                    لینک سازی ترکیبی
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="bg-blue-300 p-2 m-1 ml-2 rounded-xl hover:scale-110">
                      <Image
                        src="/productsvg/boo.svg"
                        width={20}
                        alt="as"
                        height={20}
                      />
                    </span>
                    افزایش رتبه سریع تر در گوگل
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="bg-blue-300 p-2 m-1 ml-2 rounded-xl hover:scale-110">
                      <Image
                        src="/productsvg/chart.svg"
                        width={20}
                        alt="as"
                        height={20}
                      />
                    </span>
                    انتشار در رسانه های معتبر
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="bg-blue-300 p-2 m-1 ml-2 rounded-xl hover:scale-110">
                      <Image
                        src="/productsvg/web.svg"
                        width={20}
                        alt="as"
                        height={20}
                      />
                    </span>
                    سایت های معتبر با DA و DR بالا
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/3  p-2 rounded-3xl border-2 border-[#29b0cb] bg-[#fff]">
              <div className="space-y-6 p-6">
                <h2 className="text-xl font-semibold mb-2">انتخاب ویژگی‌ ها</h2>
                {/* Variant selection */}
                {Object.entries(attributeMap).map(([attrName, values]) => (
                  <div key={attrName}>
                    <h4 className="text-sm mb-2 ">{attrName}:</h4>
                    <div className="flex flex-wrap gap-2 ">
                      {values.map((value) => (
                        <button
                          key={value}
                          onClick={() =>
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              [attrName]: value,
                            }))
                          }
                          className={`px-4 py-2 rounded-[100px] border ${
                            selectedAttributes[attrName] === value
                              ? "bg-green-600 text-white border-indigo-600"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="p-4 border rounded bg-gray-50 mb-6">
                  <p className="text-sm">
                    <strong>قیمت:</strong>{" "}
                    {matchedVariant
                      ? matchedVariant.price.toLocaleString() + "ريال"
                      : "تعداد را مشخص کنید"}
                  </p>
                  <p className="text-sm">
                    <strong>موجودی:</strong>{" "}
                    {matchedVariant
                      ? matchedVariant.stock
                      : "تعداد را مشخص کنید"}
                  </p>
                </div>
                <p>تعداد بسته قرص</p>
                <div className="flex items-center gap-3 w-full justify-between  bg-gray-100 rounded-4xl px-4 py-4">
                  <input
                    type="number"
                    className="flex-1 mr-4 border-0 bg-gray-100 rounded-lg font-medium text-gray-700 focus:outline-none"
                    value={quantity}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val) || val < 1) val = 1;
                      if (matchedVariant && val > matchedVariant.stock)
                        val = matchedVariant.stock;
                      setQuantity(val);
                    }}
                  />
                  <button
                    className="w-5 h-5 flex items-center justify-center bg-white rounded hover:bg-gray-200 transition"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <span className="text-lg font-semibold">-</span>
                  </button>

                  <button
                    className="w-5 h-5 flex items-center justify-center  bg-white rounded hover:bg-gray-200 transition"
                    onClick={() =>
                      setQuantity((q) =>
                        matchedVariant
                          ? Math.min(q + 1, matchedVariant.stock)
                          : q + 1
                      )
                    }
                  >
                    <span className="text-lg font-semibold">+</span>
                  </button>
                </div>

                <AverageRating productId={product?.id} />
                <div
                  className="relative w-full "
                  onMouseEnter={() => {
                    if (isAddToCartDisabled) setShowVariantTooltip(true);
                  }}
                  onMouseLeave={() => setShowVariantTooltip(false)}
                >
                  {showVariantTooltip && (
                    <div className="absolute -top-8 left-1/2  transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50">
                      لطفا یک ویژگی‌ انتخاب کنید
                    </div>
                  )}

                  <button
                    className={`flex p-2 rounded-3xl text-white items-center w-full cursor-pointer justify-center ${
                      isAddToCartDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-700 hover:bg-green-800"
                    }`}
                    disabled={isAddToCartDisabled}
                    onClick={handleAddToCart}
                  >
                    <span className="text-sm p-2 ">افزودن به سبد</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <section className="flex content">
            <div className="text-gray-700 mt-6 w-4/5 p-2">
              <div
                dangerouslySetInnerHTML={{
                  __html: product.modifiedContent || "",
                }}
              />
              <div className="bg-gray-100 mt-6 w-full h-1"></div>

              {!checkingBought ? (
                hasBought ? (
                  <CommentForm
                    contentType="product"
                    pageSlug={typeof slug === "string" ? slug : ""}
                    productId={product?.id}
                    orderItemId={orderItemId}
                  />
                ) : (
                  <p className="max-w-3xl mx-auto mt-10 text-center text-red-600 font-semibold">
                    برای ارسال نظر، ابتدا باید این محصول را خریداری کنید.
                  </p>
                )
              ) : (
                <p className="max-w-3xl mx-auto mt-10 text-center text-gray-500 animate-pulse">
                  در حال بررسی وضعیت خرید شما...
                </p>
              )}
              <RatingForm
                contentType="product"
                contentId={product?.id ?? ""}
                orderItemId={orderItemId}
              />
            </div>
            <div className="w-1/5 mt-6">
              {product.toc && product.toc.length > 0 && (
                <div className="toc-sidebar">
                  <h3 className="text-gray-600">فهرست مطالب</h3>
                  <nav className="toc-nav text-sm">
                    <ul>
                      {[...product.toc].reverse().map((item) => (
                        <li
                          className={`toc-item toc-level-${item.level} mb-2 text-[#545454] hover:text-[#000]`}
                        >
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="block"
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </section>

          {/* Toast Notification */}
        {showToast && (
            <div className="fixed bottom-6 left-[50%] transform -translate-x-1/2 py-2 px-4 bg-[#6fd6e5] text-gray-700 rounded-lg shadow-lg z-50 transition-all">
              {!user ? (
                <p className="text-sm">
                  برای افزودن محصول ابتدا{" "}
                  <Link href="/login" className="underline font-semibold">
                    وارد شوید
                  </Link>
                </p>
              ) : (
                <p className="text-sm">
                  محصول {product.title} با موفقیت اضافه شد
                </p>
              )}
            </div>
          )}

        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as { slug: string };
  let product: Product | null = null;
  const website = process.env.NEXT_PUBLIC_WEBOFEN || "https://webofen.com";

  try {
    const res = await fetch(`${website}/api/proxy/productbyslug/${slug}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch product");
    const data = await res.json();
    product = data.product;
  } catch (err) {
    console.error(err);
  }

  return {
    props: { product },
  };
};