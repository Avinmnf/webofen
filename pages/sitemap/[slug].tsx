import { GetServerSideProps } from "next";

type Props = {
  page: {
    id: string;
    title: string;
    content: string;
    slug: string;
  } | null;
};

export default function SitemapPage({ page }: Props) {
  if (!page) return <p>Page not found</p>;

  return (
    <div>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;

  const res = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query ($slug: String!) {
          page(where: { slug: $slug }) {
            id
            title
            content
            slug
          }
        }
      `,
      variables: { slug },
    }),
  });

  const json = await res.json();

  return {
    props: {
      page: json.data.page || null,
    },
  };
};
