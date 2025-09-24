import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from 'cookies-next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
 deleteCookie("token", {
  req,
  res,
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined,
});


    return res.status(200).json({ message: 'Logged out successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
