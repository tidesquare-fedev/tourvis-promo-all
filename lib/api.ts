export interface InventoryItem {
  id?: string;
  title?: string;
  imageUrl?: string;
  linkUrl?: string;
  description?: string;
  orderSeq?: number;
  createDate?: string;
  // 다양한 필드명 대응
  image?: string;
  img?: string;
  image_url?: string;
  name?: string;
  subject?: string;
  link?: string;
  url?: string;
  href?: string;
  desc?: string;
  content?: string;
  [key: string]: any;
}

export interface InventoryResponse {
  success: boolean;
  data?: {
    list?: InventoryItem[];
    total?: number;
    page?: number;
    limit?: number;
  };
  message?: string;
}

export const PROMOTION_CATEGORIES = {
  메인: "TV_IV_C_TOPBANNER",
  항공: "TV_IV_AIR_P_LINEBANNER",
  숙소: "TV_IV_HTL_TOPBANNER",
  투티: "TV_IV_TA_TOPBANNER",
  패키지: "TV_IV_PKG_TOPBANNER",
} as const;

export type PromotionCategory = keyof typeof PROMOTION_CATEGORIES;

export async function getInventoryList(
  uniqCode: string,
  page: number = 1,
  limit: number = 50
): Promise<InventoryResponse> {
  try {
    const response = await fetch(
      "https://edge.tourvis.com/tvcomm/fe/inventory/getInventoryList",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqCode,
          limit,
          page,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // 응답 구조가 다를 수 있으므로 여러 경우 처리
    if (data.success !== undefined) {
      // success 필드가 있는 경우
      return data;
    } else if (data.data || data.list || Array.isArray(data)) {
      // data 필드나 list 필드가 있거나 배열인 경우
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
      // 예상치 못한 구조
      console.warn("[Client] Unexpected API response structure");
      return {
        success: false,
        message: "데이터를 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("[Client] Error fetching inventory list");
    return {
      success: false,
      message: "데이터를 불러오는데 실패했습니다.",
    };
  }
}

