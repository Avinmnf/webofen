import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    res.setHeader(
      'Set-Cookie',
      `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; ${
        process.env.NODE_ENV === 'production' ? 'Secure' : ''
      }`
    );

    return res.status(200).json({ message: 'Logged out successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
