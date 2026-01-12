"use client";

import clsx from "clsx";

import React, { useEffect, useState } from "react";

const TourvisTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // 화면 너비가 768px 이상이면 데스크톱으로 간주
      const isDesktopSize = window.innerWidth >= 768;
      // User Agent로 모바일 기기 체크
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      setIsDesktop(isDesktopSize && !isMobileDevice);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const detectScrollTop = () => {
    const scrollTop = window.scrollY;
    setIsVisible(scrollTop > 0);
  };

  const handleGoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", detectScrollTop);

    return () => {
      window.removeEventListener("scroll", detectScrollTop);
    };
  }, []);

  return (
    <>
      <div className={clsx(
        "fixed z-[55] leading-none",
        isDesktop ? "bottom-[17px] right-[10px]" : "bottom-[80px] right-[10px]"
      )}>
        <div
          className={clsx(
            "flex gap-[10px]",
            !isDesktop && "flex-col",
            isDesktop && ""
          )}
        >
          <button
            className={clsx(
              'w-[48px] h-[48px] bg-[url("https://cdns.tourvis.com/common/dist/images/svg/ico-go-top.svg")] bg-no-repeat bg-contain cursor-pointer',
              isVisible ? "block" : "hidden"
            )}
            onClick={handleGoTop}
            aria-label="맨 위로"
          >
            <span className="absolute top-0 left-0 leading-0 text-0 w-0 h-0 invisible">
              맨 위로
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default TourvisTopBtn;
