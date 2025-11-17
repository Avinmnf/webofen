import Head from "next/head";
import { useRouter } from "next/router";

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  twitterCard?: string;
  structuredData?: object | null;
  productSchema?: object | null;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  additionalScripts?: React.ReactNode;
  tags?: string[];
  locale?: string;
  post?: {
    title: string;
    description: string;
    slug: string;
    imageUrl: string;
    author?: string;
    category?: string;
    keywords?: string[];
    publishedAt?: string;
    modifiedAt?: string;
  };
  product?: {
    title: string;
    description: string;
    slug: string;
    imageUrl: string;
    galleryUrls?: string[];
    sku?: string;
    brand?: string;
    variants?: {
      price: number;
      stock: number;
      priceValidUntil?: string;
    }[];
    reviews?: {
      rating: number;
      comment: string;
      user?: { name?: string };
    }[];
    aggregateRating?: {
      ratingValue: number | string;
      reviewCount: number;
    };
  };
};

const SEO: React.FC<SEOProps> = ({
  title = "",
  description = "",
  keywords = "",
  canonical = "",
  noindex = false,
  nofollow = false,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData = null,
  productSchema = null,
  author = "فروشگاه ما",
  publishedTime = "",
  modifiedTime = "",
  section = "ecommerce",
  tags = [],
  locale = "fa_IR",
  post,
  product,
  additionalScripts,
}) => {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://webofen.com";
  const currentUrl = canonical || `${baseUrl}${router.asPath}`;
  const defaultImage = ogImage || `${baseUrl}/images/og-default.jpg`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "وبوفن",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  let finalStructuredData: object | null =
    productSchema || structuredData || defaultStructuredData;

  if (ogType === "article" && post) {
    finalStructuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      image: [post.imageUrl],
      author: {
        "@type": "Person",
        name: post.author || "وبوفن",
        url: "https://webofen.com",
      },
      publisher: {
        "@type": "Organization",
        name: "وبوفن",
        logo: {
          "@type": "ImageObject",
          url: "https://webofen.com/logo.png",
        },
      },
      datePublished: post.publishedAt,
      dateModified: post.modifiedAt || post.publishedAt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${baseUrl}/article/${post.slug}`,
      },
      keywords: post.keywords || [],
      articleSection: post.category || "",
      inLanguage: "fa-IR",
    };
  } else if (ogType === "product" && product) {
    const aggregateRating =
      product.reviews && product.reviews.length > 0
        ? {
            ratingValue: (
              product.reviews.reduce((sum, r) => sum + r.rating, 0) /
              product.reviews.length
            ).toFixed(1),
            reviewCount: product.reviews.length,
          }
        : undefined;

    finalStructuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description,
      image: product.galleryUrls?.length ? product.galleryUrls : [product.imageUrl],
      sku: product.sku,
      brand: { "@type": "Brand", name: product.brand || "وبوفن" },
      offers: product.variants?.map((v) => ({
        "@type": "Offer",
        url: `${baseUrl}/products/${product.slug}`,
        priceCurrency: "IRR",
        price: v.price,
        priceValidUntil: v.priceValidUntil || "2030-12-31",
        availability:
          (v.stock ?? 0) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      })),
      review: product.reviews?.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.user?.name || "کاربر" },
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: r.comment,
      })),
      aggregateRating,
    };
  }

  return (
    <Head>
      <title>{title.includes("وبوفن") ? title : `${title} | وبوفن`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta
        name="robots"
        content={`${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`}
      />
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="وبوفن" />
      {ogType === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
          {author && <meta property="article:author" content={author} />}
        </>
      )}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={defaultImage} />
      {finalStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(finalStructuredData) }}
        />
      )}
      {additionalScripts}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      {process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `,
            }}
          />
        </>
      )}
    </Head>
  );
};

export default SEO;
