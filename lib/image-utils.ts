export function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

export function getPromotionTitle(promotion: {
  title?: string;
  name?: string;
  subject?: string;
}): string {
  return promotion.title || promotion.name || promotion.subject || "제목 없음";
}

export function getPromotionLinkUrl(promotion: {
  linkUrl?: string;
  link?: string;
  url?: string;
  href?: string;
}): string | undefined {
  return promotion.linkUrl || promotion.link || promotion.url || promotion.href;
}
