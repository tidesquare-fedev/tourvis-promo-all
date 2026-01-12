import { PromotionCategory } from "./api";

export const CATEGORY_HEADINGS: Record<PromotionCategory, string> = {
  메인: "",
  항공: "항공권 할인 프로모션",
  숙소: "숙소 특가 프로모션",
  투티: "투어·티켓 할인 혜택",
  패키지: "패키지 여행 특가",
};

export const IMAGE_CONFIG = {
  HEIGHT: "202.453px",
  SIZES: "(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw",
} as const;

export const GRID_LAYOUT = {
  MAIN: "lg:grid-cols-3 xl:grid-cols-4",
  OTHER: "lg:grid-cols-3 xl:grid-cols-3",
} as const;
