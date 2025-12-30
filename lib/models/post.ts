export type Product = {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  videoUrl?: string;
};

export type RelatedCategory = {
  id: string;
  title: string;
  products: Product[];
};

export type PostWithViews = Post & {
  views: number;
};
type FAQ = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};
export type Post = {
  id: string;
  title: string;
  slug: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  imageAlt?: string;
  description?: string;
  seoDescription?: string;
  seoTitle?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: { id: string; title: string; slug: string };
  tags?: { name: string }[];
  author?: { name: string; url?: string };
  ratings?: { value: number }[];
  _ratingsMeta?: { count: number };
  modifiedContent?: string;
  toc?: TOCItem[];
  wordCount?: string;
  images?: string[];
  relatedCategories?: RelatedCategory[];
  views: number;
  faqs?: FAQ[]; // ← Change from 'faq' to 'faqs' to match backend
};
type TOCItem = { id: string; text: string; tag: string; level: number };
