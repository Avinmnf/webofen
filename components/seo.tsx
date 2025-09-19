// components/SEO.tsx
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string; // قبول کردن هم آرایه هم string
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  canonical?: string;
  noindex?: boolean;
}

export default function SEO({
  title = 'فروشگاه اینترنتی',
  description = 'توضیحات پیش‌فرض سایت',
  keywords = "", // پیش‌فرض آرایه خالی
  image = '/default-og.jpg',
  url = '',
  type = 'website',
  canonical,
  noindex = false,
}: SEOProps) {



  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title ? `${title} | فروشگاه ما` : 'فروشگاه ما'}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'},${noindex ? 'nofollow' : 'follow'}`} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title || 'فروشگاه ما'} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="" />
      <meta property="og:url" content="" />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="fa_IR" />
      <meta property="og:site_name" content="فروشگاه ما" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || 'فروشگاه ما'} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="" />
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Head>
  );
}