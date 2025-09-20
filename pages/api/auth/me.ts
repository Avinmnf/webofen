import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.AUTH_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // getCookie یک Promise برمی‌گرداند، پس باید await کنیم
    const token = await getCookie('token', { req, res });
    console.log('Token from cookie:', token);
    console.log('Token type:', typeof token);

    // بررسی دقیق‌تر وجود توکن
    if (!token || typeof token !== 'string' || token.trim() === '') {
      console.log('No valid token found');
      
      // همچنین از req.cookies هم بررسی کنیم
      const tokenFromReq = req.cookies?.token;
      if (tokenFromReq && typeof tokenFromReq === 'string') {
        console.log('Found token in req.cookies:', tokenFromReq);
        // از توکن از req.cookies استفاده کنیم
        return await processToken(tokenFromReq, req, res);
      }
      
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // پردازش توکن
    return await processToken(token as string, req, res);
  } catch (error) {
    console.error('Error in auth handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// تابع جداگانه برای پردازش توکن
async function processToken(token: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    // بررسی اعتبار توکن
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log('Token decoded successfully:', decoded);
    
    // دریافت اطلاعات کاربر از Keystone
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query($id: ID!) {
            user(where: { id: $id }) {
              id
              name
              email
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
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user: data.user });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}