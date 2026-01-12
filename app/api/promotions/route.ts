import { NextResponse } from 'next/server';
import { getAllPromotions } from '@/lib/server-api';

// API Route에서 서버 사이드로 모든 프로모션 데이터를 가져오고 캐싱
export async function GET() {
  try {
    const { promotions, errors } = await getAllPromotions();
    
    return NextResponse.json({
      success: true,
      data: {
        promotions,
        errors,
      },
    }, {
      // HTTP 캐싱 헤더 설정 (5분)
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error in promotions API route:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
