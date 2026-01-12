/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: false, // 이미지 옵티마이저 사용
      remotePatterns: [
        {
          protocol: "https",
          hostname: "cdns.tourvis.com",
          pathname: "/common/dist/images/**",
        },
        {
          protocol: "https",
          hostname: "image.tourvis.com",
          pathname: "/images/**",
        },
        {
          protocol: "https",
          hostname: "**",
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
  }
  
export default nextConfig;