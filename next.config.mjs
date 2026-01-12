/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
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
  