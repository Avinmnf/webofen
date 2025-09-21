// pages/api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from 'cookies-next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // حذف کوکی
  deleteCookie('token', { req, res, path: '/' });

  return res.status(200).json({ message: 'Logged out successfully' });
}