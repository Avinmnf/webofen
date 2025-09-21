export type Post = {
    id: string;
    title: string;
    slug: string;
    content?: string;
    imageUrl?: string;
    imageAlt?: string;
    description?: string;
    createdAt?: string;
    category?: { id: string; title: string };
    tags?: { name: string }[];
    ratings?: { value: number }[];
    _ratingsMeta?: { count: number };
    modifiedContent?: string;
    toc?: TOCItem[];
};
type TOCItem = { id: string; text: string; tag: string; level: number };
