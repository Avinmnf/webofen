import { NextApiRequest, NextApiResponse } from 'next';

const analyzeUrl = process.env.ANALYZE_URL || process.env.NEXT_PUBLIC_ANALYZE_URL || 'http://localhost:4000';
const MAX_TIMEOUT = 120000; // 2 دقیقه واقعی برای safety

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MAX_TIMEOUT);

  try {
    console.log('📥 /api/analyze - Incoming Request');
    console.log('➡️ Target Analyzer URL:', `${analyzeUrl}/analyze`);

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
      console.error('❌ Analyzer responded with error:', response.status, text);
      return res.status(response.status).json({ message: text });
    }

    const data = await response.json();
    console.log('✅ Analyzer returned data');
    res.status(200).json(data);

  } catch (error: any) {
    clearTimeout(timeout);
    console.error('💥 Error in /api/analyze:', error);

    if (error.name === 'AbortError') {
      return res.status(504).json({ message: 'درخواست بیش از حد طول کشید (Timeout)' });
    }

    return res.status(500).json({ message: error.message || 'خطای ناشناخته در ارتباط با سرور آنالیز' });
  }
}
