import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.AUTH_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to get the token from cookie
    const token = (await getCookie('token', { req, res })) as string | undefined;
    const tokenFromReq = req.cookies?.token;

    const actualToken = token || (typeof tokenFromReq === 'string' ? tokenFromReq : undefined);

    if (!actualToken) {
      // User is not logged in, but that's okay
      return res.status(200).json({ user: null });
    }

    // Process token if exists
    const decoded = jwt.verify(actualToken, JWT_SECRET) as { userId: string };

    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query($id: ID!) {
            user(where: { id: $id }) {
              id
              name
              email
              phone
              role {
                id
                name
              }
            }
          }
        `,
        variables: { id: decoded.userId },
      }),
    });

    const { data, errors } = await response.json();

    if (errors || !data?.user) {
      console.log('User not found in database');
      return res.status(200).json({ user: null }); // still return 200 with null user
    }

    return res.status(200).json({ user: data.user });
  } catch (error) {
    console.error('Auth error:', error);
    // If token is invalid, just return null user instead of 401
    return res.status(200).json({ user: null });
  }
}
