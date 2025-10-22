import { NextApiRequest, NextApiResponse } from 'next';

const analyzeUrl = process.env.ANALYZE_URL || 'http://localhost:4000';
const MAX_TIMEOUT = 250000; // احتمالا تایپ اشتباه بوده — 2,500,000 یعنی 41 دقیقه 😅

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MAX_TIMEOUT);

  try {
    console.log('--- Incoming Request to /api/analyze ---');
    console.log('Body:', req.body);

    const response = await fetch(`${analyzeUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ message: text });
    }

    // 👇 سریع‌تر و سبک‌تر از text() + parse
    const data = await response.json();
    res.status(200).json(data);
    console.log(data);

  } catch (error: any) {
    clearTimeout(timeout);
    console.error('--- Error in /api/analyze ---', error);

    if (error.name === 'AbortError') {
      res.status(504).json({ message: 'درخواست آنالیز طولانی شد و زمان انتظار تمام شد (504 Gateway Timeout)' });
    } else {
      res.status(500).json({ message: error.message || 'خطا در ارتباط با سرور آنالایزر' });
    }
  }
}
