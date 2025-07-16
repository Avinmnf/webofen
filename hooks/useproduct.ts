import { useEffect, useState } from 'react';

type Product = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
};

export default function useProducts(limit = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/proxy/products?page=${page}&limit=${limit}`, {
      method: 'GET',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        if (data.products?.length < limit) setHasMore(false);
        setProducts(prev => [...prev, ...(data.products || [])]);
      })
      .catch(err => setError(err.message || 'Unknown error'))
      .finally(() => setLoading(false));
  }, [page, limit]);

  function loadMore() {
    if (hasMore) setPage(prev => prev + 1);
  }

  return { products, loading, error, loadMore, hasMore };
}
