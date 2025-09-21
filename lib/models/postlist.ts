export type Post = {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    imageUrl?: string;
    imageAlt?: string;
    category?: { id: string; title: string };
    createdAt: string;
    readtime: number;
    countview: number;
    desc: string;
    likes: number;
    tags: { id: string; name: string }[];
  };
  
  export type PostWithViews = Post & {
    views: number;
  };
  
  export type UsePostsOptions = {
    limit?: number;
    page?: number;
    status?: string;
    category?: string;
    tag?: string;
    sort?: string;
    order?: "asc" | "desc";
  };