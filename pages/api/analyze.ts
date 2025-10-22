import { NextApiRequest, NextApiResponse } from 'next';

const analyzeUrl = (process.env.ANALYZE_URL || 'http://localhost:4000');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    console.log('--- Incoming Request to /api/analyze ---');
    console.log('Body:', JSON.stringify(req.body, null, 2));

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
    res.status(500).json({ message: error.message || 'خطایی در ارتباط با سرور آنالایزر رخ داد' });
  }
}
