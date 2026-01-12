"use client";

import { useEffect, useState } from "react";
import {
  InventoryItem,
  PROMOTION_CATEGORIES,
  PromotionCategory,
} from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import TourvisContTop from "@/components/tourvis-cont-top";
import { isProduction } from "@/lib/env";

export default function PromotionPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<PromotionCategory>("메인");
  const [promotions, setPromotions] = useState<Record<PromotionCategory, InventoryItem[]>>({
    메인: [],
    항공: [],
    숙소: [],
    투티: [],
    패키지: [],
  });
  const [loading, setLoading] = useState<Record<PromotionCategory, boolean>>({
    메인: false,
    항공: false,
    숙소: false,
    투티: false,
    패키지: false,
  });
  const [error, setError] = useState<Record<PromotionCategory, string | null>>({
    메인: null,
    항공: null,
    숙소: null,
    투티: null,
    패키지: null,
  });

  // 서버 사이드 API를 통해 모든 프로모션 데이터를 한 번에 가져오기
  const fetchAllPromotions = async () => {
    setLoading((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        newState[key as PromotionCategory] = true;
      });
      return newState;
    });

    try {
      const response = await fetch('/api/promotions', {
        // 클라이언트 사이드에서도 캐싱 활용
        next: { revalidate: 300 }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data?.promotions) {
        setPromotions(data.data.promotions);
        
        // 에러가 있는 경우 설정
        if (data.data.errors) {
          setError(data.data.errors);
        }
      } else {
        throw new Error(data.message || "데이터를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "오류가 발생했습니다.";
      setError((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          newState[key as PromotionCategory] = errorMessage;
        });
        return newState;
      });
    } finally {
      setLoading((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          newState[key as PromotionCategory] = false;
        });
        return newState;
      });
    }
  };

  useEffect(() => {
    // 초기 로드 시 모든 프로모션 데이터를 한 번에 가져오기
    fetchAllPromotions();
  }, []);

  const handleCategoryChange = (category: PromotionCategory) => {
    setSelectedCategory(category);
    // 이미 데이터가 로드되어 있으므로 추가 호출 불필요
  };

  const currentPromotions = promotions[selectedCategory];
  const isLoading = loading[selectedCategory];
  const hasError = error[selectedCategory];

  const env = isProduction() ? "production" : "development";

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <TourvisContTop 
        title="지금 진행 중인 여행 프로모션"
        device="mo"
        env={env}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 font-pretendard">
            지금 진행 중인 여행 프로모션
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-pretendard">
            항공 · 숙소 · 투어 · 패키지까지<br />
            지금 진행 중인 프로모션을 한 번에 모았어요
          </p>
        </div>

        <Tabs
          value={selectedCategory}
          onValueChange={(value) =>
            handleCategoryChange(value as PromotionCategory)
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-8 h-12 bg-white border border-gray-200 rounded-lg p-1" style={{ borderRadius: '100px' }}>
            {Object.keys(PROMOTION_CATEGORIES).map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:text-white data-[state=active]:shadow-sm transition-all font-medium text-sm font-pretendard"
                style={{ borderRadius: '100px' }}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(PROMOTION_CATEGORIES).map((category) => {
            // 카테고리별 h2 텍스트 매핑
            const categoryHeadings: Record<string, string> = {
              "메인": "",
              "항공": "항공권 할인 프로모션",
              "숙소": "숙소 특가 프로모션",
              "투티": "투어·티켓 할인 혜택",
              "패키지": "패키지 여행 특가",
            };
            
            const headingText = categoryHeadings[category] || "";
            
            return (
              <TabsContent
                key={category}
                value={category}
                className="mt-0"
              >
                {headingText && (
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-pretendard">
                    {headingText}
                  </h2>
                )}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600 font-pretendard">로딩 중...</span>
                </div>
              ) : hasError ? (
                <div className="text-center py-20">
                  <p className="text-red-500 mb-4 font-pretendard">{hasError}</p>
                  <button
                    onClick={() => fetchAllPromotions()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-pretendard"
                  >
                    다시 시도
                  </button>
                </div>
              ) : currentPromotions.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 font-pretendard">표시할 프로모션이 없습니다.</p>
                </div>
              ) : (
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                    category === "메인" 
                      ? "lg:grid-cols-3 xl:grid-cols-4" 
                      : "lg:grid-cols-3 xl:grid-cols-3"
                  }`}>
                    {currentPromotions.map((promotion, index) => (
                      <PromotionCard 
                        key={promotion.id || index} 
                        promotion={promotion} 
                        category={category as PromotionCategory}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}

function PromotionCard({ promotion, category }: { promotion: InventoryItem; category: PromotionCategory }) {
  // imageUrl 필드 사용
  const imageUrl = promotion.imageUrl;
  const title = promotion.title || promotion.name || promotion.subject || "제목 없음";
  const description = promotion.description || promotion.desc || promotion.content;
  const linkUrl = promotion.linkUrl || promotion.link || promotion.url || promotion.href;
  
  // 메인은 object-contain, 나머지는 높이 고정하고 가로는 잘리지 않게 (위아래 공백 제거)
  const isMainCategory = category === "메인";
  const imageHeight = isMainCategory ? '202.453px' : 'auto';
  const imageClassName = isMainCategory 
    ? "w-full h-full object-contain"
    : "w-full h-auto object-contain block";
  const imageStyle = isMainCategory
    ? { height: imageHeight }
    : { 
        maxHeight: '400px',
        width: '100%'
      };
  const containerClassName = isMainCategory
    ? "relative w-full bg-gray-100 flex items-center justify-center overflow-hidden"
    : "relative w-full bg-gray-100 overflow-hidden";
  const containerStyle = isMainCategory ? { height: imageHeight } : {};

  const handleClick = () => {
    if (linkUrl) {
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      {imageUrl ? (
        <div className={containerClassName} style={containerStyle}>
          <img
            src={imageUrl}
            alt={title}
            className={imageClassName}
            style={imageStyle}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="text-gray-400 text-sm py-8">이미지를 불러올 수 없습니다</div>';
              }
            }}
          />
        </div>
      ) : (
        <div className="relative w-full bg-gray-200 flex items-center justify-center py-8">
          <div className="text-gray-400 text-sm">이미지 없음</div>
        </div>
      )}
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-2 text-sm font-pretendard" style={{ fontSize: '14px' }}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="line-clamp-3 text-xs mt-1 font-pretendard">
            {description}
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}

