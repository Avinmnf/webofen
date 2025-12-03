import Productvideo from "@/components/productvideo";
import { JSX, useEffect, useState } from "react";
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
  const [processedHtml, setProcessedHtml] = useState<string>("");

  console.log("🔍 Original HTML image count:", (html.match(/<img/g) || []).length);

  useEffect(() => {
    const processHtml = (htmlString: string): string => {
      // Step 1: Process images for magnifier
      let processed = htmlString.replace(
        /<img\s+([^>]*)>/gi,
        (match, attributes) => {
          // Skip related post images
          if (match.includes("relatedpost")) {
            return match;
          }

          // Skip product images
          if (match.includes("object-cover rounded-lg")) {
            return match;
          }

          // For all other images, add the magnifier class
          if (match.includes('class="')) {
            return match.replace('class="', 'class="article-image-magnify ');
          } else if (match.includes("class='")) {
            return match.replace("class='", "class='article-image-magnify ");
          } else {
            return match.replace("<img", '<img class="article-image-magnify"');
          }
        }
      );

      // Step 2: Process code blocks for copy functionality
      processed = processed.replace(
        /<pre\b[^>]*>[\s\S]*?<\/pre>/gi,
        (preBlock, index) => {
          // Check if it contains code tag
          if (preBlock.includes("<code")) {
            // Extract the entire code block HTML (not just text)
            const codeWithTags = preBlock;
            
            // Also extract plain text for fallback
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = preBlock;
            const codeElement = tempDiv.querySelector("code");
            const codeText = codeElement?.textContent || "";
            const codeHtml = codeElement?.innerHTML || "";

            if (codeText.trim()) {
              // Extract language from class
              const languageMatch = preBlock.match(/language-(\w+)/);
              const language = languageMatch ? languageMatch[1] : "text";

              // Create new pre block with copy button
              return `
                <div class="code-block-container relative group my-6" data-block-id="code-${index}">
                  <div class="flex justify-between items-center bg-[#f8f8f8] text-gray-500 pt-2 rounded-t-lg">
                    <button 
                      class="copy-code-button flex items-center gap-2 px-3 py-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      data-code="${encodeURIComponent(codeText)}"
                      data-code-html="${encodeURIComponent(codeHtml)}"
                      data-full-block="${encodeURIComponent(codeWithTags)}"
                      aria-label="کپی کد"
                    >
                      <svg class="w-5 h-5 copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="code-content-wrapper">
                    ${preBlock.replace(
                      /class="([^"]*)"/,
                      'class="$1 !rounded-t-none !mt-0"'
                    )}
                  </div>
                </div>
              `;
            }
          }
          return preBlock;
        }
      );

      // Step 3: Process inline code blocks
      processed = processed.replace(
        /<code\b[^>]*>[\s\S]*?<\/code>/gi,
        (codeBlock, index) => {
          // Only process if it's a standalone code block (not inside pre)
          const isInsidePre = codeBlock.includes("</pre>") || processed.includes("<pre>") && 
            processed.indexOf(codeBlock) > processed.indexOf("<pre>") && 
            processed.indexOf(codeBlock) < processed.indexOf("</pre>");
          
          if (!isInsidePre) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = codeBlock;
            const codeText = tempDiv.textContent || "";
            const codeHtml = tempDiv.innerHTML;

            // For inline code that looks like a code snippet (has special characters)
            const hasCodeLikeContent = /[{}()<>;=+\-*/\[\]]/.test(codeText) || 
              codeText.includes("function") || 
              codeText.includes("const") || 
              codeText.includes("let") || 
              codeText.includes("var") ||
              codeText.includes("class ") ||
              codeText.includes("import ");

            if (codeText.length > 20 && hasCodeLikeContent) {
              return `
                <span class="inline-code-wrapper relative inline-block group" data-inline-id="inline-${index}">
                  <code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border border-gray-200">
                    ${codeHtml}
                  </code>
                  <button 
                    class="copy-inline-code absolute -top-2 -left-2 bg-gray-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-gray-900 z-10"
                    data-code="${encodeURIComponent(codeText)}"
                    data-code-html="${encodeURIComponent(codeHtml)}"
                    aria-label="کپی کد"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </span>
              `;
            }
          }
          return codeBlock;
        }
      );

      return processed;
    };

    setProcessedHtml(processHtml(html));
  }, [html]);

  // Add event listeners for copy buttons
  useEffect(() => {
    const handleCopy = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const copyButton = target.closest(".copy-code-button, .copy-inline-code");

      if (copyButton) {
        // Get both plain text and HTML versions
        const plainText = decodeURIComponent(copyButton.getAttribute("data-code") || "");
        const codeHtml = decodeURIComponent(copyButton.getAttribute("data-code-html") || "");
        const fullBlock = decodeURIComponent(copyButton.getAttribute("data-full-block") || "");
        
        const svg = copyButton.querySelector("svg");
        const copyText = copyButton.querySelector(".copy-text");

        try {
          // Create a blob with HTML format for rich text copy
          const htmlBlob = new Blob([`<pre><code>${codeHtml || plainText}</code></pre>`], {
            type: 'text/html'
          });
          
          const plainBlob = new Blob([plainText], {
            type: 'text/plain'
          });
          
          const clipboardItem = new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': plainBlob
          });
          
          await navigator.clipboard.write([clipboardItem]);

          // Show success state
          if (copyText) {
            copyText.textContent = "کپی شد!";
            copyText.classList.add("text-gray-600");
          }

          if (svg) {
            svg.classList.remove("text-gray-600");
            svg.classList.add("text-gray-600");
            svg.innerHTML = `
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            `;
          }

          // Reset after 2 seconds
          setTimeout(() => {
            if (copyText) {
              copyText.textContent = "کپی";
              copyText.classList.remove("text-gray-600");
            }
            if (svg) {
              svg.classList.remove("text-gray-600");
              svg.classList.add("text-gray-600");
              svg.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              `;
            }
          }, 2000);
        } catch (err) {
          console.error("Failed to copy as rich text:", err);
          
          // Fallback: copy plain text
          try {
            await navigator.clipboard.writeText(plainText);
            
            // Still show success for plain text copy
            if (copyText) {
              copyText.textContent = "کپی شد!";
              copyText.classList.add("text-green-600");
            }
            
            setTimeout(() => {
              if (copyText) {
                copyText.textContent = "کپی";
                copyText.classList.remove("text-green-600");
              }
            }, 2000);
          } catch (fallbackErr) {
            console.error("Failed to copy plain text:", fallbackErr);
            if (copyText) {
              copyText.textContent = "خطا!";
              setTimeout(() => {
                copyText.textContent = "کپی";
              }, 2000);
            }
          }
        }
      }
    };

    document.addEventListener("click", handleCopy);
    return () => document.removeEventListener("click", handleCopy);
  }, []);

  if (!hasProducts && !hasPosts) {
    return (
      <div className="article-body">
        <Magnifier />
        <div dangerouslySetInnerHTML={{ __html: processedHtml || html }} />
      </div>
    );
  }

  const allProducts = hasProducts
    ? relatedCategories!.flatMap((cat) => cat.products)
    : [];

  // Related Products
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

  // Related Posts Section
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

  const parts = (processedHtml || html).split(/(<h2\b[^>]*>.*?<\/h2>)/gi);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (/<h2\b[^>]*>.*?<\/h2>/i.test(part)) {
      h2Count++;
      finalContent.push(
        <div
          className="article-body"
          key={`h2-${i}`}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    } else if (part.trim() !== "") {
      finalContent.push(
        <div
          className="article-body"
          key={`content-${i}`}
          dangerouslySetInnerHTML={{ __html: part }}
        />
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