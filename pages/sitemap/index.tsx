// pages/sitemap/index.tsx
import { GetServerSideProps } from "next";

type SitemapItem = {
  id: string;
  title: string;
  slug: string;
};

type Props = {
  pages: SitemapItem[];
};

export default function SitemapPage({ pages }: Props) {
  return (
    <div>
      <h1>Sitemap</h1>
      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            <a href={`/${page.slug}`}>{page.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("http://localhost:3000/api/sitemap?listKey=pages");
  const data = await res.json();

  return {
    props: {
      pages: data.data || [],
    },
  };
};
