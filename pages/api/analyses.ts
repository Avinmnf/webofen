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
    const apiUrl = `${backendUrl}/analytics/recent`;
    
    console.log('🔍 Fetching analyses from:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const analyses: Analysis[] = await response.json();
    console.log('✅ Successfully fetched analyses:', analyses.length);
    
    return res.status(200).json({ analyses });
  } catch (error: any) {
    console.error('❌ Error in analyses API:', error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout' });
    }
    
    const errorMessage = error.message || 'Unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}