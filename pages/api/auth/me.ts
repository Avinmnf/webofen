import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.AUTH_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to get the token from various sources
    let token: string | undefined;
    
    // Try from getCookie first
    try {
      token = (await getCookie('token', { req, res })) as string | undefined;
    } catch (cookieErr) {
      console.log('Cookie read error:', cookieErr);
    }
    
    // Fallback to req.cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token as string;
    }

    // If no token, return null user (not logged in)
    if (!token) {
      return res.status(200).json({ 
        success: true,
        user: null,
        message: 'No authentication token found'
      });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError);
      // Token is invalid/expired, return null user
      return res.status(200).json({ 
        success: true,
        user: null,
        message: 'Invalid or expired token'
      });
    }

    // Fetch user from GraphQL
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Optional: if your GraphQL needs it
      },
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

    if (!response.ok) {
      console.error('GraphQL request failed:', response.status);
      return res.status(200).json({ 
        success: true,
        user: null,
        message: 'Failed to fetch user data'
      });
    }

    const { data, errors } = await response.json();

    if (errors || !data?.user) {
      console.log('User not found in database:', errors);
      return res.status(200).json({ 
        success: true,
        user: null,
        message: 'User not found'
      });
    }

    return res.status(200).json({ 
      success: true,
      user: data.user 
    });
    
  } catch (error) {
    console.error('Unexpected auth error:', error);
    // Always return 200 with null user for any unexpected errors
    return res.status(200).json({ 
      success: false,
      user: null,
      message: 'Authentication check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}