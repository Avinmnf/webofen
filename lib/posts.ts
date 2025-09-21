import { Post, UsePostsOptions } from '@/lib/models/postlist';
import { calculateReadTime } from './readTime';

export async function fetchPosts(options: UsePostsOptions = {}) {
    try {
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

        const res = await fetch(`http://localhost:3000/api/proxy/posts?${params.toString()}`);

        if (!res.ok) {
            throw new Error(`Failed to fetch posts: ${res.status}`);
        }

        const data = await res.json();
        // محاسبه readtime برای هر پست
        const postsWithReadtime = await Promise.all(
            data.posts.map(async (post: any) => {
                let content = "";
                const safeSlug = encodeURIComponent(post.slug);
                try {
                    const postRes = await fetch(`http://localhost:3000/api/proxy/postbyslug/${safeSlug}`);
                    if (postRes.ok) {
                        const postData = await postRes.json();
                        content = postData.post.content || "";
                    }
                } catch (err) {
                    console.error("Failed to fetch post content for readtime", err);
                }
                let counts = 0
                try {
                    const res = await fetch(`http://localhost:3000/api/proxy/getviewbyslug/${safeSlug}`);
                    
                    if (!res.ok) {
                        throw new Error(`Failed to fetch page views: ${res.status}`);
                    }

                    const data = await res.json();
                    counts = data.count;
                    
                } catch (err) {
                    console.error("Failed to fetch post content for readtime", err);
                }
                return {
                    ...post,
                    readtime: calculateReadTime(content),
                    countview: counts,
                };
            })
        );

        return {
            posts: postsWithReadtime,
            total: data.total
        };
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return {
            posts: [],
            total: 0
        };
    }
}