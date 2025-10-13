import Productvideo from "@/components/productvideo";
import { JSX } from "react";
import Link from "next/link";
import { Post } from "@/hooks/useRelatedPosts";

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

  if (!hasProducts && !hasPosts) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const h2Regex = /(<h2\b[^>]*>.*?<\/h2>)/gi;
  const parts = html.split(h2Regex);

  const allProducts = hasProducts
    ? relatedCategories!.flatMap((cat) => cat.products)
    : [];

  // 🛍 Related Products Section
  const renderRelatedProducts = (index: number) => (
    <section key={`related-products-${index}`} className="my-8 md:w-full">
      <h4 className="text-lg text-[#3db4c6] font-semibold mb-4 border-b border-gray-200 pb-2">
        همین حالا بخرید
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {allProducts.map((prod) => (
          <a
            key={prod.id}
            href={`/products/${prod.slug}`}
            className="bg-white rounded-xl related border border-gray-200 overflow-hidden shadow-sm transition-shadow duration-200 flex items-center p-2"
          >
            <div className="w-15 h-15 flex-shrink-0 ml-4">
              {prod.videoUrl ? (
                <Productvideo product={prod.videoUrl} />
              ) : prod.imageUrl ? (
                <img
                  src={prod.imageUrl}
                  alt={prod.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center text-center text-sm p-1 justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <p className="font-medium text-sm text-gray-600">{prod.title}</p>
          </a>
        ))}
      </div>
    </section>
  );

  // 📰 Related Posts Section
  const renderRelatedPosts = (index: number, postIndex: number) => {
    // Get one post at a time (cycle through available posts)
    const post = relatedPosts[postIndex % relatedPosts.length];

    if (!post) return null;

    return (
      <section
        key={`related-posts-${index}-${postIndex}`}
        className="my-8 md:w-full"
      >
        <div className="grid grid-cols-1">
          <Link
            href={`/articles/${post.slug}`}
            className="bg-white rounded-md border border-gray-200 overflow-hidden transition-shadow duration-200 flex items-center p-4 pr-6"
          >
            <div className="w-15 h-15 flex-shrink-0 ml-4">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center text-center text-sm p-1 justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <h5 className="font-medium text-base text-gray-600">
              <span className="text-blue-800 ml-2 font-semibold">بخوانید:</span>
              {post.title}
            </h5>
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
        <div key={`h2-${i}`} dangerouslySetInnerHTML={{ __html: part }} />
      );
    } else if (part.trim() !== "") {
      finalContent.push(
        <div key={`content-${i}`} dangerouslySetInnerHTML={{ __html: part }} />
      );


      if (h2Count === 1 && hasProducts && !productsInjected) {
        console.log("🛍 Injecting related products after first H2 content");
        finalContent.push(renderRelatedProducts(h2Count));
        productsInjected = true;
      }

      if (hasPosts) {
        if (h2Count === 3 && postInjectionCount === 0) {
          console.log("📰 Injecting first related post after third H2 content");
          const postElement = renderRelatedPosts(h2Count, postInjectionCount);
          if (postElement) finalContent.push(postElement);
          postInjectionCount++;
        }
        else if (h2Count === 7 && postInjectionCount === 1) {
          console.log(
            "📰 Injecting second related post after fifth H2 content"
          );
          const postElement = renderRelatedPosts(h2Count, postInjectionCount);
          if (postElement) finalContent.push(postElement);
          postInjectionCount++;
        } else if (h2Count === 10 && postInjectionCount === 1) {
          console.log(
            "📰 Injecting second related post after fifth H2 content"
          );
          const postElement = renderRelatedPosts(h2Count, postInjectionCount);
          if (postElement) finalContent.push(postElement);
          postInjectionCount++;
        }
      }
    }
  }

  console.log("✅ Injection summary:", {
    h2Count,
    productsInjected,
    postInjectionCount,
    totalPosts: relatedPosts.length,
  });

  return <>{finalContent}</>;
}
