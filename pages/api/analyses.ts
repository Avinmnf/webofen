// pages/api/analyses.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Analysis = {
  id: string;
  url: string;
  status: string;
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  name?: string;
  phoneNumber?: string;
  createdAt: string;
};

type ResponseData = {
  analyses?: Analysis[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_ANALYZE_URL || 'http://localhost:4000';
    
    console.log('🔍 Fetching analyses from backend:', `${backendUrl}/analytics/recent`);
    
    const response = await fetch(`${backendUrl}/analytics/recent`, {
      signal: AbortSignal.timeout(10000) // 10 ثانیه timeout
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const analyses: Analysis[] = await response.json();
    console.log('✅ Successfully fetched analyses:', analyses.length);
    
    res.status(200).json({ analyses });
  } catch (error) {
    console.error('❌ Error in analyses API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}
