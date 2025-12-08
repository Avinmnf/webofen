import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const baseUrl = (
    process.env.NEXT_PUBLIC_WEBOFEN || "https://webofen.com/"
  ).replace(/\/+$/, "");
  
  const currentUrl = canonical || `${baseUrl}${router.asPath}`;
  
  // Use provided ogImage or fallback to blog image for articles page
  const defaultImage = ogImage || (router.asPath.includes('/articles') 
    ? "https://webofen.com/images/og-blog.jpg" 
    : "https://webofen.com/images/og-default.jpg");

  let finalStructuredData: object | null = productSchema || structuredData;

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
      image: product.galleryUrls?.length
        ? product.galleryUrls
        : [product.imageUrl],
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

  // Format title
  const formattedTitle = title 
    ? (title.includes("وبوفن") ? title : `${title} | وبوفن`)
    : "وبوفن";

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} key="desc" />
      {keywords && <meta name="keywords" content={keywords} key="keywords" />}
      <meta name="robots" content={`${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`} key="robots" />
      <meta name="author" content={author} key="author" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} key="canonical" />
      
      {/* Open Graph */}
      <meta property="og:title" content={formattedTitle} key="og:title" />
      <meta property="og:description" content={description} key="og:desc" />
      <meta property="og:image" content={defaultImage} key="og:image" />
      <meta property="og:url" content={currentUrl} key="og:url" />
      <meta property="og:type" content={ogType} key="og:type" />
      <meta property="og:locale" content={locale} key="og:locale" />
      <meta property="og:site_name" content="وبوفن" key="og:site_name" />
      
      {/* Article specific OG tags */}
      {ogType === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} key="article:published" />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} key="article:modified" />
          )}
          {section && <meta property="article:section" content={section} key="article:section" />}
          {tags.map((tag, i) => (
            <meta key={`article:tag-${i}`} property="article:tag" content={tag} />
          ))}
          {author && <meta property="article:author" content={author} key="article:author" />}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} key="twitter:card" />
      <meta name="twitter:title" content={formattedTitle} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:desc" />
      <meta name="twitter:image" content={defaultImage} key="twitter:image" />
      
      {/* Structured Data */}
{finalStructuredData && (
  Array.isArray(finalStructuredData) ? (
    finalStructuredData.map((data, index) => (
      <script
        key={`ld-json-${index}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data),
        }}
      />
    ))
  ) : (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(finalStructuredData),
      }}
      key="ld-json"
    />
  )
)}
      
      {/* Additional Scripts */}
      {additionalScripts}
      
      {/* Favicons - only include once */}
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" key="favicon-png" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" key="favicon-svg" />
      <link rel="shortcut icon" href="/favicon.ico" key="favicon-ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" key="apple-touch-icon" />
      <meta name="apple-mobile-web-app-title" content="وبوفن" key="apple-title" />
      <link rel="manifest" href="/site.webmanifest" key="manifest" />
      
      {/* Google Analytics - only in production */}
      {mounted && process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            key="ga-script"
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
            key="ga-config"
          />
        </>
      )}
    </Head>
  );
};

export default SEO;