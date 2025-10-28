'use client'
import { useEffect, useState } from 'react';

type AttributeValue = {
  value: string;
  attribute: { name: string };
};

type Variant = {
  id: string;
  price: number;
  stock: number;
  attributeValues: AttributeValue[];
  ratingsCount: number;
  ratingsValues: number[];
};

type TOCItem = {
  id: string;
  text: string;
  tag: string;
  level: number;
};

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  galleryUrls?: string[];
  createdAt: string;
  category: { id: string; title: string };
  variants: Variant[];
  modifiedContent?: string;
  toc?: TOCItem[]; // اضافه کردن TOC به نوع Product
};

export default function useProductBySlug(slug?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    fetch(`/api/proxy/productbyslug/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        // Map variants with ratings and stock
        const variants: Variant[] = (data.product.variants || []).map((v: any) => ({
          ...v,
          stock: v.stock ?? 0,
          price: v.price ?? 0,
          ratingsCount: v.ratingsCount ?? 0,
          ratingsValues: v.ratingsValues ?? [],
        }));

        // اضافه کردن TOC و modifiedContent اگر وجود دارند
        setProduct({ 
          ...data.product, 
          variants,
          toc: data.product.toc || [],
          modifiedContent: data.product.modifiedContent || data.product.content
        });
      })
      .catch((err) => setError(err.message || 'Failed to fetch'))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}