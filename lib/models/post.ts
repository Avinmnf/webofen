export type Post = {
    id: string;
    title: string;
    slug: string;
    content?: string;
    imageUrl?: string;
    imageAlt?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string; // اضافه شد
    category?: { id: string; title: string };
    tags?: { name: string }[]; // حتماً اینجا مشخص باشه
    author?: { name: string }; // اضافه شد
    ratings?: { value: number }[];
    _ratingsMeta?: { count: number };
    modifiedContent?: string;
    toc?: TOCItem[];
};
type TOCItem = { id: string; text: string; tag: string; level: number };
