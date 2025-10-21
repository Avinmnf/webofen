// pages/api/analyze.ts

import { NextApiRequest, NextApiResponse } from 'next';

const analyzeUrl = process.env.NEXT_PUBLIC_ANALYZE_URL || 'http://localhost:4000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // فقط درخواست های POST مجاز هستند
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${analyzeUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`خطا در آنالیز سایت: ${response.status} - ${text}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error in analyze API route:', error);
    res.status(500).json({ message: error.message || 'خطایی در ارتباط با سرور آنالایزر رخ داد' });
  }
}