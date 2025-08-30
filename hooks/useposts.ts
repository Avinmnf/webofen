import { useEffect, useState } from "react";
import { calculateReadTime } from "./readTime";

type Post = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: {id: string; title: string;}
  createdAt: string;
  readtime: number;
  desc: string;
  likes: number;
  tags: { id: string; name: string }[];
};

type UsePostsOptions = {
  limit?: number;
  page?: number;
  status?: string;
  category?: string;
  tag?: string;
  sort?: string;
  order?: "asc" | "desc";
};

export function usePosts(options: UsePostsOptions) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("limit", String(options.limit ?? 10));
        params.append(
          "skip",
          String(((options.page ?? 1) - 1) * (options.limit ?? 10))
        );
        if (options.status) params.append("status", options.status);
        if (options.category) params.append("category", options.category);
        if (options.tag) params.append("tag", options.tag);
        if (options.sort) params.append("sort", options.sort);
        if (options.order) params.append("order", options.order);

        const res = await fetch(`/api/proxy/posts?${params.toString()}`);
        const data = await res.json();

        // ✅ For each post, fetch its full content to calculate readtime
        const postsWithReadtime = await Promise.all(
          data.posts.map(async (post: any) => {
            let content = "";
            try {
              const postRes = await fetch(`/api/proxy/post/${post.slug}`);
              const postData = await postRes.json();
              content = postData.content || "";
            } catch (err) {
              console.error("Failed to fetch post content for readtime", err);
            }

            return {
              ...post,
              readtime: calculateReadTime(content),
            };
          })
        );

        setPosts(postsWithReadtime);
        setTotal(data.total);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [
    options.limit,
    options.page,
    options.status,
    options.category,
    options.tag,
    options.sort,
    options.order,
  ]);

  return { posts, total, loading };
}