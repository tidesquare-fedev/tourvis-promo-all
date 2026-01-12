/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false, // Next Image Optimizer 사용
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
    // AVIF 미사용, WebP만 허용
    formats: ["image/webp"],
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