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
import RatingForm from "@/components/rating/rating";
import AverageRating from "@/components/rating/AverageRating";
import { usePageView } from "@/hooks/usePageView";
import { useCheckPurchase } from "@/hooks/useCheckPurchase";
import { useUserOrders } from "@/hooks/useUserOrders";
import Productvideo from "@/components/productvideo";
import Link from "next/link";
import SEO from "@/components/seo";
import Backlinkfeatures from "@/components/pillfeatures/Backlinkfeatures";
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
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [attributeMap, setAttributeMap] = useState<Record<string, string[]>>({});
  const [showVariantTooltip, setShowVariantTooltip] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [orderItemId, setOrderItemId] = useState<string | undefined>();

  const { user } = useAuth();

  usePageView({
    slug: product?.slug || "",
    title: product?.title || "",
    type: "product",
  });

  const { hasBought, loading: checkingBought } = useCheckPurchase(product?.id);
  const { orders: userOrders } = useUserOrders();

  useEffect(() => {
    if (!product?.id || !userOrders) {
      setOrderItemId(undefined);
      return;
    }

    const sortedOrders = [...userOrders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    for (const order of sortedOrders) {
      const matchingItem = order.items.find(
        (item) => item.variant?.product?.id === product.id
      );
      if (matchingItem) {
        setOrderItemId(matchingItem.id);
        return;
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
    for (const attr in map) grouped[attr] = Array.from(map[attr]);
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

    setOrderMessage("");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 7000);
  }

  return (
    <>
      {/* --- SEO Component --- */}
      <SEO
        title={product.title}
        description={product.description}
        canonical={`https://webofen.com/products/${product.slug ?? ""}`}
        ogType="product"
        product={{
          title: product.title,
          description: product.description,
          slug: product.slug ?? "",
          imageUrl: product.imageUrl ?? "/images/og-default.jpg",
          galleryUrls: product.galleryUrls,
          sku: product.sku,
          brand: product.brand,
          variants: product.variants?.map((v) => ({ price: v.price, stock: v.stock })),
          reviews: product.reviews?.map((r) => ({
            rating: r.rating,
            comment: r.comment,
            user: { name: r.user?.name },
          })),
          aggregateRating: product.reviews && product.reviews.length > 0 ? {
            ratingValue: (
              product.reviews.reduce((sum, r) => sum + r.rating, 0) /
              product.reviews.length
            ).toFixed(1),
            reviewCount: product.reviews.length,
          } : undefined,
        }}
      />
      <main>
        <div className="max-w-[1250px] m-auto">
          <div className="flex flex-wrap text-gray-700 pt-10">
            {/* --- تصاویر و توضیحات محصول --- */}
            <div className="flex w-2/3">
              <div className="flex ml-2 p-2 rounded-3xl border-2 border-[#f7f8fc] bg-[#f7f8fc]">
                <div className="w-1/2 p-6 flex items-center">
                  <Productvideo product={product.imageUrl} />
                </div>
                <div className="w-1/2 p-6">
                  <h1 className="font-bold pb-4">خرید قرص {product.title}</h1>
                  <p className="text-justify text-sm">{product.description}</p>
                  <Backlinkfeatures/>
                </div>
              </div>
            </div>

            {/* --- پنل انتخاب ویژگی‌ها و افزودن به سبد --- */}
            <div className="w-1/3 p-2 rounded-3xl border-2 border-[#29b0cb] bg-[#fff]">
              <div className="space-y-6 p-6">
                <h2 className="text-xl font-semibold mb-2">انتخاب ویژگی‌ها</h2>

                {Object.entries(attributeMap).map(([attrName, values]) => (
                  <div key={attrName}>
                    <h4 className="text-sm mb-2">{attrName}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {values.map((value) => (
                        <button
                          key={value}
                          onClick={() => setSelectedAttributes(prev => ({ ...prev, [attrName]: value }))}
                          className={`px-4 py-2 rounded-[100px] border ${selectedAttributes[attrName] === value
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
                  <p className="text-sm"><strong>قیمت:</strong> {matchedVariant ? matchedVariant.price.toLocaleString() + " ریال" : "تعداد را مشخص کنید"}</p>
                  <p className="text-sm"><strong>موجودی:</strong> {matchedVariant ? matchedVariant.stock : "تعداد را مشخص کنید"}</p>
                </div>

                <div className="flex items-center gap-3 w-full justify-between bg-gray-100 rounded-4xl px-4 py-4">
                  <input
                    type="number"
                    className="flex-1 mr-4 border-0 bg-gray-100 rounded-lg font-medium text-gray-700 focus:outline-none"
                    value={quantity}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val) || val < 1) val = 1;
                      if (matchedVariant && val > matchedVariant.stock) val = matchedVariant.stock;
                      setQuantity(val);
                    }}
                  />
                  <button className="w-5 h-5 flex items-center justify-center bg-white rounded hover:bg-gray-200" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                  <button className="w-5 h-5 flex items-center justify-center bg-white rounded hover:bg-gray-200" onClick={() => setQuantity(q => matchedVariant ? Math.min(q + 1, matchedVariant.stock) : q + 1)}>+</button>
                </div>

                <AverageRating productId={product?.id} />

                <div
                  className="relative w-full"
                  onMouseEnter={() => isAddToCartDisabled && setShowVariantTooltip(true)}
                  onMouseLeave={() => setShowVariantTooltip(false)}
                >
                  {showVariantTooltip && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50">
                      لطفا یک ویژگی‌ انتخاب کنید
                    </div>
                  )}

                  <button
                    className={`flex p-2 rounded-3xl text-white items-center w-full cursor-pointer justify-center ${isAddToCartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
                      }`}
                    disabled={isAddToCartDisabled}
                    onClick={handleAddToCart}
                  >
                    <span className="text-sm p-2">افزودن به سبد</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- توضیحات محصول و نظرات --- */}
          <section className="flex mt-6 content">
            <div className="w-4/5 p-2 text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: product.modifiedContent || "" }} />
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

              <RatingForm contentType="product" contentId={product?.id ?? ""} orderItemId={orderItemId} />
            </div>

            {/* --- TOC --- */}
            <div className="w-1/5 mt-6 asidenav">
              {product.toc && product.toc.length > 0 && (
                <div className="toc-sidebar top-2 space-y-6  justify-center">
                  <h3 className="text-gray-600">فهرست مطالب</h3>
                  <nav className="toc-nav text-sm">
                    <ul>
                      {[...product.toc].reverse().map((item) => (
                        <li key={item.id} className={`toc-item toc-level-${item.level} mb-2  hover:text-[#000]`}>
                          <a href={`#${item.id}`} className="block">{item.text}</a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </section>

          {/* --- Toast Notification --- */}
          {showToast && (
            <div className="fixed bottom-6 left-[50%] transform -translate-x-1/2 py-2 px-4 bg-[#6fd6e5] text-gray-700 rounded-lg shadow-lg z-50 transition-all">
              {!user ? (
                <p className="text-sm">
                  برای افزودن محصول ابتدا <Link href="/login" className="underline font-semibold">وارد شوید</Link>
                </p>
              ) : (
                <p className="text-sm">محصول {product.title} با موفقیت اضافه شد</p>
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
    const res = await fetch(`http://localhost:3000/api/proxy/productbyslug/${slug}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`Failed to fetch product slug=${slug}`);
      return { notFound: true };
    }

    const data = await res.json();
    product = data.product;

    console.log(`GET /api/proxy/productbyslug/${slug} ${res.status}`);
    console.log(product);

    if (!product) {
      return { notFound: true };
    }
  } catch (err) {
    console.error(err);
    return { notFound: true };
  }

  return { props: { product } };
};
