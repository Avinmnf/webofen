import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePostBySlug } from "@/hooks/usePostBySlug";
import CommentForm from "@/components/comments/comments";
export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { post, loading, error } = usePostBySlug(
    typeof slug === "string" ? slug : ""
  );

  // Animation trigger
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!loading && post) setMounted(true);
  }, [loading, post]);

  if (!slug || typeof slug !== "string")
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 text-xl animate-pulse">Loading post...</p>
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 text-xl animate-pulse">Loading post...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl font-semibold">Error: {error}</p>
      </div>
    );

  if (!post)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-xl">Post not found.</p>
      </div>
    );

  // Example extra info (optional, remove if you don't have these fields)
  const publishedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="relative min-h-screen px-6 sm:px-12 py-12">
      <article
        className={`max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden transition-opacity duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {post.imageUrl && (
          <div className="relative -mt-12 px-8 sm:px-16">
            <img
              src={post.imageUrl}
              alt={post.imageAlt || post.title}
              className="w-full rounded-2xl shadow-2xl object-cover max-h-[480px] mx-auto"
              loading="lazy"
            />
          </div>
        )}

        <section className="prose prose-indigo max-w-none px-8 sm:px-16 py-12 text-gray-800">
          <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        </section>
      </article>
      <CommentForm />
    </main>
  );
}
