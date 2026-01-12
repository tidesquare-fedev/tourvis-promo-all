/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // 프로덕션에서 소스맵 비활성화 (보안)
  productionBrowserSourceMaps: false,
  images: {
    // Nginx 프록시 환경에서 _next/image 경로 문제를 피하기 위해 최적화 비활성화
    // 원본 이미지를 직접 사용 (WebP 변환은 되지 않지만 이미지는 정상 표시)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdns.tourvis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.tourvis.com",
        pathname: "/**",
      },
    ],
  },
  basePath: "/marketing/all",
  experimental: {
    serverActions: {
      allowedOrigins: [
        "d.tourvis.com",
        "http://tourvis.com ", // 실제 도메인으로 변경
      ],
    },
  },
};
  
export default nextConfig;