// pages/api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from 'cookies-next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  deleteCookie('token', {
    req,
    res,
    path: '/',                 // باید مثل login باشه
    domain: process.env.NODE_ENV === 'production' ? '.webofen.com' : undefined,
  });

  return res.status(200).json({ message: 'Logged out successfully' });
}
