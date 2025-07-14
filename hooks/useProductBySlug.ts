import { useEffect, useState } from 'react';

type Variant = {
  id: string;
  price: number;
  stock: number;
  attributeValues: {
    value: string;
    attribute: {
      name: string;
    };
  }[];
};

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl?: string;
  galleryUrls?: string[];
  createdAt: string;
  category: {
    id: string;
    title: string;
  };
  variants: Variant[];
};

export default function useProductBySlug(slug?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    fetch(`http://localhost:3003/productbyslug/${encodeURIComponent(slug)}`)
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setProduct(data.product ?? null);
      })
      .catch(err => setError(err.message || 'Failed to fetch'))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}
