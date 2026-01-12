"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import TourvisContTop from "@/components/tourvis-cont-top";
import {
  InventoryItem,
  PROMOTION_CATEGORIES,
  PromotionCategory,
} from "@/lib/api";

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
  const [selectedCategory, setSelectedCategory] =
    useState<PromotionCategory>("메인");

  const currentPromotions = initialPromotions[selectedCategory] ?? [];
  const hasError = errors[selectedCategory] ?? null;

  const handleCategoryChange = (category: PromotionCategory) => {
    setSelectedCategory(category);
  };

  // 카테고리별 h2 텍스트 매핑
  const categoryHeadings: Record<string, string> = {
    메인: "",
    항공: "항공권 할인 프로모션",
    숙소: "숙소 특가 프로모션",
    투티: "투어·티켓 할인 혜택",
    패키지: "패키지 여행 특가",
  };

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

          {Object.keys(PROMOTION_CATEGORIES).map((category) => {
            const headingText = categoryHeadings[category] || "";

            return (
              <TabsContent key={category} value={category} className="mt-0">
                {headingText && (
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-pretendard">
                    {headingText}
                  </h2>
                )}

                {hasError ? (
                  <div className="text-center py-20">
                    <p className="text-red-500 mb-4 font-pretendard">
                      {hasError}
                    </p>
                  </div>
                ) : currentPromotions.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-500 font-pretendard">
                      표시할 프로모션이 없습니다.
                    </p>
                  </div>
                ) : (
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                      category === "메인"
                        ? "lg:grid-cols-3 xl:grid-cols-4"
                        : "lg:grid-cols-3 xl:grid-cols-3"
                    }`}
                  >
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

function PromotionCard({
  promotion,
  category,
}: {
  promotion: InventoryItem;
  category: PromotionCategory;
}) {
  const imageUrl = promotion.imageUrl;
  const title =
    promotion.title || promotion.name || promotion.subject || "제목 없음";
  const linkUrl =
    promotion.linkUrl || promotion.link || promotion.url || promotion.href;

  const imageHeight = "202.453px"; // 고정 높이로 Next.js 이미지 옵티마이저 안정화
  const imageClassName = "object-contain";
  const imageStyle = { height: imageHeight };
  const containerClassName =
    "relative w-full bg-gray-100 flex items-center justify-center overflow-hidden";
  const containerStyle = { height: imageHeight };

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
          <div className="w-full h-full relative">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
              className={imageClassName}
              style={{
                ...(imageStyle as React.CSSProperties),
              }}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<div class="text-gray-400 text-sm py-8">이미지를 불러올 수 없습니다</div>';
                }
              }}
            />
          </div>
        </div>
      ) : (
        <div className="relative w-full bg-gray-200 flex items-center justify-center py-8">
          <div className="text-gray-400 text-sm">이미지 없음</div>
        </div>
      )}
    </Card>
  );
}
