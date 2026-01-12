/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // 프로덕션에서 소스맵 비활성화 (보안)
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: false,
    formats: ["image/webp"],
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