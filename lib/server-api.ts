import { cache } from 'react';
import { PROMOTION_CATEGORIES, InventoryItem, InventoryResponse } from './api';

// React cache를 사용하여 요청 중복 방지 및 캐싱
export const getInventoryListCached = cache(async (
  uniqCode: string,
  page: number = 1,
  limit: number = 50
): Promise<InventoryResponse> => {
  try {
    const apiKey = process.env.TOURVIS_API_KEY;
    if (!apiKey) {
      throw new Error("TOURVIS_API_KEY 환경 변수가 설정되지 않았습니다.");
    }

    const response = await fetch(
      "https://edge.tourvis.com/tvcomm/fe/inventory/getInventoryList",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          uniqCode,
          limit,
          page,
        }),
        // Next.js fetch 캐싱 설정 (60초 캐시)
        next: { revalidate: 60 }
      }
    );

    if (!response.ok) {
      // 에러 응답 본문 확인
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorBody = await response.text();
        console.error(`API Error Response (${response.status}):`, errorBody);
        errorMessage += ` - ${errorBody}`;
      } catch (e) {
        console.error(`Failed to read error response body:`, e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // 응답 구조가 다를 수 있으므로 여러 경우 처리
    if (data.success !== undefined) {
      return data;
    } else if (data.data || data.list || Array.isArray(data)) {
      return {
        success: true,
        data: {
          list: Array.isArray(data) ? data : (data.data?.list || data.list || []),
          total: data.data?.total || data.total,
          page: data.data?.page || data.page || page,
          limit: data.data?.limit || data.limit || limit,
        },
      };
    } else {
      console.warn("Unexpected API response structure:", data);
      return {
        success: false,
        message: "예상치 못한 응답 구조입니다.",
      };
    }
  } catch (error) {
    console.error("Error fetching inventory list:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// 모든 카테고리의 프로모션을 한 번에 가져오기
export async function getAllPromotions() {
  const categories = Object.keys(PROMOTION_CATEGORIES) as Array<keyof typeof PROMOTION_CATEGORIES>;
  
  const promises = categories.map(async (category) => {
    const uniqCode = PROMOTION_CATEGORIES[category];
    const response = await getInventoryListCached(uniqCode, 1, 50);
    
    let list: InventoryItem[] = [];
    if (response.success && response.data?.list) {
      list = response.data.list;
    } else if (response.success && Array.isArray(response.data)) {
      list = response.data as InventoryItem[];
    }
    
    // orderSeq로 정렬하고, 동일한 경우 createDate가 최신인 것부터
    const sortedList = [...list].sort((a, b) => {
      const orderSeqA = a.orderSeq ?? 999999;
      const orderSeqB = b.orderSeq ?? 999999;
      
      if (orderSeqA !== orderSeqB) {
        return orderSeqA - orderSeqB;
      }
      
      const dateA = a.createDate ? new Date(a.createDate).getTime() : 0;
      const dateB = b.createDate ? new Date(b.createDate).getTime() : 0;
      return dateB - dateA;
    });
    
    return {
      category,
      list: sortedList,
      error: response.success ? null : (response.message || "데이터를 불러오는데 실패했습니다."),
    };
  });
  
  const results = await Promise.all(promises);
  
  // 결과를 객체로 변환
  const promotions: Record<string, InventoryItem[]> = {};
  const errors: Record<string, string | null> = {};
  
  results.forEach((result) => {
    promotions[result.category] = result.list;
    errors[result.category] = result.error;
  });
  
  return { promotions, errors };
}
