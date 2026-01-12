/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "/marketing/all",
  // 외부 이미지 도메인 허용 (이미지 옵티마이저)
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdns.tourvis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tourvis.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = nextConfig;

