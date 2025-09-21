import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // ارسال درخواست به Keystone
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation($email: String!, $password: String!) {
            authenticateUserWithJWT(email: $email, password: $password) {
              token
              user {
                id
                name
                email
                role {
                  id
                  name
                }
              }
            }
          }
        `,
        variables: { email, password },
      }),
    });

    const { data, errors } = await response.json();
    console.log(data);
    if (errors) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { token, user } = data.authenticateUserWithJWT;

    // ذخیره توکن در کوکی
    setCookie('token', token, {
      req,
      res,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}