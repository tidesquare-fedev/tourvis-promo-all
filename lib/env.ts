/**
 * 환경 변수 타입 정의 및 유틸리티
 */

export type AppEnv = 'production' | 'development';
export type AppBrand = 'tourvis';

// 환경 변수 가져오기
export const APP_ENV: AppEnv = (process.env.NEXT_PUBLIC_APP_ENV as AppEnv) || 'production';
export const APP_BRAND: AppBrand = (process.env.NEXT_PUBLIC_APP_BRAND as AppBrand) || 'tourvis';

// 도메인 설정
export const DOMAINS = {
  development: 'd.tourvis.com',
  production: 'tourvis.com',
} as const;

export const getDomain = (): string => {
  return DOMAINS[APP_ENV];
};

export const getBaseUrl = (): string => {
  const domain = getDomain();
  return `https://${domain}`;
};

// 환경 확인 유틸리티
export const isProduction = (): boolean => APP_ENV === 'production';
export const isDevelopment = (): boolean => APP_ENV === 'development';
