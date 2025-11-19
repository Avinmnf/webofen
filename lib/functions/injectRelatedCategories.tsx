import Productvideo from "@/components/productvideo";
import { JSX } from "react";
import Link from "next/link";
import { Post } from "@/hooks/useRelatedPosts";
import Magnifier from "@/components/Magnifier/Magnifier";
interface RelatedCategory {
  id: string;
  title: string;
  products: {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    videoUrl?: string;
  }[];
}

interface Props {
  html: string;
  relatedCategories?: RelatedCategory[];
  relatedPosts?: Post[];
}

export function InjectRelatedCategories({
  html,
  relatedCategories,
  relatedPosts = [],
}: Props) {
  const hasProducts = relatedCategories && relatedCategories.length > 0;
  const hasPosts = relatedPosts.length > 0;

  console.log("🔍 Original HTML image count:", (html.match(/<img/g) || []).length);

  // Pre-process HTML to add magnifier classes to content images - SIMPLIFIED VERSION
  const processedHtml = html.replace(
    /<img\s+([^>]*)>/gi, 
    (match, attributes) => {
      console.log("🖼 Found image:", match);
      
      // Skip related post images
      if (match.includes('relatedpost')) {
        console.log("⏭ Skipping - related post image");
        return match;
      }
      
      // Skip product images
      if (match.includes('object-cover rounded-lg')) {
        console.log("⏭ Skipping - product image");
        return match;
      }
      
      // For all other images, add the magnifier class
      console.log("✅ Adding magnifier class to content image");
      
      // Handle existing class attribute
      if (match.includes('class="')) {
        return match.replace('class="', 'class="article-image-magnify ');
      } else if (match.includes("class='")) {
        return match.replace("class='", "class='article-image-magnify ");
      } else {
        // No class attribute, add one
        return match.replace('<img', '<img class="article-image-magnify"');
      }
    }
  );

  console.log("🔍 Processed HTML image count:", (processedHtml.match(/<img/g) || []).length);
  console.log("🔍 Processed HTML magnifier class count:", (processedHtml.match(/article-image-magnify/g) || []).length);

  // Debug: Check if specific parts contain images
  const h2Regex = /(<h2\b[^>]*>.*?<\/h2>)/gi;
  const parts = processedHtml.split(h2Regex);
  
  parts.forEach((part, index) => {
    const imageCount = (part.match(/<img/g) || []).length;
    const magnifierCount = (part.match(/article-image-magnify/g) || []).length;
    if (imageCount > 0) {
      console.log(`📄 Part ${index}: ${imageCount} images, ${magnifierCount} with magnifier`);
    }
  });

  if (!hasProducts && !hasPosts) {
    return (
      <div className="article-body">
        <Magnifier />
        <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
      </div>
    );
  }

  const allProducts = hasProducts
    ? relatedCategories!.flatMap((cat) => cat.products)
    : [];

  //Related Products
  const renderRelatedProducts = (index: number) => (
    <section key={`related-products-${index}`} className="my-8 md:w-full">
      <p className="text-lg text-[#3db4c6] font-semibold mb-4 border-b border-gray-200 pb-2">
        همین حالا بخرید
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {allProducts.map((prod) => (
          <a
            key={prod.id}
            href={`/products/${prod.slug}`}
            className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 flex items-center p-2 px-6"
          >
            <div className="absolute right-0 top-0 w-0 h-full bg-gradient-to-r from-[#3db4c6] to-[#77d4e3] transition-all duration-300 group-hover:w-2 rounded-r-xl"></div>

            <div className="w-20 h-20 flex-shrink-0 ml-4 relative z-10">
              {prod.videoUrl ||
              prod.imageUrl?.endsWith(".mp4") ||
              prod.imageUrl?.includes(".mp4") ? (
                <Productvideo product={prod.videoUrl || prod.imageUrl!} />
              ) : prod.imageUrl ? (
                <img
                  src={prod.imageUrl}
                  alt={prod.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>

            <div className="relative z-10 text-white group-hover:text-white transition-colors duration-300">
              <p className="text-md text-gray-600 font-semibold">
                {prod.title}
              </p>
              <p className="font-medium text-sm text-gray-600">
                جهت رفع این مشکل قرص {prod.title} سفارش دهید.
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );

  // 📰 Related Posts Section
  const renderRelatedPosts = (index: number, postIndex: number) => {
    const post = relatedPosts[postIndex % relatedPosts.length];
    if (!post) return null;

    return (
      <section
        key={`related-posts-${index}-${postIndex}`}
        className="my-8 md:w-full article-body"
      >
        <div className="grid grid-cols-1">
          <Link
            href={`/articles/${post.slug}`}
            className="bg-white rounded-md border border-gray-200 overflow-hidden transition-shadow duration-200 flex items-center p-4 pr-6"
          >
            <div className="w-1/4 flex-shrink-0 ml-4">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-20 object-cover relatedpost"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center text-center text-sm p-1 justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <p className="font-medium text-base text-gray-600">
              <span className="text-blue-800 ml-2 font-semibold">بخوانید:</span>
              {post.title}
            </p>
          </Link>
        </div>
      </section>
    );
  };

  const finalContent: (JSX.Element | string)[] = [];
  let h2Count = 0;
  let postInjectionCount = 0;
  let productsInjected = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (/<h2\b[^>]*>.*?<\/h2>/i.test(part)) {
      h2Count++;
      finalContent.push(
        <div className="article-body" key={`h2-${i}`} dangerouslySetInnerHTML={{ __html: part }} />
      );
    } else if (part.trim() !== "") {
      finalContent.push(
        <div className="article-body" key={`content-${i}`} dangerouslySetInnerHTML={{ __html: part }} />
      );

      if (h2Count === 1 && hasProducts && !productsInjected) {
        finalContent.push(renderRelatedProducts(h2Count));
        productsInjected = true;
      }

      if (hasPosts) {
        if (h2Count === 3 && postInjectionCount === 0) {
          const postElement = renderRelatedPosts(h2Count, postInjectionCount);
          if (postElement) finalContent.push(postElement);
          postInjectionCount++;
        } else if (h2Count === 7 && postInjectionCount === 1) {
          const postElement = renderRelatedPosts(h2Count, postInjectionCount);
          if (postElement) finalContent.push(postElement);
          postInjectionCount++;
        } else if (h2Count === 10 && postInjectionCount === 1) {
          const postElement = renderRelatedPosts(h2Count, postInjectionCount);
          if (postElement) finalContent.push(postElement);
          postInjectionCount++;
        }
      }
    }
  }

  return (
    <div className="article-body">
      <Magnifier />
      {finalContent}
    </div>
  );
}