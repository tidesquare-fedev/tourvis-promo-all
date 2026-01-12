"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { InventoryItem, PromotionCategory } from "@/lib/api";
import { normalizeImageUrl, getPromotionTitle, getPromotionLinkUrl } from "@/lib/image-utils";
import { IMAGE_CONFIG } from "@/lib/constants";

interface PromotionCardProps {
  promotion: InventoryItem;
  category: PromotionCategory;
}

export default function PromotionCard({ promotion, category }: PromotionCardProps) {
  const imageUrl = normalizeImageUrl(promotion.imageUrl);
  const title = getPromotionTitle(promotion);
  const linkUrl = getPromotionLinkUrl(promotion);

  const handleClick = () => {
    if (linkUrl) {
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = '<div class="text-gray-400 text-sm py-8">이미지를 불러올 수 없습니다</div>';
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      {imageUrl ? (
        <div
          className="relative w-full bg-gray-100 flex items-center justify-center overflow-hidden"
          style={{ height: IMAGE_CONFIG.HEIGHT }}
        >
          <div className="w-full h-full relative">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes={IMAGE_CONFIG.SIZES}
              className="object-contain"
              loading="lazy"
              decoding="async"
              onError={handleImageError}
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
