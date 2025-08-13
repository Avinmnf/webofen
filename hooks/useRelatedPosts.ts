import { useState, useEffect } from 'react';

export type Post = {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    description?: string;
    createdAt?: string;
};

export function useRelatedPosts(slug: string | null, skip = 0, take = 5) {
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        const safeSlug = slug; // TypeScript now knows safeSlug is string

        async function fetchRelatedPosts() {
            setLoading(true);
            setError(null);
            const queryParams = new URLSearchParams({ skip: String(skip), take: String(take) });

            try {
                const res = await
                    fetch(`/api/proxy/related-posts/${encodeURIComponent(safeSlug)}?${queryParams}`, {
                        method: 'GET',
                    })
                if (!res.ok) {
                    throw new Error('Failed to fetch related posts');
                }
                const data = await res.json();
                setRelatedPosts(data.related || []);
            } catch (err: any) {
                setError(err.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchRelatedPosts();
    }, [slug, skip, take]);


    return { relatedPosts, loading, error };
}
