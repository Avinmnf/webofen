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
  