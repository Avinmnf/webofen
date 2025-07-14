import { useEffect, useState } from 'react';

type RelatedProduct = {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
};

export default function useRelatedProducts(slug?: string, skip = 0, take = 10) {
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({ skip: String(skip), take: String(take) });

    fetch(`http://localhost:3003/related-products/${encodeURIComponent(slug)}?${queryParams}`)
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => setRelated(data.related || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug, skip, take]);

  return { related, loading, error };
}
