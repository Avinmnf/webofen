// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type RequestBody = {
  url: string;
  userInfo: {
    name: string;
    phoneNumber: string;
  };
};

type ResponseData = {
  success?: boolean;
  analysisId?: string;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, userInfo }: RequestBody = req.body;

    // اعتبارسنجی
    if (!url || !userInfo?.name || !userInfo?.phoneNumber) {
      return res.status(400).json({ error: 'URL, name and phoneNumber are required' });
    }

    const backendUrl = process.env.NEXT_PUBLIC_ANALYZE_URL || 'http://localhost:4000';
    
    console.log('🚀 Starting analysis for:', url);
    console.log('👤 User info:', userInfo);

    const response = await fetch(`${backendUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        userInfo
      }),
      signal: AbortSignal.timeout(15000) // 15 ثانیه timeout
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Analysis started successfully:', result);

    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error in analyze API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}