"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface TourvisContTopProps {
  title: string;
  device?: 'pc' | 'mo' | 'responsive';
  share?: boolean;
  env?: "production" | "development";
}

export default function TourvisContTop({
  title,
  device = 'responsive',
  share = false,
  env = "production",
}: TourvisContTopProps) {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkDevice = () => {
      // 화면 너비가 768px 미만이면 모바일로 간주
      const isMobileSize = window.innerWidth < 768;
      // User Agent로 모바일 기기 체크
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      setIsMobile(isMobileSize || isMobileDevice);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (device === 'mo' && !isMobile) return null;
  if (device === 'pc' && isMobile) return null;

  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-[16px] h-[54px] px-[20px] bg-white border-b border-solid border-[#ebebeb]",
        isMobile && "sticky top-0 z-[100]",
        !isMobile && "max-w-[800px] mx-auto border-x"
      )}
    >
      {isMobile && (
        <button
          className="w-[24px] h-[24px] bg-[url(https://cdns.tourvis.com/common/dist/images/svg/ico-back.svg)] bg-center bg-no-repeat"
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <span className="absolute w-0 h-0 text-0 hidden">뒤로가기</span>
        </button>
      )}
      <h2
        className={clsx(
          "leading-normal text-[18px] font-[500] grow font-pretendard",
          !isMobile && "text-center"
        )}
      >
        {title}
      </h2>
      {isMobile && share && (
        <div className="w-[24px] h-[24px]">
          {/* 공유 기능은 필요시 추가 */}
        </div>
      )}
    </div>
  );
}
