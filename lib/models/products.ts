export type Product = {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    imageUrl?: string;
    galleryUrls?: string[];
    createdAt: string;
    category: { id: string; title: string };
    variants: Variant[];
    modifiedContent?: string;
    toc?: TOCItem[];
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
  
  type TOCItem = { id: string; text: string; tag: string; level: number };
  
  export async function fetchProductBySlug(slug: string): Promise<Product> {
    const res = await fetch(`/api/proxy/productbyslug/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
  
    const variants: Variant[] = (data.product.variants || []).map((v: any) => ({
      ...v,
      stock: v.stock ?? 0,
      price: v.price ?? 0,
      ratingsCount: v.ratingsCount ?? 0,
      ratingsValues: v.ratingsValues ?? [],
    }));
  
    return {
      ...data.product,
      variants,
      toc: data.product.toc || [],
      modifiedContent: data.product.modifiedContent || data.product.content,
    };
  }
  