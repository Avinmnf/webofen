import React from 'react';
import { useRouter } from 'next/router';
import { usePostBySlug } from '@/hooks/usePostBySlug';

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;

  const { post, loading, error } = usePostBySlug(typeof slug === 'string' ? slug : '');

  if (!slug || typeof slug !== 'string') return <p>Loading...</p>;
  if (loading) return <p>Loading post...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <article>
      <h1>{post.title}</h1>
      {post.imageUrl && <img src={post.imageUrl} alt={post.imageAlt || post.title} />}
      <p>{post.description}</p>
      {/* Render post.content here (maybe with rich text or HTML) */}
      <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
    </article>
  );
}
