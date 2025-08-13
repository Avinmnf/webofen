import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePostBySlug } from "@/hooks/usePostBySlug";
import CommentForm from "@/components/comments/comments";
import CommentsList from "@/components/comments/CommentsList";

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { post, loading, error } = usePostBySlug(
    typeof slug === "string" ? slug : ""
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!loading && post) setMounted(true);
  }, [loading, post]);

  if (!slug || typeof slug !== "string" || loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 text-xl animate-pulse">
          Loading post...
        </p>
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

  const publishedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="relative min-h-screen">
      {/* Hero Image */}
      {post.imageUrl && (
        <div className="relative w-full h-[180px] sm:h-[200px] overflow-hidden shadow-lg">
          <img
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-6 sm:left-12 text-white">
            <h1 className="text-3xl sm:text-5xl font-bold drop-shadow-lg">
              {post.title}
            </h1>
            {publishedDate && (
              <p className="mt-2 text-sm sm:text-base opacity-80">
                {publishedDate}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Post Content */}
      <article
        className={`relative max-w-4xl mx-auto -mt-16 sm:-mt-24 p-6 sm:p-10 rounded-3xl backdrop-blur-md bg-white/70 shadow-2xl transform transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <section className="prose prose-lg prose-indigo max-w-none text-gray-800">
          <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        </section>
      </article>

      {/* Comments Section */}
      <div className="max-w-4xl mx-auto mt-12 space-y-8 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Leave a Comment
          </h2>
          <CommentForm
            contentType="post"
            pageSlug={typeof slug === "string" ? slug : ""}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Comments
          </h2>
          <CommentsList
            contentType="post"
            pageSlug={typeof slug === "string" ? slug : ""}
          />
        </div>
      </div>
    </main>
  );
}
