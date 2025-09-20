  console.log('GRAPHQL_URL:', process.env.NEXT_PUBLIC_GRAPHQL_URL);

  const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (!GRAPHQL_URL) throw new Error('Environment variable NEXT_PUBLIC_GRAPHQL_URL is not defined');
  const graphqlUrl: string = GRAPHQL_URL;

  export async function graphqlRequest(query: string, variables: any = {}) {
    try {
      const res = await fetch(graphqlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });

      const json = await res.json();

      if (json.errors) {
        console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
        throw new Error('GraphQL request failed');
      }

      return json.data;
    } catch (err) {
      console.error('GraphQL fetch failed:', err);
      throw err;
    }
  }

