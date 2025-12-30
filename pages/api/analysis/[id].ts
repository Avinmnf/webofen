// pages/api/analysis/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';

type AnalysisDetail = {
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
  sitemapAnalysis?: {
    totalLinks: number;
    sitemapExists: boolean;
    sitemapUrls: string[];
    sitemapLinks: Array<{ url: string; sitemap: string }>;
  };
};

type ResponseData = {
  analysis?: AnalysisDetail;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Analysis ID is required' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_ANALYZE_URL || 'http://localhost:4000';
    const apiUrl = `${backendUrl}/analysis/${id}`;
    
    console.log('🔍 Fetching analysis details from:', apiUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

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
      
      if (response.status === 404) {
        return res.status(404).json({ error: 'Analysis not found' });
      }
      
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const analysis: AnalysisDetail = await response.json();
    
    // 🔥 لاگ‌های مفصل برای دیباگ
    console.log('✅ Successfully fetched analysis details:', {
      id: analysis.id,
      url: analysis.url,
      status: analysis.status,
      hasSitemapAnalysis: !!analysis.sitemapAnalysis,
      sitemapExists: analysis.sitemapAnalysis?.sitemapExists,
      totalLinks: analysis.sitemapAnalysis?.totalLinks,
      sitemapUrlsCount: analysis.sitemapAnalysis?.sitemapUrls?.length,
      sitemapLinksCount: analysis.sitemapAnalysis?.sitemapLinks?.length
    });

    // 🔥 اگر مشکل داره
    if (analysis.sitemapAnalysis?.sitemapExists && analysis.sitemapAnalysis.totalLinks === 0) {
      console.log('🚨 CRITICAL: Sitemap data problem!', {
        url: analysis.url,
        sitemapUrls: analysis.sitemapAnalysis.sitemapUrls,
        expectedLinks: 'Should be > 0 but is 0'
      });
    }
    
    return res.status(200).json({ analysis });
  } catch (error: unknown) {
    console.error('❌ Error in analysis details API:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return res.status(408).json({ error: 'Request timeout' });
      }
      
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        console.log('⚠️ Analysis service not available');
        return res.status(503).json({ error: 'Analysis service unavailable' });
      }
      
      const errorMessage = error.message || 'Unknown error occurred';
      return res.status(500).json({ error: errorMessage });
    }
    
    return res.status(500).json({ error: 'Unknown error occurred' });
  }
}