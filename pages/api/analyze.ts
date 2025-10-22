import { NextApiRequest, NextApiResponse } from 'next';

const analyzeUrl = process.env.ANALYZE_URL || 'http://localhost:4000';

// مدت زمان حداکثر انتظار (میلی‌ثانیه)
const MAX_TIMEOUT = 120000; // 2 دقیقه

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MAX_TIMEOUT);

  try {
    console.log('--- Incoming Request to /api/analyze ---');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    // درخواست به سرور آنالایزر
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

    const text = await response.text();
    console.log('--- Response from Analyzer ---');
    console.log('Status:', response.status);
    console.log('Body:', text);

    if (!response.ok) {
      throw new Error(`خطا در آنالیز سایت: ${response.status} - ${text}`);
    }

    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (error: any) {
    clearTimeout(timeout);
    console.error('--- Error in /api/analyze ---');
    console.error(error);

    if (error.name === 'AbortError') {
      // Timeout
      res.status(504).json({ message: 'درخواست آنالیز طولانی شد و زمان انتظار تمام شد (504 Gateway Timeout)' });
    } else {
      res.status(500).json({ message: error.message || 'خطا در ارتباط با سرور آنالایزر' });
    }
  }
}
