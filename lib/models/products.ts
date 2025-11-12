export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  seoDescription?: string;
  seoTitle?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  galleryUrls?: string[];
  createdAt: string;
  category: { id: string; title: string };
  variants: Variant[];
  modifiedContent?: string;
  toc?: TOCItem[];
  reviews?: Review[];
  sku?: string;
  brand?: string;
  keywords?: string; // ✅ اضافه شد
};

type AttributeValue = { value: string; attribute: { name: string } };

type Variant = {
  id: string;
  price: number;
  stock: number;
  attributeValues: AttributeValue[];
  ratingsCount: number;
  ratingsValues: number[];
};

type Review = {
  user?: { name?: string };
  rating: number;
  comment: string;
};

type TOCItem = { id: string; text: string; tag: string; level: number };
