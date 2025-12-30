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
import { useProductRating } from "@/hooks/useProductRating";
type Props = { product: Product };

export default function ProductDetailPage({ product }: Props) {
  const { user, setRedirectPath } = useAuth(); const { addItem } = useCart();
  const router = useRouter();
  const { slug } = router.query;
  const [skip, setSkip] = useState(0);
  const take = 5;
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
  const {
    rating: ratingData,
    loading,
    error,
    submitRating,
  } = useProductRating(product.id, user?.id || "");

  const products = [
    {
      slug: "reportage",
      name: "Product 1",
      tooltip: `•	استراتژی رپورتاژ آگهی
•	پیشنهاد خرید طبق بودجه شما
•	تولید محتوا کامل به همراه تصویر
•	اعلام مدت زمان انجام پس از بررسی اولیه
`,
    },
    {
      slug: "content",
      name: "Product 2",
      tooltip: `• بدون استفاده از هوش مصنوعی
• رعایت اصول نگارشی و ساختار
• بررسی کیورد های موضوعی و رعایت آن
• مدت زمان انجام 4 روز کاری`,
    },
    {
      slug: "internal-linking",
      name: "Product 3",
      tooltip: `•	انجام لینک سازی دستی داخلی
•	مطابق با هدف گذاری کسب و کار شما
•	تاثیر بر افزایش رتبه کلمات کلیدی
•	اعلام مدت زمان انجام پس از بررسی اولیه
`,
    },
    {
      slug: "keyword-cluster",
      name: "Product 4",
      tooltip: `•	خوشه بندی کامل صنف شما
•	ارائه کلاسترتخصصی طبق بازار هدف
•	کمک به روند تولید محتوا واستراتژی ان
•	زمان انجام حداکثر 14روز کاری
`,
    },
    {
      slug: "backlink",
      name: "Product 5",
      tooltip: `•	لینک سازی در منابع قدرتمند
•	کمک به افزایش اعتبار دامنه
•	سایت های معتبر با دامین ریت بالای 50
•	زمان تحویل تا 30 روز کاری
`,
    },
    {
      slug: "screaming-frog",
      name: "Product 6",
      tooltip: `•	بهینه سازی ارور های تکنیکالی
•	کمک به بهبود رتبه
•	کمک به افزایش اعتبار سایت
•	زمان تحویل نهایتاً 30 روز کاری
`,
    },
    {
      slug: "rank-domain",
      name: "Product 7",
      tooltip: `•	افزایش DA تضمینی
•	تضمین کیفیت و عدم مشکل روی رنکینگ
•	استفاده از روش های اصولی
•	مدت زمان افزایش DA متغیر خواهد بود
`,
    },
    {
      slug: "security",
      name: "Product 8",
      tooltip: `•	بستن راه های نفوذ
•	ایجاد امنیت کامل
•	گزارش کار و تست های نفوذ
•	تحویل 15 تا 30 روز کاری

`,
    },
  ];


  useEffect(() => {
    if (!user) {
      // Store the current product page URL for redirection after login
      setRedirectPath(router.asPath);
    }
  }, [user, router.asPath, setRedirectPath]);



  const tooltipMap: Record<string, string> = products.reduce((acc, product) => {
    acc[product.slug] = product.tooltip;
    return acc;
  }, {} as Record<string, string>);

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
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      slug: product.slug,
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
  console.log(product);
  return (
    <>
      {/* --- SEO Component --- */}
      <SEO
        title={product.seoTitle}
        description={product.seoDescription}
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
          variants: product.variants?.map((v) => ({
            price: v.price,
            stock: v.stock,
          })),
          reviews: product.reviews?.map((r) => ({
            rating: r.rating,
            comment: r.comment,
            user: { name: r.user?.name },
          })),
          aggregateRating:
            product.reviews && product.reviews.length > 0
              ? {
                ratingValue: (
                  product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                  product.reviews.length
                ).toFixed(1),
                reviewCount: product.reviews.length,
              }
              : undefined,
        }}
      />
      <main>
        <div className="max-w-[1250px] m-auto">
          <div className="flex flex-wrap text-gray-700 pt-10">
            {/* --- تصاویر و توضیحات محصول --- */}
            <div className="flex md:w-2/3 w-full">
              <div className="md:flex w-full md:ml-2 mx-2 p-2 rounded-3xl border-2 border-[#f7f8fc] bg-[#f7f8fc]">
                <div className="md:w-1/2 w-full p-6 flex items-center">
                  <Productvideo product={product.videoUrl} />
                </div>
                <div className="md:w-1/2 w-full p-6">
                  <h1 className="font-bold pb-4">خرید قرص {product.title}</h1>
                  <p className="text-justify text-sm">{product.description}</p>
                  <Backlinkfeatures slug={product.slug} />
                </div>
              </div>
            </div>

            {/* --- پنل انتخاب ویژگی‌ها و افزودن به سبد --- */}
            <div className="md:w-1/3 w-full md:m-0 m-2 p-2 rounded-3xl border-2 border-[#29b0cb] bg-[#fff]">
              <div className="space-y-6 p-6">
                <h2 className="text-xl font-semibold mb-2">انتخاب ویژگی ها</h2>

                {Object.entries(attributeMap).map(([attrName, values]) => (
                  <div key={attrName}>
                    <div className="flex items-center gap-1 my-4">
                      <h4 className="text-sm">{attrName}:</h4>
                      <div className="relative group inline-block cursor-pointer">
                        <svg
                          className="w-5 h-4"
                          fill="#707070"
                          viewBox="0 0 32 32"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M15.5 3c-7.456 0-13.5 6.044-13.5 13.5s6.044 13.5 13.5 13.5 13.5-6.044 13.5-13.5-6.044-13.5-13.5-13.5zM15.5 27c-5.799 0-10.5-4.701-10.5-10.5s4.701-10.5 10.5-10.5 10.5 4.701 10.5 10.5-4.701 10.5-10.5 10.5zM15.5 10c-0.828 0-1.5 0.671-1.5 1.5v5.062c0 0.828 0.672 1.5 1.5 1.5s1.5-0.672 1.5-1.5v-5.062c0-0.829-0.672-1.5-1.5-1.5zM15.5 20c-0.828 0-1.5 0.672-1.5 1.5s0.672 1.5 1.5 1.5 1.5-0.672 1.5-1.5-0.672-1.5-1.5-1.5z"></path>{" "}
                          </g>
                        </svg>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-3 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition whitespace-pre-line min-w-[300px]  text-start">
                          {tooltipMap[product.slug]}
                        </span>
                      </div>
                    </div>

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
                  <p className="text-sm">
                    <strong>قیمت:</strong>{" "}
                    {matchedVariant
                      ? (matchedVariant.price / 10).toLocaleString() + " تومان"
                      : "تعداد را مشخص کنید"}
                  </p>
                  <p className="text-sm">
                    <strong>موجودی:</strong>{" "}
                    {matchedVariant
                      ? matchedVariant.stock
                      : "تعداد را مشخص کنید"}
                  </p>
                </div>

                <div className="flex flex-row items-center gap-2 w-full justify-between bg-gray-100 rounded-3xl px-3 sm:px-4 py-1 sm:py-2">
                  <input
                    type="number"
                    className="w-10 sm:flex border-0 bg-gray-100 rounded-lg font-medium text-gray-700 focus:outline-none py-1 sm:py-2"
                    value={quantity}
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val) || val < 1) val = 1;
                      if (matchedVariant && val > matchedVariant.stock)
                        val = matchedVariant.stock;
                      setQuantity(val);
                    }}
                  />
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      className="md:w-8 md:h-8 w-4 h-7 flex items-center justify-center bg-white rounded hover:bg-gray-200"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <button
                      className="md:w-8 md:h-8 w-4 h-7 flex items-center justify-center bg-white rounded hover:bg-gray-200"
                      onClick={() =>
                        setQuantity((q) =>
                          matchedVariant
                            ? Math.min(q + 1, matchedVariant.stock)
                            : q + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <AverageRating productId={product.id} userId={user?.id} />

                <div
                  className="relative w-full"
                  onMouseEnter={() =>
                    isAddToCartDisabled && setShowVariantTooltip(true)
                  }
                  onMouseLeave={() => setShowVariantTooltip(false)}
                >
                  {showVariantTooltip && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50">
                      لطفا یک ویژگی‌ انتخاب کنید
                    </div>
                  )}

                  <button
                    className={`flex p-2 rounded-3xl text-white items-center w-full cursor-pointer justify-center ${isAddToCartDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-700 hover:bg-green-800"
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
          <section className="flex flex-col md:flex-row mt-6 content">
            <div className="md:w-4/5 p-2 text-gray-700 order-2 md:order-1">
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

              <RatingForm productId={product?.id ?? ""} />
            </div>

            {/* --- TOC --- */}
            <div className="md:w-1/5 w-full mt-6 asidenav order-1 md:order-2">
              {product.toc && product.toc.length > 0 && (
                <div className="toc-sidebar top-2 space-y-6  justify-center">
                  <h3 className="text-gray-600 pr-2">فهرست مطالب</h3>
                  <nav className="toc-nav text-sm">
                    <ul>
                      {[...product.toc].reverse().map((item) => (
                        <li
                          key={item.id}
                          className={`toc-item toc-level-${item.level} mb-2  hover:text-[#000]`}
                        >
                          <a href={`#${item.id}`} className="block">
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

          {/* --- Toast Notification --- */}
          {showToast && (
            <div className="fixed bottom-6 left-[50%] transform -translate-x-1/2 py-2 px-4 bg-[#6fd6e5] text-gray-700 rounded-lg shadow-lg z-50 transition-all">
              {!user ? (
                <p className="text-sm">
                  برای افزودن محصول ابتدا{" "}
                  <Link
                    href="/login"
                    className="underline font-semibold"
                  // You can also pass the redirect as query param as backup
                  // href={`/login?redirect=${encodeURIComponent(router.asPath)}`}
                  >
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
