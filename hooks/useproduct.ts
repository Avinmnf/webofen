// web/hooks/useProducts.ts
import { useEffect, useState } from 'react';

export type Product = {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  videoUrl?: string;
  description?: string;
  createdAt: string;
  category?: { id: string };
  tags?: { name: string }[];
};

type UseProductsOptions = {
  limit?: number;
  page?: number;
  category?: string;
  tag?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

export function useProducts(options: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('limit', String(options.limit ?? 10));
        params.append('skip', String(((options.page ?? 1) - 1) * (options.limit ?? 10)));
        if (options.category) params.append('category', options.category);
        if (options.tag) params.append('tag', options.tag);
        if (options.sort) params.append('sort', options.sort);
        if (options.order) params.append('order', options.order);

        const res = await fetch(`/api/proxy/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options.limit, options.page, options.category, options.tag, options.sort, options.order]);

  return { products, total, loading };
}
