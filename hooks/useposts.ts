// web/hooks/usePosts.ts
import { useEffect, useState } from 'react';

export type Post = {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    imageAlt?: string;
    description?: string;
    createdAt: string;
    category?: { id: string };
    tags: { name: string }[];
};

type UsePostsOptions = {
    limit?: number;
    page?: number;
    status?: string;
    category?: string;
    tag?: string;
    sort?: string;
    order?: 'asc' | 'desc';
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
                params.append('limit', String(options.limit ?? 10));
                params.append('skip', String(((options.page ?? 1) - 1) * (options.limit ?? 10)));
                if (options.status) params.append('status', options.status);
                if (options.category) params.append('category', options.category);
                if (options.tag) params.append('tag', options.tag);
                if (options.sort) params.append('sort', options.sort);
                if (options.order) params.append('order', options.order);

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

                const res = await
                    fetch(`/api/proxy/posts?${params.toString()}`, {
                        method: 'GET',
                    })
                const data = await res.json();
                setPosts(data.posts);
                setTotal(data.total);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [options.limit, options.page, options.status, options.category, options.tag, options.sort, options.order]);

    return { posts, total, loading };
}
