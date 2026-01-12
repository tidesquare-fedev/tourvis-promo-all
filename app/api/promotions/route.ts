import { NextResponse } from "next/server";
import { getAllPromotions } from "@/lib/server-api";

const CACHE_CONTROL_HEADER = "public, s-maxage=60, stale-while-revalidate=300";

export async function GET() {
  try {
    const { promotions, errors } = await getAllPromotions();
    
    return NextResponse.json(
      {
        success: true,
        data: { promotions, errors },
      },
      {
        headers: {
          "Cache-Control": CACHE_CONTROL_HEADER,
        },
      }
    );
  } catch (error) {
    // 서버 로그에만 상세 정보 기록
    console.error("[Server] Error in promotions API route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "데이터를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
