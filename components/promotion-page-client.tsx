"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TourvisContTop from "@/components/tourvis-cont-top";
import PromotionCard from "@/components/promotion-card";
import { InventoryItem, PROMOTION_CATEGORIES, PromotionCategory } from "@/lib/api";
import { CATEGORY_HEADINGS, GRID_LAYOUT } from "@/lib/constants";

interface PromotionPageClientProps {
  initialPromotions: Record<PromotionCategory, InventoryItem[]>;
  errors?: Record<string, string | null>;
  env?: "production" | "development";
}

export default function PromotionPageClient({
  initialPromotions,
  errors = {},
  env = "production",
}: PromotionPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<PromotionCategory>("메인");

  const currentPromotions = initialPromotions[selectedCategory] ?? [];
  const hasError = errors[selectedCategory] ?? null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <TourvisContTop
        title="지금 진행 중인 여행 프로모션"
        device="mo"
        env={env}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <PageHeader />

        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as PromotionCategory)}
          className="w-full"
        >
          <CategoryTabs />

          {Object.keys(PROMOTION_CATEGORIES).map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <CategoryHeading category={category} />
              <CategoryContent
                hasError={hasError}
                promotions={currentPromotions}
                category={category as PromotionCategory}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 font-pretendard">
        지금 진행 중인 여행 프로모션
      </h1>
      <p className="text-sm md:text-base text-gray-600 font-pretendard">
        항공 · 숙소 · 투어 · 패키지까지<br />
        지금 진행 중인 프로모션을 한 번에 모았어요
      </p>
    </div>
  );
}

function CategoryTabs() {
  return (
    <TabsList
      className="grid w-full grid-cols-5 mb-8 h-12 bg-white border border-gray-200 rounded-lg p-1"
      style={{ borderRadius: "100px" }}
    >
      {Object.keys(PROMOTION_CATEGORIES).map((category) => (
        <TabsTrigger
          key={category}
          value={category}
          className="data-[state=active]:text-white data-[state=active]:shadow-sm transition-all font-medium text-sm font-pretendard"
          style={{ borderRadius: "100px" }}
        >
          {category}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

function CategoryHeading({ category }: { category: string }) {
  const headingText = CATEGORY_HEADINGS[category as PromotionCategory];
  
  if (!headingText) return null;

  return (
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-pretendard">
      {headingText}
    </h2>
  );
}

interface CategoryContentProps {
  hasError: string | null;
  promotions: InventoryItem[];
  category: PromotionCategory;
}

function CategoryContent({ hasError, promotions, category }: CategoryContentProps) {
  if (hasError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4 font-pretendard">{hasError}</p>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-pretendard">
          표시할 프로모션이 없습니다.
        </p>
      </div>
    );
  }

  const gridLayout = category === "메인" ? GRID_LAYOUT.MAIN : GRID_LAYOUT.OTHER;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${gridLayout}`}>
      {promotions.map((promotion, index) => (
        <PromotionCard
          key={promotion.id || index}
          promotion={promotion}
          category={category}
        />
      ))}
    </div>
  );
}
