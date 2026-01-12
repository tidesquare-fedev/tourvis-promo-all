import { cache } from "react";
import { PROMOTION_CATEGORIES, InventoryItem, InventoryResponse, PromotionCategory } from "./api";

const API_ENDPOINT = "https://edge.tourvis.com/tvcomm/fe/inventory/getInventoryList";
const REVALIDATE_SECONDS = 60;
const DEFAULT_LIMIT = 50;

function getApiKey(): string {
  const apiKey = process.env.TOURVIS_API_KEY;
  if (!apiKey) {
    throw new Error("TOURVIS_API_KEY 환경 변수가 설정되지 않았습니다.");
  }
  return apiKey;
}

async function handleApiError(response: Response): Promise<never> {
  // 서버 로그에만 상세 정보 기록
  try {
    const errorBody = await response.text();
    console.error(`[Server] API Error Response (${response.status}):`, errorBody);
  } catch (e) {
    console.error(`[Server] Failed to read error response body:`, e);
  }
  // 클라이언트에는 일반화된 메시지만 전달
  throw new Error("데이터를 불러오는데 실패했습니다.");
}

function normalizeApiResponse(data: any, page: number, limit: number): InventoryResponse {
  if (data.success !== undefined) {
    return data;
  }
  
  if (data.data || data.list || Array.isArray(data)) {
    return {
      success: true,
      data: {
        list: Array.isArray(data) ? data : (data.data?.list || data.list || []),
        total: data.data?.total || data.total,
        page: data.data?.page || data.page || page,
        limit: data.data?.limit || data.limit || limit,
      },
    };
  }
  
  // 서버 로그에만 상세 정보 기록
  console.warn("[Server] Unexpected API response structure:", data);
  return {
    success: false,
    message: "데이터를 불러오는데 실패했습니다.",
  };
}

function sortPromotions(list: InventoryItem[]): InventoryItem[] {
  return [...list].sort((a, b) => {
    const orderSeqA = a.orderSeq ?? 999999;
    const orderSeqB = b.orderSeq ?? 999999;
    
    if (orderSeqA !== orderSeqB) {
      return orderSeqA - orderSeqB;
    }
    
    const dateA = a.createDate ? new Date(a.createDate).getTime() : 0;
    const dateB = b.createDate ? new Date(b.createDate).getTime() : 0;
    return dateB - dateA;
  });
}

export const getInventoryListCached = cache(
  async (uniqCode: string, page: number = 1, limit: number = DEFAULT_LIMIT): Promise<InventoryResponse> => {
    try {
      const apiKey = getApiKey();

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ uniqCode, limit, page }),
        next: { revalidate: REVALIDATE_SECONDS },
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return normalizeApiResponse(data, page, limit);
    } catch (error) {
      // 서버 로그에만 상세 정보 기록
      console.error("[Server] Error fetching inventory list:", error);
      return {
        success: false,
        message: "데이터를 불러오는데 실패했습니다.",
      };
    }
  }
);

export async function getAllPromotions() {
  const categories = Object.keys(PROMOTION_CATEGORIES) as PromotionCategory[];
  
  const results = await Promise.all(
    categories.map(async (category) => {
      const uniqCode = PROMOTION_CATEGORIES[category];
      const response = await getInventoryListCached(uniqCode);
      
      let list: InventoryItem[] = [];
      if (response.success && response.data?.list) {
        list = response.data.list;
      } else if (response.success && Array.isArray(response.data)) {
        list = response.data as InventoryItem[];
      }
      
      return {
        category,
        list: sortPromotions(list),
        error: response.success ? null : (response.message || "데이터를 불러오는데 실패했습니다."),
      };
    })
  );
  
  const promotions: Record<string, InventoryItem[]> = {};
  const errors: Record<string, string | null> = {};
  
  results.forEach(({ category, list, error }) => {
    promotions[category] = list;
    errors[category] = error;
  });
  
  return { promotions, errors };
}
