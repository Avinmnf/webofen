// pages/api/analysis/[id].ts
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
  result?: any;
};

type ResponseData = {
  analysis?: Analysis;
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
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Analysis ID is required' });
    }

    const backendUrl = process.env.NEXT_PUBLIC_ANALYZE_URL || 'http://localhost:4000';
    
    console.log('🔍 Fetching analysis status for:', id);

    const response = await fetch(`${backendUrl}/analysis/${id}`, {
      signal: AbortSignal.timeout(10000) // 10 ثانیه timeout
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const analysis: Analysis = await response.json();
    console.log('✅ Analysis status:', analysis.status);
    
    res.status(200).json({ analysis });
  } catch (error) {
    console.error('❌ Error in analysis status API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}