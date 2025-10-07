export type Post = {
  id: string;
  title: string;
  slug: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string; // ✅ اضافه شد
  category?: { id: string; title: string; slug :string};
  tags?: { name: string }[];
  author?: { name: string; url?: string }; // اضافه شد
  ratings?: { value: number }[];
  _ratingsMeta?: { count: number };
  modifiedContent?: string;
  toc?: TOCItem[];
  wordCount?: string; // ✅ اضافه شد
  images?: string[]; // ✅ اضافه شد
};

type TOCItem = { id: string; text: string; tag: string; level: number };
