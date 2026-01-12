import type { Metadata } from "next";
import "./globals.css";

import TourvisPcGnb from "@/registry/pc/block/pc-gnb/tourvis-pc-gnb";
import TourvisBottomTabBar from "@/registry/mo/block/mo-bottom-tab-bar/tourvis-bottom-tab-bar";
import TourvisTopBtn from "@/components/tourvis-top-btn";
import Script from "next/script";
import { APP_ENV, isProduction } from "@/lib/env";

export const metadata: Metadata = {
  title: "여행 프로모션 총정리 | 항공·숙소·투어·패키지 할인 | 투어비스",
  description: "항공권 특가, 숙소 할인, 투어·티켓 프로모션, 패키지 특가까지. 투어비스에서 지금 진행 중인 여행 할인 혜택을 한눈에 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 환경 변수에 따라 env 설정
  const env = isProduction() ? "production" : "development";
  
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <Script
        src="https://d2um1hurm6o2hd.cloudfront.net/tourvis-static/common/common-widget.js?20250710"
        strategy="afterInteractive"
      />
      <body className="font-pretendard antialiased">
        <TourvisPcGnb env={env} />
        {children}
        <TourvisBottomTabBar env={env} />
        <TourvisTopBtn />
      </body>
    </html>
  );
}

