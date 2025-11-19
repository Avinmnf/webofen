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
  sitemapAnalysis?: {
    totalLinks: number;
    sitemapExists: boolean;
    sitemapUrls: string[];
    sitemapLinks: Array<{ url: string; sitemap: string }>;
  };
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
      
      if (response.status === 404) {
        return res.status(200).json({ analyses: [] });
      }
      
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const analyses: Analysis[] = await response.json();
    
    // 🔥 لاگ‌های مفصل برای دیباگ مشکل سایت‌مپ
    console.log('✅ Successfully fetched analyses:', analyses.length);
    
    if (analyses.length > 0) {
      console.log('📊 Sitemap Analysis Debug Info:');
      analyses.forEach((analysis, index) => {
        console.log(`  Analysis ${index + 1}:`, {
          id: analysis.id,
          url: analysis.url,
          status: analysis.status,
          hasSitemapAnalysis: !!analysis.sitemapAnalysis,
          sitemapExists: analysis.sitemapAnalysis?.sitemapExists,
          totalLinks: analysis.sitemapAnalysis?.totalLinks,
          sitemapUrlsCount: analysis.sitemapAnalysis?.sitemapUrls?.length,
          sitemapLinksCount: analysis.sitemapAnalysis?.sitemapLinks?.length
        });
        
        // 🔥 اگر سایت‌مپ وجود داره اما لینک‌ها 0 هستن
        if (analysis.sitemapAnalysis?.sitemapExists && analysis.sitemapAnalysis.totalLinks === 0) {
          console.log('🚨 PROBLEM: Sitemap exists but totalLinks is 0!', {
            url: analysis.url,
            sitemapUrls: analysis.sitemapAnalysis.sitemapUrls
          });
        }
        
        // 🔥 اگر سایت‌مپ داده‌ها پر هستن
        if (analysis.sitemapAnalysis?.totalLinks && analysis.sitemapAnalysis.totalLinks > 0) {
          console.log('🎉 GOOD: Sitemap data is properly saved!', {
            url: analysis.url,
            totalLinks: analysis.sitemapAnalysis.totalLinks
          });
        }
      });
      
      // آمار کلی
      const analysesWithSitemap = analyses.filter(a => a.sitemapAnalysis?.sitemapExists);
      const analysesWithLinks = analyses.filter(a => a.sitemapAnalysis?.totalLinks && a.sitemapAnalysis.totalLinks > 0);
      
      console.log('📈 Sitemap Statistics:', {
        totalAnalyses: analyses.length,
        analysesWithSitemap: analysesWithSitemap.length,
        analysesWithLinks: analysesWithLinks.length,
        analysesWithZeroLinks: analysesWithSitemap.length - analysesWithLinks.length
      });
    }
    
    return res.status(200).json({ analyses });
  } catch (error: unknown) {
    console.error('❌ Error in analyses API:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return res.status(408).json({ error: 'Request timeout' });
      }
      
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        console.log('⚠️ Analysis service not available, returning empty array');
        return res.status(200).json({ analyses: [] });
      }
      
      const errorMessage = error.message || 'Unknown error occurred';
      return res.status(500).json({ error: errorMessage });
    }
    
    return res.status(500).json({ error: 'Unknown error occurred' });
  }
}