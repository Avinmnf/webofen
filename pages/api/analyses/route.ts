// app/api/analyses/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const analyzeurl = process.env.NEXT_PUBLIC_ANALYZE_URL || 'http://localhost:4000';
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '50';
    
    console.log('🔍 Fetching analyses from backend:', `${analyzeurl}/analytics/recent?limit=${limit}`);
    
    const response = await fetch(`${analyzeurl}/analytics/recent?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('❌ Backend response error:', response.status, response.statusText);
      throw new Error(`Failed to fetch analyses: ${response.statusText}`);
    }

    const analyses = await response.json();
    console.log('✅ Successfully fetched analyses:', analyses.length);
    
    return NextResponse.json(analyses, {
      status: 200,
    });
  } catch (error) {
    console.error('❌ Error in analyses API route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch analyses',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}